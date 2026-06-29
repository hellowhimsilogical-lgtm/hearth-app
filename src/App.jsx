import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

/**
 * Inner component that reads auth state and renders the appropriate page.
 * Must be rendered inside <AuthProvider> so useAuth() has context.
 */
function AppContent() {
    const { user, loading } = useAuth();

  if (loading) {
        return (
                <div className="loading-screen">
                        <p>Loading Hearth...</p>p>
                </div>div>
              );
  }
  
    if (!user) {
          return <Login />;
    }
  
    return <Dashboard />;
}

export default function App() {
    return (
          <AuthProvider>
                <AppContent />
          </AuthProvider>AuthProvider>
        );
}</div>
