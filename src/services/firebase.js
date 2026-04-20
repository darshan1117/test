import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB7iZzFBAaRSwthLhmwBmiK6TUaod_EFFM",
  authDomain: "my-end-term.firebaseapp.com",
  projectId: "my-end-term",
  storageBucket: "my-end-term.firebasestorage.app",
  messagingSenderId: "825134886877",
  appId: "1:825134886877:web:8bfda48d3619f955529034",
  measurementId: "G-4WKC0L0JK7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);

export default app;
