import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const { signIn, signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
                if (isSignUp) {
                          await signUp(email, password);
                } else {
                          await signIn(email, password);
                }
        } catch (err) {
                setError(err.message);
        } finally {
                setLoading(false);
        }
  };

  return (
        <div className="login-page">
              <div className="login-card">
                      <h1>Hearth</h1>h1>
                      <p>Your family organizer</p>p>
                      <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                            <label htmlFor="email">Email</label>label>
                                            <input
                                                            id="email"
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                            autoComplete="email"
                                                          />
                                </div>div>
                                <div className="form-group">
                                            <label htmlFor="password">Password</label>label>
                                            <input
                                                            id="password"
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                            autoComplete={isSignUp ? 'new-password' : 'current-password'}
                                                          />
                                </div>div>
                        {error && <p className="error">{error}</p>p>}
                                <button type="submit" disabled={loading}>
                                  {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
                                </button>button>
                      </form>form>
                      <button
                                  className="toggle-mode"
                                  onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                                >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                      </button>button>
              </div>div>
        </div>div>
      );
}</div>
