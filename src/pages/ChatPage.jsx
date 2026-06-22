import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useChat } from '../hooks/useChat';

const STATUS_COPY = {
  connecting: 'Connecting…',
  open: 'Live',
  offline: 'Reconnecting…',
};

const drift = keyframes`
  0%   { transform: translate3d(-12%, -8%, 0) scale(1); }
  50%  { transform: translate3d(6%, 10%, 0) scale(1.1); }
  100% { transform: translate3d(-12%, -8%, 0) scale(1); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50%      { opacity: 1;    transform: scale(1.15); }
`;

// 100dvh tracks the dynamic viewport so the iOS Safari URL bar / keyboard
// don't crop the composer. Fallback to 100vh for older browsers.
const Page = styled.div`
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 100px 24px 24px;
  display: flex;
  justify-content: center;
  overflow: hidden;
  isolation: isolate;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 84px 12px 12px;
  }
`;

const Orb = styled.div`
  position: absolute;
  width: 50vmax;
  height: 50vmax;
  border-radius: 50%;
  filter: blur(120px);
  z-index: -1;
  pointer-events: none;
  will-change: transform;

  &.violet {
    left: -15vmax;
    top: -10vmax;
    background: radial-gradient(circle, #581385 0%, rgba(88, 19, 133, 0) 60%);
    opacity: 0.4;
    animation: ${drift} 30s ease-in-out infinite;
  }

  &.magenta {
    right: -20vmax;
    bottom: -15vmax;
    background: radial-gradient(circle, #ff2ea8 0%, rgba(255, 46, 168, 0) 60%);
    opacity: 0.25;
    animation: ${drift} 35s ease-in-out infinite reverse;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`;

const Shell = styled.div`
  width: 100%;
  max-width: 860px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(15, 5, 28, 0.7) 0%, rgba(20, 8, 36, 0.55) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 40px 100px -30px rgba(155, 93, 229, 0.3);
  height: calc(100vh - 124px);
  height: calc(100dvh - 124px);
  min-height: 480px;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    border-radius: 18px;
    height: calc(100vh - 96px);
    height: calc(100dvh - 96px);
  }
`;

const Header = styled.div`
  padding: 24px 28px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 18px 18px 14px;
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.white};
  line-height: 1;
  margin-bottom: 6px;
`;

const HandleRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.65);
`;

const CopyHandleBtn = styled.button`
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  background: rgba(199, 125, 255, 0.08);
  border: 1px solid rgba(199, 125, 255, 0.25);
  border-radius: 6px;
  padding: 3px 8px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(199, 125, 255, 0.18);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accentLight};
    outline-offset: 2px;
  }
`;

const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ $tone }) =>
    $tone === 'open'
      ? '#b8f0a8'
      : $tone === 'offline'
      ? '#ffb38a'
      : 'rgba(255,255,255,0.75)'};
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: ${({ $animate }) =>
    $animate
      ? css`${pulse} 1.6s ease-in-out infinite`
      : 'none'};

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`;

const Thread = styled.div`
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 28px 28px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 18px 14px 10px;
  }

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(199, 125, 255, 0.25);
    border-radius: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }
`;

const Empty = styled.div`
  margin: auto;
  text-align: center;
  color: rgba(255, 255, 255, 0.55);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1.7;
`;

const BubbleRow = styled(motion.div)`
  display: flex;
  justify-content: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};

  & + & {
    margin-top: 2px;
  }
`;

const Bubble = styled.div`
  max-width: min(74%, 560px);
  padding: 12px 16px 10px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.45;
  white-space: pre-wrap;
  word-wrap: break-word;
  position: relative;

  ${({ $mine, $pending, $error }) =>
    $mine
      ? css`
          background: linear-gradient(135deg, rgba(199, 125, 255, 0.22) 0%, rgba(255, 46, 168, 0.22) 100%);
          border: 1px solid rgba(199, 125, 255, 0.35);
          border-bottom-right-radius: 6px;
          color: #fff;
          opacity: ${$pending ? 0.75 : $error ? 0.65 : 1};
        `
      : css`
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom-left-radius: 6px;
          color: #fff;
        `};
`;

