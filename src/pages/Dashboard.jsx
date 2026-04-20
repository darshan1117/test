import { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, BookOpen, CheckSquare, Search, Calendar as CalendarIcon, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useJournalEntries } from '../hooks/useJournalEntries';
import { useToast } from '../context/ToastContext';
import { deleteEntry } from '../services/journalService';
import JournalCard from '../components/journal/JournalCard';
import AnalyticsPanel from '../components/journal/AnalyticsPanel';
import TaskSection from '../components/journal/TaskSection';
import DeadlineSection from '../components/journal/DeadlineSection';
import Navbar from '../components/layout/Navbar';

const MOODS = ['All', 'Happy', 'Productive', 'Tired', 'Sad'];

/**
 * Custom Modal Component for deletions
 */
const DeleteModal = ({ isOpen, title, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: 10, borderRadius: '50%' }}>
            <AlertTriangle size={24} />
          </div>
          <h2 className="modal-title">Delete Entry?</h2>
        </div>
        <p className="modal-message">
          Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" style={{ background: '#ef4444' }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { data: entries, loading } = useJournalEntries(user?.uid);
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState('All');

  // Modal State
  const [deleteModal, setDeleteModal] = useState({ open: false, entryId: null, entryTitle: '' });

  /**
   * handleDelete shows the custom modal instead of window.confirm
   */
  const handleDeleteRequest = useCallback((entry) => {
    setDeleteModal({ open: true, entryId: entry.id, entryTitle: entry.title });
  }, []);

  const confirmDelete = async () => {
    try {
      await deleteEntry(deleteModal.entryId);
      addToast('Entry deleted successfully');
      setDeleteModal({ open: false, entryId: null, entryTitle: '' });
    } catch (err) {
      console.error(err);
      addToast('Failed to delete entry.', 'error');
    }
  };

  const firstName = user?.displayName?.split(' ')[0] || 'Student';

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const matchesMood = moodFilter === 'All' || e.mood === moodFilter;
      const matchesSearch = !searchQuery.trim() || e.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMood && matchesSearch;
    });
  }, [entries, moodFilter, searchQuery]);

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


        {/* Top Grid: Analytics */}
        <div className="card stat-trend-card animate-fade-in" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} className="text-accent" /> Advanced Analytics
            </h3>
          </div>
          <AnalyticsPanel entries={entries} />
        </div>

        {/* Second Grid: Tasks & Deadlines */}
        <div className="dashboard-top-grid">
          <div className="card stat-trend-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckSquare size={18} style={{ color: '#10b981' }} /> Daily Tasks
              </h3>
            </div>
            <TaskSection />
          </div>

          <div className="card stat-trend-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarIcon size={18} style={{ color: '#ef4444' }} /> Upcoming Deadlines
              </h3>
            </div>
            <DeadlineSection />
          </div>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="dashboard-toolbar animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-pills">
            {MOODS.map(m => (
              <button
                key={m}
                type="button"
                className={`filter-pill ${moodFilter === m ? 'active' : ''}`}
                onClick={() => setMoodFilter(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="feed-header animate-fade-in" style={{ animationDelay: '0.4s', marginTop: 10, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <BookOpen size={20} className="text-accent" />
          <h2 style={{ fontSize: '1.4rem' }}>Journal Entries</h2>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: 300 }}>
            <div className="spinner" />
            <p style={{ color: 'var(--text-secondary)' }}>Loading your journal...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="empty-state animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="empty-state-icon">
              <BookOpen size={36} />
            </div>
            <h3>{entries.length === 0 ? 'Your journal is empty' : 'No entries found'}</h3>
            <p>
              {entries.length === 0 
                ? 'Start tracking your daily thoughts and emotions.' 
                : 'Try clearing your search or filters.'}
            </p>
            {entries.length === 0 && (
              <Link to="/create-entry" className="btn btn-primary" style={{ marginTop: 16 }}>
                <Plus size={16} /> Write First Entry
              </Link>
            )}
          </div>
        ) : (
          <div className="journal-grid">
            {filteredEntries.map((entry, i) => (
              <div key={entry.id} style={{ animationDelay: `${0.1 * (i % 5)}s` }} className="animate-fade-in">
                <JournalCard entry={entry} onDelete={() => handleDeleteRequest(entry)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Delete Modal */}
      <DeleteModal 
        isOpen={deleteModal.open}
        title={deleteModal.entryTitle}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, entryId: null, entryTitle: '' })}
      />
    </div>
  );
};

export default Dashboard;
