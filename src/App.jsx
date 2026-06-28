import { useState, useEffect } from 'react'
import { useSupabaseAuth } from './hooks/useSupabaseAuth'
import { useHearthSync } from './hooks/useHearthSync'
import AuthScreen from './pages/AuthScreen'
import AuthCallback from './pages/AuthCallback'

// Main app UI (placeholder — your existing Hearth UI goes here)
function HearthApp() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#0D2318', color: '#f5f0e8' }}>
      <h1>Hearth v2.0</h1>
      <p>✓ Supabase sync ready</p>
      <p>✓ Magic link auth active</p>
    </div>
  )
}

// Root component
export default function App() {
  const { user, loading, signOut } = useSupabaseAuth()
  const { syncing } = useHearthSync(user?.id)

  // Handle auth callback route
  if (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token')) {
    return <AuthCallback />
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <div>
      {syncing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(45,212,191,0.1)', padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#2dd4bf', zIndex: 100 }}>
          Syncing... ✦
        </div>
      )}
      <HearthApp />
      <button onClick={signOut} style={{ position: 'fixed', bottom: '2rem', right: '2rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.4rem', color: '#f5f0e8', cursor: 'pointer' }}>
        Sign out
      </button>
    </div>
  )
}
