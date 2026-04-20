import { useState, useEffect } from 'react';
import { subscribeToEntries } from '../services/journalService';

export const useJournalEntries = (userId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    
    setLoading(true);
    const unsubscribe = subscribeToEntries(userId, (entries) => {
      setData(entries);
      setLoading(false);
    }, (err) => {
      console.error("useJournalEntries Error:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { data, loading, error };
};
