import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

export const createDeadline = (userId, title, dueDate) =>
  addDoc(collection(db, 'deadlines'), {
    userId,
    title,
    dueDate,
    completed: false,
    createdAt: serverTimestamp(),
  });

export const updateDeadline = (deadlineId, data) =>
  updateDoc(doc(db, 'deadlines', deadlineId), data);

export const deleteDeadline = (deadlineId) =>
  deleteDoc(doc(db, 'deadlines', deadlineId));

export const subscribeToDeadlines = (userId, callback) => {
  const q = query(
    collection(db, 'deadlines'),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Sort locally by nearest date
    data.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime() || 0;
      const dateB = new Date(b.dueDate).getTime() || 0;
      return dateA - dateB;
    });
    callback(data);
  }, (error) => {
    console.error("Error fetching deadlines:", error);
    callback([]);
  });
};
