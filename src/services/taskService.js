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

export const createTask = (userId, text) =>
  addDoc(collection(db, 'tasks'), {
    userId,
    text,
    completed: false,
    createdAt: serverTimestamp(),
  });

export const updateTask = (taskId, data) =>
  updateDoc(doc(db, 'tasks', taskId), data);

export const deleteTask = (taskId) =>
  deleteDoc(doc(db, 'tasks', taskId));

export const subscribeToTasks = (userId, callback) => {
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Sort locally by createdAt desc
    data.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
      return timeB - timeA;
    });
    callback(data);
  }, (error) => {
    console.error("Error fetching tasks:", error);
    callback([]);
  });
};
