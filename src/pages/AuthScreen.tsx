import { useState } from 'react'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'

const F = {
  display: "'Cormorant Garamond',Georgia,serif",
  wm1: "'Twinkle Star',cursive",
  body: "'Josefin Sans',sans-serif",
}

export default function AuthScreen() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { signInWithMagicLink, loading, error } = useSupabaseAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    const result = await signInWithMagicLink(email)
    if (result.success) {
      setSubmitted(true)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#0D1B14' }}>
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontFamily: F.wm1, fontSize: '2.5rem', color: '#5EDDA0', marginBottom: '1rem' }}>Hearth</h1>
        <p style={{ fontFamily: F.body, fontSize: '0.95rem', color: 'rgba(245,240,232,0.7)', marginBottom: '2rem' }}>
          A cozy household organizer
        </p>

        {submitted ? (
          <div style={{ background: 'rgba(94,221,160,0.1)', border: '1px solid rgba(94,221,160,0.3)', borderRadius: '0.8rem', padding: '1.5rem' }}>
            <p style={{ fontFamily: F.body, fontSize: '0.9rem', color: '#5EDDA0', marginBottom: '0.5rem' }}>✓ Check your email!</p>
            <p style={{ fontFamily: F.body, fontSize: '0.8rem',
