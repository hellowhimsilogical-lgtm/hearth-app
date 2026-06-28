import { useState } from 'react'

import { useSupabaseAuth } from '../hooks/useSupabaseAuth'




const F = {

    display: "'Cormorant Garamond',Georgia,serif",

    wm1: "'Twinkle Star',cursive",

    body: "'Josefin Sans',sans-serif",

}




export function AuthScreen() {

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

                          <h1 style={{ fontFamily: F.wm1, fontSize: '2.5rem', color: '#5EDDA0', marginBottom: '1rem' }}>Hearth</h1>h1>

                          <p style={{ fontFamily: F.body, fontSize: '0.95rem', color: 'rgba(245,240,232,0.7)', marginBottom: '2rem' }}>

                                      A cozy household organizer

                          </p>p>




                  {submitted ? (

                              <div style={{ background: 'rgba(94,221,160,0.1)', border: '1px solid rgba(94,221,160,0.3)', borderRadius: '0.8rem', padding: '1.5rem' }}>

                                            <p style={{ fontFamily: F.body, fontSize: '0.9rem', color: '#5EDDA0', marginBottom: '0.5rem' }}>✓ Check your email!</p>p>

                                            <p style={{ fontFamily: F.body, fontSize: '0.8rem', color: 'rgba(245,240,232,0.6)' }}>

                                                            We sent a magic link to <strong>{email}</strong>strong>. Click it to sign in.
                                            
                                            </p>p>
                              
                              </div>div>
          
                  ) : (
          
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                                <div>
                                
                                              <label style={{ fontFamily: F.body, fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                              
                                                              Email
                                              
                                              </label>label>
                                
                                              <input
                                                
                                                                type="email"
                                                
                                                value={email}
                                                
                                                onChange={(e) => setEmail(e.target.value)}
                                                
                                                placeholder="hello@example.com"
                                                
                                                style={{
                                                  
                                                                    width: '100%',
                                                  
                                                                    background: 'rgba(255,255,255,0.06)',
                                                  
                                                                    border: '1px solid rgba(255,255,255,0.14)',
                                                  
                                                                    borderRadius: '0.5rem',
                                                  
                                                                    color: '#f5f0e8',
                                                  
                                                                    fontFamily: F.body,
                                                  
                                                                    fontSize: '0.9rem',
                                                  
                                                                    padding: '0.7rem',
                                                  
                                                                    outline: 'none',
                                                  
                                                                    boxSizing: 'border-box',
                                                  
                                                }}
                                                
                                              />
                                
                                </div>div>
                    
                    
                    
                    
                      {error && (
                      
                                    <div style={{ background: 'rgba(252,165,165,0.1)', border: '1px solid rgba(252,165,165,0.3)', borderRadius: '0.5rem', padding: '0.7rem', fontSize: '0.8rem', color: '#fca5a5', fontFamily: F.body }}>
                                    
                                      {error}
                                    
                                    </div>div>
                    
                                  )}
                    
                    
                    
                    
                                <button
                                  
                                                type="submit"
                                  
                                  disabled={loading || !email.trim()}
                                  
                                  style={{
                                    
                                                    background: 'linear-gradient(135deg,#1a6b5c,#2dd4bf33)',
                                    
                                                    border: '1px solid rgba(45,212,191,0.4)',
                                    
                                                    borderRadius: '0.5rem',
                                    
                                                    color: '#2dd4bf',
                                    
                                                    fontFamily: F.body,
                                    
                                                    fontSize: '0.9rem',
                                    
                                                    padding: '0.8rem',
                                    
                                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    
                                                    opacity: loading || !email.trim() ? 0.5 : 1,
                                    
                                                    letterSpacing: '0.06em',
                                    
                                                    fontWeight: 600,
                                    
                                  }}
                                  
                                >
                                
                                  {loading ? 'Sending...' : 'Send Magic Link'}
                                
                                </button>button>
                    
                    
                    
                    
                                <p style={{ fontFamily: F.body, fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)', marginTop: '1rem' }}>
                                
                                              New to Hearth? Same process — we'll create your account. ✦
                                
                                </p>p>
                    
                    </form>form>
                
                  )}
                
                </div>div>
        
        </div>div>
    
      )
    
}</strong>
