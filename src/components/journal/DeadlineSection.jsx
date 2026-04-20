import { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { format, parseISO, isBefore, startOfDay } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { subscribeToDeadlines, createDeadline, updateDeadline, deleteDeadline } from '../../services/deadlineService';

const DeadlineSection = () => {
  const { user } = useAuth();
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToDeadlines(user.uid, (data) => {
      setDeadlines(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;
    setAdding(true);
    try {
      await createDeadline(user.uid, newTitle, newDate);
      setNewTitle('');
    } catch (err) {
      console.error("Failed to add deadline", err);
    } finally {
      setAdding(false);
    }
  };

  const toggleComplete = async (deadline) => {
    try {
      await updateDeadline(deadline.id, { completed: !deadline.completed });
    } catch (err) {
      console.error("Failed to update deadline", err);
    }
  };

  const removeDeadline = async (deadlineId) => {
    try {
      await deleteDeadline(deadlineId);
    } catch (err) {
      console.error("Failed to delete deadline", err);
    }
  };

  const today = startOfDay(new Date());

  return (
    <div className="deadline-section">
      <form onSubmit={handleAdd} className="deadline-input-form" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="text"
          className="form-input"
          placeholder="New deadline..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={adding}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="date"
            className="form-input"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            disabled={adding}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary task-add-btn" disabled={adding || !newTitle.trim()}>
            <Plus size={16} />
          </button>
        </div>
      </form>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto', width: 24, height: 24 }} />
        </div>
      ) : deadlines.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: 16 }}>
          No upcoming deadlines.
        </p>
      ) : (
        <div className="tasks-list" style={{ marginTop: 12 }}>
          {deadlines.map(deadline => {
            const isOverdue = !deadline.completed && isBefore(parseISO(deadline.dueDate), today);
            return (
              <div key={deadline.id} className={`task-item ${deadline.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
                <button 
                  type="button" 
                  className="task-toggle-btn" 
                  onClick={() => toggleComplete(deadline)}
                >
                  {deadline.completed ? <CheckCircle2 size={18} className="text-accent" /> : <Circle size={18} />}
                </button>
                <div className="task-text" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{deadline.title}</span>
                  <span className="deadline-date">
                    <CalendarIcon size={10} style={{ marginRight: 4, display: 'inline' }} />
                    {format(parseISO(deadline.dueDate), 'MMM do, yyyy')}
                  </span>
                </div>
                <button 
                  type="button" 
                  className="task-delete-btn btn btn-icon btn-ghost" 
                  onClick={() => removeDeadline(deadline.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeadlineSection;
