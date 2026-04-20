import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

export const createEntry = (userId, data) =>
  addDoc(collection(db, 'journals'), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  });

export const updateEntry = (entryId, data) =>
  updateDoc(doc(db, 'journals', entryId), data);

export const deleteEntry = (entryId) =>
  deleteDoc(doc(db, 'journals', entryId));

export const getEntry = (entryId) =>
  getDoc(doc(db, 'journals', entryId));

export const subscribeToEntries = (userId, callback) => {
  const q = query(
    collection(db, 'journals'),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
      return timeB - timeA;
    });
    callback(data);
  }, (error) => {
    console.error("Error fetching journals:", error);
    callback([]);
  });
};
