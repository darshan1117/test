import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const registerWithEmail = async (email, password, displayName) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  await setDoc(doc(db, 'users', cred.user.uid), {
    displayName,
    email,
    photoURL: '',
    createdAt: serverTimestamp(),
  });
  return cred;
};

export const loginWithGoogle = async () => {
  const cred = await signInWithPopup(auth, googleProvider);
  const ref = doc(db, 'users', cred.user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: cred.user.displayName,
      email: cred.user.email,
      photoURL: cred.user.photoURL,
      createdAt: serverTimestamp(),
    });
  }
  return cred;
};

export const logout = () => signOut(auth);
