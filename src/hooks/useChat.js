import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMessages, openChatSocket, sendMessage as apiSend } from '../lib/api';

const RECONNECT_BACKOFF = [0, 1000, 2000, 4000, 8000, 15000];

function makeTempId() {
  return `tmp-${Math.random().toString(36).slice(2, 10)}`;
}

function isTempId(id) {
  return typeof id === 'string' && id.startsWith('tmp-');
}

/**
 * Chat hook for a single thread. Pass chatSessionId for admin viewing a user
 * thread; omit it for a regular user (server resolves to their own session).
 *
 * Sync strategy:
 *   - On first connect: load full history; record highest server id seen.
 *   - On reconnect: load only `since_id=lastSeenId` and MERGE on top of the
 *     existing list (preserves optimistic in-flight messages).
 *   - WS frames arriving DURING a fetch are buffered, then drained after the
 *     fetch lands so we never lose a message to a race.
 */
export function useChat({ chatSessionId } = {}) {
  const [messages, setMessages] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(chatSessionId ?? null);
  const [status, setStatus] = useState('connecting'); // 'connecting' | 'open' | 'offline'
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const wsRef = useRef(null);
  const attemptsRef = useRef(0);
  const cancelRef = useRef(false);
  const reconnectTimerRef = useRef(null);
  const lastSeenIdRef = useRef(0);
  const loadingRef = useRef(false);
  const pendingFramesRef = useRef([]);

  // Functional updater that merges a single incoming message by id.
  const mergeOne = (prev, incoming) => {
    if (typeof incoming.id === 'number' && incoming.id > lastSeenIdRef.current) {
      lastSeenIdRef.current = incoming.id;
    }
    // Already present (server-confirmed echo of a message we already have).
    if (prev.some((m) => m.id === incoming.id)) return prev;
    // Optimistic match: find first pending message with same sender+body and
    // replace it. The dedup-collapse case (user sends identical text twice
    // before server confirms either) is accepted: at worst we lose visual
    // distinction; data integrity is preserved (both are stored).
    const pendingIdx = prev.findIndex(
      (m) =>
        m.pending &&
        isTempId(m.id) &&
        m.sender === incoming.sender &&
        m.body === incoming.body,
    );
    if (pendingIdx !== -1) {
      const next = prev.slice();
      next[pendingIdx] = { ...incoming, pending: false };
      return next;
    }
    return [...prev, incoming];
  };

  const applyMessage = useCallback((incoming) => {
    if (loadingRef.current) {
      // Buffer; will be drained on top of the fetched batch.
      pendingFramesRef.current.push(incoming);
      return;
    }
    setMessages((prev) => mergeOne(prev, incoming));
  }, []);

  // Sync history. First call (sinceId=0) is a full hydrate; subsequent calls
  // are incremental and MERGE so we don't blow away optimistic pending bubbles.
  const syncHistory = useCallback(
    async (targetSessionId, isFirst) => {
      loadingRef.current = true;
      try {
        const rows = await fetchMessages({
          ...(targetSessionId != null ? { chatSessionId: targetSessionId } : {}),
          ...(!isFirst && lastSeenIdRef.current > 0
            ? { sinceId: lastSeenIdRef.current }
            : {}),
        });
        if (cancelRef.current) return;

        setMessages((prev) => {
          if (isFirst) {
            // Initial hydrate: server is source of truth.
            for (const r of rows || []) {
              if (typeof r.id === 'number' && r.id > lastSeenIdRef.current) {
                lastSeenIdRef.current = r.id;
              }
            }
            // Preserve any optimistic messages that snuck in BEFORE history
            // landed (unlikely on first connect but cheap to be safe).
            const optimistic = prev.filter((m) => m.pending && isTempId(m.id));
            return [...(rows || []), ...optimistic];
          }
          // Incremental merge: fold each new row into the existing list.
          let next = prev;
          for (const r of rows || []) {
            next = mergeOne(next, r);
          }
          return next;
        });
        setHistoryLoaded(true);
      } catch (e) {
        if (e.status !== 401) console.error('chat history failed:', e);
      } finally {
        // Drain any WS frames that arrived while we were fetching.
        const buffered = pendingFramesRef.current;
        pendingFramesRef.current = [];
        loadingRef.current = false;
        if (buffered.length) {
          setMessages((prev) => {
            let next = prev;
            for (const b of buffered) next = mergeOne(next, b);
            return next;
          });
        }
      }
    },
    [],
  );

  const connect = useCallback(() => {
    if (cancelRef.current) return;
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    setStatus(attemptsRef.current === 0 ? 'connecting' : 'offline');
    const ws = openChatSocket();
    wsRef.current = ws;
    const isFirstConnect = lastSeenIdRef.current === 0;

    ws.addEventListener('open', () => {
      if (cancelRef.current) return;
      attemptsRef.current = 0;
      setStatus('open');
    });

    ws.addEventListener('message', (ev) => {
      if (cancelRef.current) return;
      let payload;
      try {
        payload = JSON.parse(ev.data);
      } catch {
        return;
      }
      if (payload.type === 'ready') {
        if (payload.chat_session_id != null) {
          setActiveSessionId((prev) => prev ?? payload.chat_session_id);
        }
        // (Re)sync history on every (re)connect so we don't miss messages
        // that arrived while the socket was down.
        syncHistory(chatSessionId, isFirstConnect);
      } else if (payload.type === 'message' && payload.message) {
        // For admin sessions the server multiplexes all sessions onto one
        // socket; the per-thread chat we're rendering filters by id.
        if (
          chatSessionId != null &&
          payload.chat_session_id !== chatSessionId
        ) {
          return;
        }
        applyMessage(payload.message);
      }
    });

    const onDrop = () => {
      if (cancelRef.current) return;
      setStatus('offline');
      const i = Math.min(attemptsRef.current, RECONNECT_BACKOFF.length - 1);
      const delay = RECONNECT_BACKOFF[i];
      attemptsRef.current = i + 1;
      reconnectTimerRef.current = setTimeout(connect, delay);
    };
    ws.addEventListener('close', onDrop);
    ws.addEventListener('error', () => {
      try {
        ws.close();
      } catch {
        /* ignore */
      }
    });
  }, [chatSessionId, syncHistory, applyMessage]);

  useEffect(() => {
    cancelRef.current = false;
    connect();
    return () => {
      cancelRef.current = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (wsRef.current) {
        try { wsRef.current.close(); } catch { /* ignore */ }
        wsRef.current = null;
      }
    };
  }, [connect]);

  const sendDraft = useCallback(
    async (body, { tempId } = {}) => {
      const trimmed = (body || '').trim();
      if (!trimmed) return { ok: false, reason: 'empty' };

      const id = tempId ?? makeTempId();
      const target = chatSessionId ?? activeSessionId;

      // If retrying, the optimistic bubble already exists with the same id —
      // just clear the error flag.
      setMessages((prev) => {
        if (tempId && prev.some((m) => m.id === tempId)) {
          return prev.map((m) =>
            m.id === tempId ? { ...m, pending: true, error: null } : m,
          );
        }
        return [
          ...prev,
          {
            id,
            sender: 'user',
            body: trimmed,
            created_at: Math.floor(Date.now() / 1000),
            pending: true,
          },
        ];
      });

      try {
        const real = await apiSend(trimmed, target ?? undefined);
        // Bump lastSeenId immediately so an incremental refetch won't try to
        // re-deliver this message.
        if (typeof real?.id === 'number' && real.id > lastSeenIdRef.current) {
          lastSeenIdRef.current = real.id;
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...real, pending: false, error: null } : m,
          ),
        );
        return { ok: true };
      } catch (e) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, pending: false, error: e.message } : m,
          ),
        );
        return { ok: false, reason: e.message, tempId: id };
      }
    },
    [activeSessionId, chatSessionId],
  );

  // Retry a failed message in place by reusing its tempId.
  const retry = useCallback(
    async (tempId) => {
      const target = messages.find((m) => m.id === tempId);
      if (!target) return { ok: false, reason: 'not_found' };
      return sendDraft(target.body, { tempId });
    },
    [messages, sendDraft],
  );

  return {
    messages,
    status,
    historyLoaded,
    activeSessionId,
    send: sendDraft,
    retry,
  };
}
