import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// Synchronously check if a Supabase token exists in localStorage to avoid async lag for guests
const hasLocalToken = () => {
  if (typeof window === 'undefined') return false;
  try {
    const url = import.meta.env.VITE_SUPABASE_URL;
    if (!url) return false;
    const hostname = new URL(url).hostname;
    const ref = hostname.split('.')[0];
    if (!ref) return false;
    return !!localStorage.getItem(`sb-${ref}-auth-token`);
  } catch (e) {
    // Ignore storage issues
  }
  return false;
};

const hasToken = hasLocalToken();


export const useAuthStore = create((set) => ({
  session: null,
  user: null,
  ready: !hasToken, // Ready instantly if no local token is present

  init: async () => {
    if (!supabase) {
      set({ session: null, user: null, ready: true });
      return;
    }
    try {
      const { data } = await supabase.auth.getSession();
      set({ session: data.session, user: data.session?.user ?? null, ready: true });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null });
      });
    } catch (e) {
      console.error('Failed to initialize Supabase auth session:', e);
      set({ session: null, user: null, ready: true });
    }
  },

  signOut: async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Failed to sign out from Supabase:', e);
    }
    set({ session: null, user: null });
  },
}));

export const selectIsAuthed = (s) => Boolean(s.session);
export const selectIsAdmin = (s) =>
  s.session?.user?.app_metadata?.role === 'admin';


