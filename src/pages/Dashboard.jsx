import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, BookOpen, BarChart2, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscribeToEntries, deleteEntry } from '../services/journalService';
import JournalCard from '../components/journal/JournalCard';
import MoodChart from '../components/journal/MoodChart';
import Navbar from '../components/layout/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    
    setLoading(true);
    const unsubscribe = subscribeToEntries(user.uid, (data) => {
      setEntries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = useCallback(async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this journal entry?')) return;
    await deleteEntry(entryId);
  }, []);

  const firstName = user?.displayName?.split(' ')[0] || 'Student';

  const mostFrequentMood = useMemo(() => {
    if (entries.length === 0) return 'None yet';
    const counts = {};
    entries.forEach(e => {
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }, [entries]);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container">
        {/* Hero */}
        <div className="dashboard-hero animate-fade-in">
          <div className="dashboard-hero-text">
            <h1 className="dashboard-name">
              Welcome back, {firstName} <span className="wave">👋</span>
            </h1>
            <p className="dashboard-sub">Reflect on your day and track your journey.</p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/create-entry')}
          >
            <Plus size={18} /> New Entry
          </button>
        </div>

        {/* Stats & Trends Row */}
        <div className="dashboard-grid">
          <div className="card stat-trend-card animate-fade-in">
            <div className="card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={18} className="text-accent" /> Your Stats
              </h3>
            </div>
            <div className="stats-mini-grid">
              <div className="stat-mini">
                <div className="stat-mini-value gradient-text">{entries.length}</div>
                <div className="stat-mini-label">Total Entries</div>
              </div>
              <div className="stat-mini">
                <div className="stat-mini-value text-accent">{mostFrequentMood}</div>
                <div className="stat-mini-label">Top Mood</div>
              </div>
            </div>
          </div>

          <div className="card stat-trend-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart2 size={18} style={{ color: 'var(--accent-purple)' }} /> Mood Trends
              </h3>
            </div>
            <MoodChart entries={entries} />
          </div>
        </div>

        {/* Feed */}
        <div className="feed-header animate-fade-in" style={{ animationDelay: '0.2s', marginTop: 40, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <BookOpen size={20} className="text-accent" />
          <h2 style={{ fontSize: '1.4rem' }}>Past Entries</h2>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: 300 }}>
            <div className="spinner" />
            <p style={{ color: 'var(--text-secondary)' }}>Loading your journal...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="empty-state animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="empty-state-icon">
              <BookOpen size={36} />
            </div>
            <h3>Your journal is empty</h3>
            <p>Start tracking your daily thoughts and emotions.</p>
            <Link to="/create-entry" className="btn btn-primary" style={{ marginTop: 16 }}>
              <Plus size={16} /> Write First Entry
            </Link>
          </div>
        ) : (
          <div className="journal-grid">
            {entries.map((entry, i) => (
              <div key={entry.id} style={{ animationDelay: `${0.1 * (i % 5)}s` }} className="animate-fade-in">
                <JournalCard entry={entry} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
