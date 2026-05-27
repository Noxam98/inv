import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = (url && key)
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

const EMAIL_DOMAIN = 'anon.inds.local';

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

export function handleToEmail(handle) {
  return `${handle.toLowerCase()}@${EMAIL_DOMAIN}`;
}

export async function signInWithCode(code) {
  if (!supabase) {
    return { error: { message: 'Database is not connected. Supabase environment variables are missing.' } };
  }
  const parsed = parseCode(code);
  if (!parsed) {
    return { error: { message: 'Invalid code format' } };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: handleToEmail(parsed.handle),
    password: parsed.password,
  });
  return { data, error };
}

export async function registerAnonymous() {
  if (!supabase || !url || !key) {
    return { error: { message: 'Database is not connected. Supabase environment variables are missing.' } };
  }
  const fnUrl = `${url}/functions/v1/auth-register`;
  const res = await fetch(fnUrl, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: '{}',
  });
  if (!res.ok) {
    return { error: { message: `Registration failed (${res.status})` } };
  }
  const data = await res.json();
  if (data.error) {
    return { error: { message: data.error } };
  }
  return { data: { handle: data.handle, password: data.password, code: formatCode(data.handle, data.password) } };
}

