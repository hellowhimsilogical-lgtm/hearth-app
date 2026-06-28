import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function AuthCallback() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          window.location.hash.slice(1)
        )

        if (error) throw error

        if (data.session) {
          // Session established, redirect to app
          window.location.href = '/'
        } else {
          setError('No session established')
        }
      } catch (err: any) {
        setError(err.message || 'Authentication failed')
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = '/login'
        }, 3000)
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [])

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Authenticating...</div>
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#fca5a5' }}>
        <p>Authentication failed: {error}</p>
        <p>Redirecting to login...</p>
      </div>
    )
  }

  return null
}
