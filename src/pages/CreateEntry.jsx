import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createEntry, getEntry, updateEntry } from '../services/journalService';
import Navbar from '../components/layout/Navbar';

const MOODS = [
  { id: 'Happy', emoji: '😊', label: 'Happy', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { id: 'Productive', emoji: '🚀', label: 'Productive', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { id: 'Tired', emoji: '😴', label: 'Tired', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  { id: 'Sad', emoji: '😢', label: 'Sad', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
];

const CreateEntry = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    content: '',
    mood: 'Happy',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!id) return;
    const loadEntry = async () => {
      try {
        const docSnap = await getEntry(id);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm({
            title: data.title || '',
            content: data.content || '',
            mood: data.mood || 'Happy',
            date: data.date || new Date().toISOString().split('T')[0],
          });
        } else {
          setError('Entry not found');
        }
      } catch (err) {
        setError('Failed to load entry');
      } finally {
        setFetching(false);
      }
    };
    loadEntry();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Please fill in both title and content.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        await updateEntry(id, form);
      } else {
        await createEntry(user.uid, form);
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="create-entry-page animate-fade-in">
          {/* Header */}
          <div className="create-trip-header">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Back
            </button>
            <div className="create-trip-title-wrap">
              <h2 className="gradient-text">{isEditing ? 'Edit Journal Entry' : 'How was your day?'}</h2>
            </div>
          </div>

          <div className="card form-card">
            {fetching ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="spinner" style={{ margin: '0 auto' }} />
                <p style={{ color: 'var(--text-secondary)', marginTop: 16 }}>Loading entry...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label className="form-label">How are you feeling?</label>
                <div className="mood-selector">
                  {MOODS.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      className={`mood-btn ${form.mood === m.id ? 'active' : ''}`}
                      style={form.mood === m.id ? { borderColor: m.color, backgroundColor: m.bg } : {}}
                      onClick={() => setForm(p => ({ ...p, mood: m.id }))}
                    >
                      <span className="mood-emoji">{m.emoji}</span>
                      <span className="mood-label" style={form.mood === m.id ? { color: m.color, fontWeight: 600 } : {}}>
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 24 }}>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Entry Title</label>
                <input
                  className="form-input form-input-lg"
                  placeholder="Give your day a title..."
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Journal Content</label>
                <textarea
                  className="form-textarea form-textarea-lg"
                  placeholder="Write your thoughts here..."
                  rows={8}
                  value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  required
                />
              </div>

              {error && (
                <div className="form-error animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className="form-actions" style={{ marginTop: 32 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  {loading ? (
                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  {loading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Entry' : 'Save Entry')}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEntry;
