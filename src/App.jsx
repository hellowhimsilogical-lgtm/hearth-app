import { useState, useEffect, Suspense, lazy } from 'react'
import { useSupabaseAuth } from './hooks/useSupabaseAuth'
import { useHearthSync } from './hooks/useHearthSync'

// Lazy load auth screens to avoid circular imports
const AuthScreen = lazy(() => import('./pages/AuthScreen'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))

// Loading fallback
function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D2318', color: '#f5f0e8' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Hearth</h1>
        <p>Loading...</p>
      </div>
    </div>
  )
}

// Main app placeholder
function HearthApp() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#0D2318', color: '#f5f0e8', fontFamily: "'Josefin Sans',sans-serif" }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Hearth v2.0</h1>
        <div style={{ background: 'rgba(94,221,160,0.1)', border: '1px solid rgba(94,221,160,0.3)', borderRadius: '0.8rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>✓ Supabase sync ready</p>
          <p style={{ marginBottom: '0.5rem' }}>✓ Magic link auth active</p>
          <p>✓ IndexedDB + cloud backup</p>
        </div>
        <p style={{ color: 'rgba(245,240,232,0.6)', fontSize: '0.9rem' }}>
          The full Hearth UI will be integrated here. For now, you're authenticated and connected to Supabase!
        </p>
      </div>
    </div>
  )
}

// Root app
export default function App() {
  const { user, loading, signOut } = useSupabaseAuth()
  const { syncing } = useHearthSync(user?.id)
  const [isCallback, setIsCallback] = useState(false)

  // Check if this is an auth callback
  useEffect(() => {
    const hash = window.location.hash
    setIsCallback(hash.includes('type=recovery') || hash.includes('access_token'))
  }, [])

  // Show callback handler
  if (isCallback) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AuthCallback />
      </Suspense>
    )
  }

  // Show loading state
  if (loading) {
    return <LoadingScreen />
  }

  // Show login if not authenticated
  if (!user) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AuthScreen />
      </Suspense>
    )
  }

  // Show main app
  return (
    <div>
      {/* Sync indicator */}
      {syncing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)', padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#2dd4bf', zIndex: 100 }}>
          Syncing to cloud... ✦
        </div>
      )}

      {/* Main content */}
      <HearthApp />

      {/* Sign out button */}
      <button
        onClick={() => signOut()}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          padding: '0.6rem 1.2rem',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '0.5rem',
          color: '#f5f0e8',
          cursor: 'pointer',
          fontFamily: "'Josefin Sans',sans-serif",
          fontSize: '0.85rem',
          letterSpacing: '0.06em',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
        }}
      >
        Sign out
      </button>
    </div>
  )
}
