import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkeKpob-TwhGhRR4fPns9T3_txB9QplxI",
  authDomain: "goalhub-prod.firebaseapp.com",
  projectId: "goalhub-prod",
  storageBucket: "goalhub-prod.firebasestorage.app",
  messagingSenderId: "294205667072",
  appId: "1:294205667072:web:992f56b74342c2692c25e5",
  measurementId: "G-104L8JVFEC"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign-In function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        token: await result.user.getIdToken()
      }
    };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Sign out function
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        token: await result.user.getIdToken()
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const registerUser = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: {
        uid: result.user.uid,
        email: result.user.email,
        token: await result.user.getIdToken()
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const onAuthStateChangedListener = (callback) => {
  return auth.onAuthStateChanged(callback);
};