const Stamp = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.5);
  justify-content: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
`;

const RetryBtn = styled.button`
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #ffb3c1;
  background: rgba(255, 102, 138, 0.12);
  border: 1px solid rgba(255, 102, 138, 0.35);
  border-radius: 6px;
  padding: 3px 8px;
  cursor: pointer;

  &:hover { background: rgba(255, 102, 138, 0.22); }

  &:focus-visible {
    outline: 2px solid #ffb3c1;
    outline-offset: 2px;
  }
`;

const AdminBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 170, 60, 0.05);

  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  line-height: 1.5;
  color: rgba(255, 220, 180, 0.95);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 12px 18px;
  }
`;

const AdminBannerLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accentLight};
  text-decoration: underline;
  text-underline-offset: 3px;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accentLight};
    outline-offset: 2px;
  }
`;

const Composer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 16px 22px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 12px 14px 14px;
  }
`;

const Textarea = styled.textarea`
  flex: 1;
  resize: none;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  line-height: 1.45;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 12px 16px;
  max-height: 180px;
  min-height: 46px;
  outline: none;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-color: rgba(199, 125, 255, 0.6);
    background: rgba(0, 0, 0, 0.55);
    box-shadow: 0 0 0 3px rgba(199, 125, 255, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const SendBtn = styled.button`
  flex-shrink: 0;
  height: 46px;
  min-width: 96px;
  padding: 0 18px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #fff;
  background: linear-gradient(135deg, #581385 0%, #2d0846 100%);
  border: 1px solid rgba(199, 125, 255, 0.3);
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, opacity 0.15s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px -8px rgba(199, 125, 255, 0.45);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accentLight};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const SrOnly = styled.span`
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0);
  white-space: nowrap; border: 0;
`;

function formatStamp(ts) {
  if (!ts) return '';
  const d = new Date(ts * 1000);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  if (sameDay) return `${hh}:${mm}`;
  const dd = String(d.getDate()).padStart(2, '0');
  const mon = d.toLocaleString('en-US', { month: 'short' });
  return `${mon} ${dd} · ${hh}:${mm}`;
}

