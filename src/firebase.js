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

// Remove validation logic as we are using hardcoded config
const missingKeys = [];


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (optional - may be blocked by ad blockers)
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('Firebase Analytics blocked or unavailable:', error.message);
}
export { analytics };

// Google Sign-In function
export const signInWithGoogle = async () => {
  // Check if Firebase is properly configured
  if (missingKeys.length > 0) {
    return {
      success: false,
      error: 'Firebase is not configured. Please add your Firebase credentials to the .env file.'
    };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Database Reference
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // Determine Role
    let role = 'user';
    const email = user.email.toLowerCase();

    if (email === 'newtvnbrian@gmail.com') {
      role = 'admin';
    } else if (email === 'newtonbryan12428@gmail.com') {
      role = 'manager';
    } else if (userSnap.exists()) {
      // Preserve existing role if user already exists and isn't one of the special accounts
      const existingData = userSnap.data();
      if (existingData.role) role = existingData.role;
    }

    // User Data Payload
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: role,
      lastLogin: serverTimestamp(),
      createdAt: userSnap.exists() ? userSnap.data().createdAt : serverTimestamp()
    };

    // Save to Firestore (Merge to update lastLogin without wiping other fields if we add them later)
    await setDoc(userRef, userData, { merge: true });

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

    // Provide user-friendly error messages
    let errorMessage = error.message;
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in was cancelled. Please try again.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Pop-up was blocked. Please allow pop-ups for this site.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized for Google Sign-In. Please add it to Firebase Console.';
    } else if (error.code === 'auth/invalid-api-key') {
      errorMessage = 'Invalid Firebase API key. Please check your .env configuration.';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// Sign out function
export const signOutUser = async () => {
  try {
    await signOut(auth);
    // Clear localStorage on logout
    localStorage.removeItem('goalhub_user');
    localStorage.removeItem('goalhub_role');
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
