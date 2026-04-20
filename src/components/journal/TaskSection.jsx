import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Circle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { subscribeToTasks, createTask, updateTask, deleteTask } from '../../services/taskService';

const TaskSection = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskText, setNewTaskText] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToTasks(user.uid, (data) => {
      setTasks(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setAdding(true);
    try {
      await createTask(user.uid, newTaskText);
      setNewTaskText('');
    } catch (err) {
      console.error("Failed to add task", err);
    } finally {
      setAdding(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const removeTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  return (
    <div className="task-section">
      <form onSubmit={handleAddTask} className="task-input-form">
        <input
          type="text"
          className="form-input"
          placeholder="Add a new daily task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          disabled={adding}
        />
        <button type="submit" className="btn btn-primary task-add-btn" disabled={adding || !newTaskText.trim()}>
          <Plus size={16} />
        </button>
      </form>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto', width: 24, height: 24 }} />
        </div>
      ) : tasks.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: 16 }}>
          No tasks yet. Add one above!
        </p>
      ) : (
        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <button 
                type="button" 
                className="task-toggle-btn" 
                onClick={() => toggleTask(task)}
              >
                {task.completed ? <CheckCircle2 size={18} className="text-accent" /> : <Circle size={18} />}
              </button>
              <span className="task-text">{task.text}</span>
              <button 
                type="button" 
                className="task-delete-btn btn btn-icon btn-ghost" 
                onClick={() => removeTask(task.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskSection;