export default function ChatPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = Boolean(user?.is_admin);

  // Admins should land on /admin (TODO); they get a read-only view of their
  // own thread here meanwhile so they at least know what the user UI looks
  // like, but the composer is disabled and a banner points them out.
  const { messages, status, historyLoaded, send, retry } = useChat();

  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const threadRef = useRef(null);
  const bottomRef = useRef(null);
  const stickyRef = useRef(true);
  const composerRef = useRef(null);

  const onScroll = () => {
    const el = threadRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickyRef.current = dist < 80;
  };

  useLayoutEffect(() => {
    if (stickyRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ block: 'end' });
    }
  }, [messages.length]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault?.();
    const text = draft;
    if (!text.trim() || sending || isAdmin) return;
    setDraft('');
    setSending(true);
    stickyRef.current = true;
    await send(text);
    setSending(false);
    composerRef.current?.focus();
  };

  const onRetry = useCallback(
    async (tempId) => {
      await retry(tempId);
    },
    [retry],
  );

  const onCopyHandle = useCallback(async () => {
    if (!user?.handle) return;
    try {
      await navigator.clipboard.writeText(user.handle);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard might be blocked; user can still select & copy */
    }
  }, [user?.handle]);

  const statusTone = status;
  const placeholder = useMemo(() => {
    if (isAdmin) return 'Admin: replies happen in /admin (coming next session)';
    return status === 'open'
      ? 'Type a message…  (Enter to send, Shift+Enter for newline)'
      : 'Reconnecting before you can send…';
  }, [isAdmin, status]);

  const composerDisabled = isAdmin || status !== 'open';
  const sendDisabled = sending || composerDisabled || !draft.trim();
  const remaining = 4000 - draft.length;
  const showCounter = draft.length >= 3600;

  return (
    <Page>
      <Orb className="violet" />
      <Orb className="magenta" />

      <Shell>
        <Header>
          <div>
            <Title>Conversation</Title>
            <HandleRow>
              <span>{user ? user.handle : '…'}</span>
              {isAdmin ? <span>· admin</span> : null}
              {user?.handle ? (
                <CopyHandleBtn
                  type="button"
                  onClick={onCopyHandle}
                  aria-label="Copy your handle to clipboard"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </CopyHandleBtn>
              ) : null}
            </HandleRow>
          </div>
          <StatusPill
            $tone={statusTone}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <StatusDot $animate={statusTone !== 'open'} aria-hidden="true" />
            <SrOnly>Connection:</SrOnly>
            {STATUS_COPY[statusTone] ?? '—'}
          </StatusPill>
        </Header>

        {isAdmin ? (
          <AdminBanner role="note">
            <span>
              You’re signed in as admin. This page shows your own thread for reference;
              the dedicated admin panel is on its way. For now,{' '}
              <AdminBannerLink to="/profile">your profile</AdminBannerLink>{' '}
              has a session list once it’s wired up.
            </span>
          </AdminBanner>
        ) : null}

        <Thread
          ref={threadRef}
          onScroll={onScroll}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Conversation messages"
        >
          {historyLoaded && messages.length === 0 ? (
            <Empty>
              No messages yet
              <br />
              Say hi — admin will see it in their panel
            </Empty>
          ) : null}

          <AnimatePresence initial={false}>
            {messages.map((m) => {
              const mine = m.sender === (isAdmin ? 'admin' : 'user');
              const isPending = Boolean(m.pending);
              const isFailed = Boolean(m.error);
              return (
                <BubbleRow
                  key={m.id}
                  $mine={mine}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <Bubble $mine={mine} $pending={isPending} $error={isFailed}>
                    {m.body}
                    <Stamp $mine={mine}>
                      <span>{formatStamp(m.created_at)}</span>
                      {isPending ? <span aria-live="polite">sending…</span> : null}
                      {isFailed ? (
                        <>
                          <span aria-live="polite">failed</span>
                          <RetryBtn
                            type="button"
                            onClick={() => onRetry(m.id)}
                            aria-label="Retry sending message"
                          >
                            Retry
                          </RetryBtn>
                        </>
                      ) : null}
                    </Stamp>
                  </Bubble>
                </BubbleRow>
              );
            })}
          </AnimatePresence>

          <div ref={bottomRef} />
        </Thread>

        <Composer onSubmit={onSubmit} aria-label="Message composer">
          <label htmlFor="chat-composer">
            <SrOnly>Compose message</SrOnly>
          </label>
          <Textarea
            id="chat-composer"
            ref={composerRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={1}
            maxLength={4000}
            disabled={composerDisabled}
            aria-describedby={
              isAdmin
                ? 'composer-help-admin'
                : status !== 'open'
                ? 'composer-help-conn'
                : showCounter
                ? 'composer-help-count'
                : undefined
            }
          />
          {isAdmin ? (
            <SrOnly id="composer-help-admin">
              Composer is disabled for admin accounts. Use the admin panel to reply.
            </SrOnly>
          ) : null}
          {status !== 'open' ? (
            <SrOnly id="composer-help-conn">
              Composer is disabled while reconnecting to the server.
            </SrOnly>
          ) : null}
          {showCounter ? (
            <SrOnly id="composer-help-count" aria-live="polite">
              {remaining} characters remaining out of 4000.
            </SrOnly>
          ) : null}
          <SendBtn
            type="submit"
            disabled={sendDisabled}
            aria-label={sending ? 'Sending message' : 'Send message'}
          >
            {sending ? '…' : 'Send'}
          </SendBtn>
        </Composer>
      </Shell>
    </Page>
  );
}
