import { useState, useCallback } from 'react';
import { Plus, Trash2, Circle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { useToast } from '../../context/ToastContext';
import { createTask, updateTask, deleteTask } from '../../services/taskService';

const TaskSection = () => {
  const { user } = useAuth();
  const { data: tasks, loading } = useTasks(user?.uid);
  const { addToast } = useToast();
  const [newTaskText, setNewTaskText] = useState('');
  const [adding, setAdding] = useState(false);

  /**
   * memoized handleAddTask prevents the form from re-creating this function on every render,
   * which is useful if we ever pass this as a prop to a memoized sub-component.
   */
  const handleAddTask = useCallback(async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setAdding(true);
    try {
      await createTask(user.uid, newTaskText);
      setNewTaskText('');
      addToast('Task added successfully!');
    } catch (err) {
      console.error("Failed to add task", err);
      addToast('Failed to add task.', 'error');
    } finally {
      setAdding(false);
    }
  }, [user?.uid, newTaskText, addToast]);

  /**
   * toggleTask and removeTask are memoized to ensure they maintain the same reference,
   * preventing unnecessary re-renders of the task items in the list.
   */
  const toggleTask = useCallback(async (task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      addToast(task.completed ? 'Task marked as incomplete' : 'Task completed!');
    } catch (err) {
      console.error("Failed to update task", err);
      addToast('Failed to update task.', 'error');
    }
  }, [addToast]);

  const removeTask = useCallback(async (taskId) => {
    try {
      await deleteTask(taskId);
      addToast('Task removed.');
    } catch (err) {
      console.error("Failed to delete task", err);
      addToast('Failed to delete task.', 'error');
    }
  }, [addToast]);

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
