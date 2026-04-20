import { useState, useEffect } from 'react';
import { Mail, Calendar, Globe, Edit2, Check, X, BookOpen, Activity, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscribeToEntries } from '../services/journalService';
import { updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';
import Navbar from '../components/layout/Navbar';

const ProfilePage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToEntries(user.uid, (data) => setEntries(data));
    return () => unsubscribe();
  }, [user]);

  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'S';

  const handleSave = async () => {
    if (!displayName.trim()) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '–';

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="profile-page animate-fade-in">
          {/* Profile Header Card */}
          <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ height: 120, background: 'var(--gradient-primary)', opacity: 0.8 }} />
            <div style={{ padding: '0 24px 24px', display: 'flex', gap: 20, marginTop: -40 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-secondary)',
                border: '4px solid var(--bg-primary)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#fff',
                overflow: 'hidden'
              }}>
                {user?.photoURL ? <img src={user.photoURL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
              </div>
              <div style={{ marginTop: 44, flex: 1 }}>
                {editing ? (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      className="form-input"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      style={{ maxWidth: 240 }}
                    />
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                      <Check size={14} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <h2 style={{ fontSize: '1.4rem' }}>{user?.displayName || 'Student'}</h2>
                    <button type="button" className="btn btn-icon btn-ghost" onClick={() => setEditing(true)}>
                      <Edit2 size={15} />
                    </button>
                  </div>
                )}
                {success && <p style={{ color: '#4ade80', fontSize: '0.85rem', marginTop: 4 }}>✓ Profile updated</p>}
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> {user?.email}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> Joined {joinDate}</span>
                  {user?.photoURL && <span className="badge badge-blue"><Globe size={12} /> Google Account</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="profile-grid">
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ padding: 10, borderRadius: 10, background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{entries.length}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Entries</div>
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ padding: 10, borderRadius: 10, background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                  <Activity size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {entries.length > 0 ? Array.from(new Set(entries.map(e => e.mood))).length : 0}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Moods Tracked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
