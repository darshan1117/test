import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Mail, Lock, User, Eye, EyeOff, ArrowRight, Globe
} from 'lucide-react';
import { loginWithEmail, registerWithEmail, loginWithGoogle } from '../services/authService';
import { useToast } from '../context/ToastContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPass: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!form.name.trim()) return setError('Name is required.');
      if (form.password !== form.confirmPass) return setError('Passwords do not match.');
      if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(form.email, form.password);
        addToast('Welcome back!');
      } else {
        await registerWithEmail(form.email, form.password, form.name);
        addToast('Account created! Welcome to your journal.');
      }
      navigate('/dashboard');
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/invalid-credential': 'Invalid email or password.',
      };
      const errMsg = messages[err.code] || err.message || 'Something went wrong.';
      setError(errMsg);
      addToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      addToast('Signed in with Google.');
      navigate('/dashboard');
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
      addToast('Google sign-in failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* BG decoration */}
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />

      <div className="auth-container animate-fade-in">
        {/* Header */}
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="logo-icon">
              <BookOpen size={22} />
            </div>
            <span>DailyJournal</span>
          </Link>
          <h1 className="auth-title">
            {mode === 'login' ? 'Welcome back' : 'Start your journey'}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to access your journal'
              : 'Create your account and start capturing your story'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrap">
                <User size={16} className="input-icon" />
                <input
                  id="auth-name"
                  name="name"
                  type="text"
                  className="form-input input-with-icon"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-icon-wrap">
              <Mail size={16} className="input-icon" />
              <input
                id="auth-email"
                name="email"
                type="email"
                className="form-input input-with-icon"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input
                id="auth-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className="form-input input-with-icon input-with-icon-right"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="input-icon-right-btn"
                onClick={() => setShowPass(p => !p)}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  id="auth-confirm-password"
                  name="confirmPass"
                  type="password"
                  className="form-input input-with-icon"
                  placeholder="••••••••"
                  value={form.confirmPass}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {error && <p className="form-error auth-error">{error}</p>}

          <button
            id="auth-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : null}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="divider">or continue with</div>

        <button
          id="auth-google-btn"
          className="btn btn-secondary auth-google"
          onClick={handleGoogle}
          disabled={loading}
        >
          <Globe size={18} />
          Continue with Google
        </button>

        <p className="auth-footer">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            className="auth-footer-link"
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
