// Thin wrapper around the FastAPI backend. Cookies are sent automatically
// because the dev server proxies /api to the backend on the same origin and
// in prod we deploy frontend + backend behind the same domain.

const API_BASE = '/api';

async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    // empty body or non-json
  }

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ---------- Auth ----------

export async function getCurrentUser() {
  try {
    return await request('/auth/me');
  } catch (err) {
    if (err.status === 401) return null;
    throw err;
  }
}

export async function registerAnonymous() {
  try {
    const data = await request('/auth/register', { method: 'POST' });
    return {
      data: {
        handle: data.handle,
        password: data.password,
        code: data.code,
        user: data.user,
      },
    };
  } catch (err) {
    return { error: { message: err.message } };
  }
}

export async function signInWithCode(code) {
  try {
    const data = await request('/auth/login', { method: 'POST', body: { code } });
    return { data: { user: data } };
  } catch (err) {
    return { error: { message: err.message } };
  }
}

export async function signOut() {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch {
    // ignore; cookie may already be invalid
  }
}

// ---------- Chat ----------

export async function fetchMessages({ chatSessionId, sinceId, limit = 200 } = {}) {
  const qs = new URLSearchParams();
  if (chatSessionId != null) qs.set('chat_session_id', String(chatSessionId));
  if (sinceId != null) qs.set('since_id', String(sinceId));
  qs.set('limit', String(limit));
  return request(`/chat/messages?${qs.toString()}`);
}

export async function sendMessage(body, chatSessionId) {
  return request('/chat/messages', {
    method: 'POST',
    body: chatSessionId != null
      ? { body, chat_session_id: chatSessionId }
      : { body },
  });
}

export async function listAdminSessions() {
  return request('/chat/sessions');
}

// ---------- WebSocket ----------

export function openChatSocket() {
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return new WebSocket(`${proto}//${window.location.host}/ws/chat`);
}

// ---------- Code helpers (kept for AuthPage compatibility) ----------

export function parseCode(raw) {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  const dot = trimmed.indexOf('.');
  if (dot <= 0 || dot === trimmed.length - 1) return null;
  const handle = trimmed.slice(0, dot).toLowerCase();
  const password = trimmed.slice(dot + 1);
  if (!/^[a-z]{2,4}_[a-z0-9]{4,20}$/.test(handle)) return null;
  if (password.length < 8 || password.length > 64) return null;
  return { handle, password };
}

export function formatCode(handle, password) {
  return `${handle}.${password}`;
}
