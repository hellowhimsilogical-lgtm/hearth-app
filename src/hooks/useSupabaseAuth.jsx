import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useSupabaseAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then((result) => {
      if (!mounted) return;
      const session = result?.data?.session || null;
      setSession(session);
      setLoading(false);
    }).catch(() => {
      if (mounted) setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      if (error) return error.message;
      return null;
    } catch (e) { return e.message; }
  };

  const signUp = async (email) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) return error.message;
      return null;
    } catch (e) { return e.message; }
  };

  return { session, loading, signIn, signUp };
}
