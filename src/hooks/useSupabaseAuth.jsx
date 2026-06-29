import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useSupabaseAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const timeout = setTimeout(() => {
      if (mounted) { setSession(null); setLoading(false); }
    }, 5000);

    supabase.auth.getSession().then((res) => {
      clearTimeout(timeout);
      if (mounted) { setSession(res?.data?.session || null); setLoading(false); }
    }).catch(() => {
      clearTimeout(timeout);
      if (mounted) { setSession(null); setLoading(false); }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
      if (mounted) { setSession(s); setLoading(false); }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // Single magic link function - works for both new and existing users
  const sendMagicLink = async (email) => {
    const result = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: 'https://whimsilogical-hearth.netlify.app',
      },
    });
    if (result.error) return result.error.message;
    return null;
  };

  // Keep signIn/signUp as aliases for compatibility
  const signIn = sendMagicLink;
  const signUp = sendMagicLink;

  return { session, loading, signIn, signUp, sendMagicLink };
}
