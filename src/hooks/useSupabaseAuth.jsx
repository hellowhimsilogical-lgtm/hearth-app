import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useSupabaseAuth() {
  const [session, setSession] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // Timeout fallback - if getSession hangs, stop loading after 5s
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        setSession(null);
        setLoading(false);
      }
    }, 5000);

    supabase.auth.getSession().then((result) => {
      clearTimeout(timeout);
      if (!mounted) return;
      setSession(result?.data?.session || null);
      setLoading(false);
    }).catch(() => {
      clearTimeout(timeout);
      if (mounted) { setSession(null); setLoading(false); }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      return error ? error.message : null;
    } catch (e) { return e.message; }
  };

  const signUp = async (email) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      return error ? error.message : null;
    } catch (e) { return e.message; }
  };

  return { session, loading, signIn, signUp };
}
