import { useState, useEffect } from 'react';
import { subscribeToDeadlines } from '../services/deadlineService';

export const useDeadlines = (userId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    
    setLoading(true);
    const unsubscribe = subscribeToDeadlines(userId, (deadlines) => {
      setData(deadlines);
      setLoading(false);
    }, (err) => {
      console.error("useDeadlines Error:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { data, loading, error };
};
