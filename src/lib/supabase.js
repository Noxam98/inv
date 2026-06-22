// Backwards-compatibility shim. The backend is now FastAPI + SQLite, not
// Supabase. All consumers should migrate to `./api` directly — this file
// re-exports the same names so existing imports keep working during the swap.
export {
  registerAnonymous,
  signInWithCode,
  signOut,
  parseCode,
  formatCode,
  getCurrentUser,
  openChatSocket,
  fetchMessages,
  sendMessage,
  listAdminSessions,
} from './api';

// `supabase` was the legacy default client. Code that imported it should be
// rewritten against `./api`. Export `null` so accidental usage fails loudly.
export const supabase = null;
