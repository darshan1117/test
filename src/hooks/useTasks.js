import { useState, useEffect } from 'react';
import { subscribeToTasks } from '../services/taskService';

export const useTasks = (userId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    
    setLoading(true);
    const unsubscribe = subscribeToTasks(userId, (tasks) => {
      setData(tasks);
      setLoading(false);
    }, (err) => {
      console.error("useTasks Error:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { data, loading, error };
};
