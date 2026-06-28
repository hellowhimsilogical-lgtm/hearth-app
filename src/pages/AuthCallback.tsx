import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { supabase } from '../supabase'




export function AuthCallback() {

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()




  useEffect(() => {

                const handleCallback = async () => {

                        try {

                          // Exchange the code for a session

                          const { data, error } = await supabase.auth.exchangeCodeForSession(

                                      window.location.hash.slice(1)

                                    )




                          if (error) throw error




                          if (data.session) {

                                    // Session established, redirect to app

                                    navigate('/')

                          } else {

                                    setError('No session established')

                          }

                        } catch (err: any) {

                          setError(err.message || 'Authentication failed')

                          // Redirect to login after 3 seconds

                          setTimeout(() => navigate('/login'), 3000)

                        } finally {

                          setLoading(false)

                        }

                }




                handleCallback()

  }, [navigate])




  if (loading) {

      return <div style={{ padding: '2rem', textAlign: 'center' }}>Authenticating...</div>div>

        }




  if (error) {

      return (

              <div style={{ padding: '2rem', textAlign: 'center', color: '#fca5a5' }}>

                        <p>Authentication failed: {error}</p>p>
              
                      <p>Redirecting to login...</p>p>
              
              </div>div>
        
            )
        
  }
  
  
  
  
    return null
      
}</p>
