import { useState, useEffect, useCallback } from 'react'

import { supabase } from '../supabase'

import type { User, Session } from '@supabase/supabase-js'




export function useSupabaseAuth() {

  const [user, setUser] = useState<User | null>(null)

  const [session, setSession] = useState<Session | null>(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)




  // ── Check session on mount ───────────────────────────────────────

  useEffect(() => {

                const checkSession = async () => {

                        try {

                          const { data: { session: currentSession } } = await supabase.auth.getSession()

                          setSession(currentSession)

                          setUser(currentSession?.user || null)

                        } catch (err) {

                          console.error('Session check error:', err)

                          setError('Failed to check session')

                        } finally {

                          setLoading(false)

                        }

                }




                checkSession()




                // ── Listen for auth changes ──────────────────────────────────────

                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {

                                                                                         setSession(newSession)

                                                                                         setUser(newSession?.user || null)

                                                                                         setLoading(false)

                })




                return () => subscription?.unsubscribe()

  }, [])




  // ── Sign up with magic link ──────────────────────────────────────

  const signUpWithMagicLink = useCallback(async (email: string) => {

                                              setError(null)

                                              setLoading(true)

                                              try {

          const { error: err } = await supabase.auth.signInWithOtp({

                                                                           email,

                    options: {

                      emailRedirectTo: `https://whimsilogical-hearth.netlify.app/auth/callback`,

                    },

          })

          if (err) throw err

          return { success: true, message: 'Check your email for the magic link!' }

                                              } catch (err: any) {

          const message = err?.message || 'Sign up failed'

          setError(message)

          return { success: false, message }

                                              } finally {

          setLoading(false)

                                              }

  }, [])




  // ── Sign in with magic link ──────────────────────────────────────

  const signInWithMagicLink = useCallback(async (email: string) => {

                                              setError(null)

                                              setLoading(true)

                                              try {

          const { error: err } = await supabase.auth.signInWithOtp({

                                                                           email,

                    options: {

                      emailRedirectTo: `https://whimsilogical-hearth.netlify.app/auth/callback`,

                    },

          })

          if (err) throw err

          return { success: true, message: 'Check your email for the magic link!' }

                                              } catch (err: any) {

          const message = err?.message || 'Sign in failed'

          setError(message)

          return { success: false, message }

                                              } finally {

          setLoading(false)

                                              }

  }, [])




  // ── Sign out ─────────────────────────────────────────────────────

  const signOut = useCallback(async () => {

                                  setError(null)

                                  try {

          const { error: err } = await supabase.auth.signOut()

          if (err) throw err

          setSession(null)

          setUser(null)

          return { success: true }

                                  } catch (err: any) {

          const message = err?.message || 'Sign out failed'

          setError(message)

          return { success: false, message }

                                  }

  }, [])




  return {

        user,

        session,

        loading,

        error,

        signUpWithMagicLink,

        signInWithMagicLink,

        signOut,

  }

}
