import { format, parseISO } from 'date-fns';
import { Trash2 } from 'lucide-react';

const MOODS = {
  Happy: { emoji: '😊', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  Sad: { emoji: '😢', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  Tired: { emoji: '😴', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  Productive: { emoji: '🚀', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
};

const JournalCard = ({ entry, onDelete }) => {
  const moodInfo = MOODS[entry.mood] || MOODS.Happy;
  const dateStr = entry.date ? format(parseISO(entry.date), 'MMM do, yyyy') : 'Unknown Date';

  return (
    <div className="journal-card animate-fade-in card">
      <div className="journal-card-header">
        <div className="journal-date">{dateStr}</div>
        <div className="journal-actions">
          <div
            className="journal-mood-badge"
            style={{ color: moodInfo.color, backgroundColor: moodInfo.bg }}
          >
            {moodInfo.emoji} {entry.mood}
          </div>
          {onDelete && (
            <button
              type="button"
              className="btn btn-icon btn-ghost"
              onClick={() => onDelete(entry.id)}
            >
              <Trash2 size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </div>
      </div>
      <div className="journal-card-body">
        <h3 className="journal-title">{entry.title}</h3>
        <p className="journal-content-preview">
          {entry.content?.length > 150 ? entry.content.substring(0, 150) + '...' : entry.content}
        </p>
      </div>
    </div>
  );
};

export default JournalCard;
