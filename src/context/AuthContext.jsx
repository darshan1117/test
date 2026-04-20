import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Loader2 } from 'lucide-react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth, 
      (u) => {
        setUser(u);
        setLoading(false);
      },
      (err) => {
        console.error("Auth State Error:", err);
        setError(err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="loading-screen animate-fade-in">
        <div className="loader-content">
          <Loader2 className="animate-spin text-accent" size={48} />
          <h2 style={{ marginTop: 20, fontWeight: 600 }}>Securely signing you in...</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Preparing your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
