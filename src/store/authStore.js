import { create } from 'zustand';
import { getCurrentUser, signOut as apiSignOut } from '../lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  ready: false,

  init: async () => {
    try {
      const user = await getCurrentUser();
      set({ user, ready: true });
    } catch (e) {
      console.error('auth init failed:', e);
      set({ user: null, ready: true });
    }
  },

  setUser: (user) => set({ user }),

  signOut: async () => {
    await apiSignOut();
    set({ user: null });
  },
}));

// Selectors kept compatible with previous Supabase shape.
export const selectIsAuthed = (s) => Boolean(s.user);
export const selectIsAdmin = (s) => Boolean(s.user?.is_admin);
// Legacy alias — the rest of the code reads `session` to gate routes; backend
// has no separate "session" object client-side (it's an httpOnly cookie), so
// `user` truthiness is the source of truth.
export const selectSession = (s) => (s.user ? { user: s.user } : null);
