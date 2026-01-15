import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  serverTimestamp,
  where
} from 'firebase/firestore';

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
        ...userData,
        // Convert timestamps to ISO strings for non-DB usage
        lastLogin: new Date().toISOString()
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

// Get user data from Firestore by UID
export const getUserFromFirestore = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return {
        success: true,
        user: userSnap.data()
      };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: error.message };
  }
};

// Subscribe to auth state changes
// Returns unsubscribe function
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // User is signed in - fetch their data from Firestore
      const result = await getUserFromFirestore(firebaseUser.uid);

      if (result.success) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: result.user.role || 'user',
          ...result.user
        };

        // Save to localStorage for faster restoration
        localStorage.setItem('goalhub_user', JSON.stringify(userData));
        localStorage.setItem('goalhub_role', userData.role);

        callback({ user: userData, loading: false });
      } else {
        // User exists in Firebase Auth but not in Firestore (edge case)
        // Use basic info from Firebase Auth
        const basicUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: 'user'
        };
        callback({ user: basicUser, loading: false });
      }
    } else {
      // User is signed out
      localStorage.removeItem('goalhub_user');
      localStorage.removeItem('goalhub_role');
      callback({ user: null, loading: false });
    }
  });
};

// Get cached user from localStorage (for instant UI while Firebase loads)
export const getCachedUser = () => {
  try {
    const cachedUser = localStorage.getItem('goalhub_user');
    const cachedRole = localStorage.getItem('goalhub_role');

    if (cachedUser && cachedRole) {
      return {
        user: JSON.parse(cachedUser),
        role: cachedRole
      };
    }
  } catch (error) {
    console.error("Error reading cached user:", error);
  }
  return null;
};

// ============================================
// BOOKINGS CRUD OPERATIONS
// ============================================

// Generate unique booking ID
const generateBookingId = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `BK-${num}`;
};

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const bookingId = generateBookingId();
    const bookingRef = doc(db, "bookings", bookingId);

    const booking = {
      ...bookingData,
      id: bookingId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(bookingRef, booking);
    return { success: true, booking: { ...booking, id: bookingId } };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: error.message };
  }
};

// Update a booking
export const updateBooking = async (bookingId, updates) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating booking:", error);
    return { success: false, error: error.message };
  }
};

// Delete a booking
export const deleteBooking = async (bookingId) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await deleteDoc(bookingRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return { success: false, error: error.message };
  }
};

// Subscribe to real-time booking updates
export const subscribeToBookings = (callback) => {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    callback(bookings);
  }, (error) => {
    console.error("Error subscribing to bookings:", error);
    callback([]);
  });
};

// Get bookings for a specific user
export const getUserBookings = async (userEmail) => {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("customerEmail", "==", userEmail), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const bookings = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    return { success: true, bookings };
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return { success: false, error: error.message, bookings: [] };
  }
};

// ============================================
// NOTIFICATIONS CRUD OPERATIONS
// ============================================

// Create a notification
export const createNotification = async (notificationData) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const notification = {
      ...notificationData,
      read: false,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(notificationsRef, notification);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, error: error.message };
  }
};

// Mark notification as read
export const markNotificationRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, { read: true });
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: error.message };
  }
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await deleteDoc(notificationRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { success: false, error: error.message };
  }
};

// Subscribe to real-time notification updates
export const subscribeToNotifications = (callback) => {
  const notificationsRef = collection(db, "notifications");
  const q = query(notificationsRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      timestamp: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));
    callback(notifications);
  }, (error) => {
    console.error("Error subscribing to notifications:", error);
    callback([]);
  });
};

// ============================================
// EVENTS CRUD OPERATIONS
// ============================================

// Create an event
export const createEvent = async (eventData) => {
  try {
    const eventsRef = collection(db, "events");
    const event = {
      ...eventData,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(eventsRef, event);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: error.message };
  }
};

// Update an event
export const updateEvent = async (eventId, updates) => {
  try {
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error: error.message };
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, "events", eventId);
    await deleteDoc(eventRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: error.message };
  }
};

// Subscribe to real-time event updates
export const subscribeToEvents = (callback) => {
  const eventsRef = collection(db, "events");
  const q = query(eventsRef, orderBy("date", "asc"));

  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    callback(events);
  }, (error) => {
    console.error("Error subscribing to events:", error);
    callback([]);
  });
};

// ============================================
// USERS MANAGEMENT (Admin only)
// ============================================

// Get all users
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const users = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: error.message, users: [] };
  }
};

// Update user role
export const updateUserRole = async (userId, newRole) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: error.message };
  }
};

// Subscribe to real-time user updates (for admin)
export const subscribeToUsers = (callback) => {
  const usersRef = collection(db, "users");

  return onSnapshot(usersRef, (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      status: 'Active' // Default status
    }));
    callback(users);
  }, (error) => {
    console.error("Error subscribing to users:", error);
    callback([]);
  });
};

// ============================================
// TURFS (PITCHES) CRUD OPERATIONS
// ============================================

// Subscribe to real-time turf updates
export const subscribeToTurfs = (callback) => {
  const turfsRef = collection(db, "turfs");
  const q = query(turfsRef, orderBy("name", "asc"));

  return onSnapshot(q, (snapshot) => {
    const turfs = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    callback(turfs);
  }, (error) => {
    console.error("Error subscribing to turfs:", error);
    callback([]);
  });
};

// Create a turf
export const createTurf = async (turfData) => {
  try {
    const turfsRef = collection(db, "turfs");
    const turf = {
      ...turfData,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(turfsRef, turf);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating turf:", error);
    return { success: false, error: error.message };
  }
};

// Update a turf
export const updateTurf = async (turfId, updates) => {
  try {
    const turfRef = doc(db, "turfs", turfId);
    await updateDoc(turfRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating turf:", error);
    return { success: false, error: error.message };
  }
};

// Delete a turf
export const deleteTurf = async (turfId) => {
  try {
    const turfRef = doc(db, "turfs", turfId);
    await deleteDoc(turfRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting turf:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// EXTRAS (ADD-ONS) CRUD OPERATIONS
// ============================================

// Subscribe to real-time extras updates
export const subscribeToExtras = (callback) => {
  const extrasRef = collection(db, "extras");
  const q = query(extrasRef, orderBy("name", "asc"));

  return onSnapshot(q, (snapshot) => {
    const extras = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    callback(extras);
  }, (error) => {
    console.error("Error subscribing to extras:", error);
    callback([]);
  });
};

// Create an extra
export const createExtra = async (extraData) => {
  try {
    const extrasRef = collection(db, "extras");
    const extra = {
      ...extraData,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(extrasRef, extra);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating extra:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// SETTINGS/CONFIG OPERATIONS
// ============================================

// Get app settings (discount, etc.)
export const subscribeToSettings = (callback) => {
  const settingsRef = doc(db, "settings", "global");

  return onSnapshot(settingsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback({ globalDiscount: 0 });
    }
  }, (error) => {
    console.error("Error subscribing to settings:", error);
    callback({ globalDiscount: 0 });
  });
};

// Update settings
export const updateSettings = async (settings) => {
  try {
    const settingsRef = doc(db, "settings", "global");
    await setDoc(settingsRef, {
      ...settings,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// TRANSACTIONS/PAYMENTS CRUD OPERATIONS
// ============================================

// Generate unique transaction ID
const generateTransactionId = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `TXN-${num}`;
};

// Create a transaction record
export const createTransaction = async (transactionData) => {
  try {
    const transactionId = generateTransactionId();
    const transactionRef = doc(db, "transactions", transactionId);

    const transaction = {
      ...transactionData,
      id: transactionId,
      createdAt: serverTimestamp()
    };

    await setDoc(transactionRef, transaction);
    return { success: true, transaction: { ...transaction, id: transactionId } };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: error.message };
  }
};

// Update transaction status
export const updateTransaction = async (transactionId, updates) => {
  try {
    const transactionRef = doc(db, "transactions", transactionId);
    await updateDoc(transactionRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { success: false, error: error.message };
  }
};

// Subscribe to real-time transaction updates
export const subscribeToTransactions = (callback) => {
  const transactionsRef = collection(db, "transactions");
  const q = query(transactionsRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));
    callback(transactions);
  }, (error) => {
    console.error("Error subscribing to transactions:", error);
    callback([]);
  });
};

// Get transactions for a specific user
export const getUserTransactions = async (userEmail) => {
  try {
    const transactionsRef = collection(db, "transactions");
    const q = query(transactionsRef, where("customerEmail", "==", userEmail), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const transactions = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    return { success: true, transactions };
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return { success: false, error: error.message, transactions: [] };
  }
};

// Get transaction statistics
export const getTransactionStats = async () => {
  try {
    const transactionsRef = collection(db, "transactions");
    const snapshot = await getDocs(transactionsRef);

    let totalAmount = 0;
    let successCount = 0;
    let pendingCount = 0;
    let failedCount = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.status === 'completed' || data.status === 'success') {
        totalAmount += data.amount || 0;
        successCount++;
      } else if (data.status === 'pending') {
        pendingCount++;
      } else {
        failedCount++;
      }
    });

    return {
      success: true,
      stats: { totalAmount, successCount, pendingCount, failedCount, totalCount: snapshot.docs.length }
    };
  } catch (error) {
    console.error("Error getting transaction stats:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// UTILITIES
// ============================================

// Monitor connection status (Online/Offline)
export const monitorConnection = (callback) => {
  // Simple window online/offline listeners
  const updateStatus = () => callback(navigator.onLine ? 'online' : 'offline');

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);

  // Initial check
  updateStatus();

  return () => {
    window.removeEventListener('online', updateStatus);
    window.removeEventListener('offline', updateStatus);
  };
};

// Poll payment status
export const pollPaymentStatus = async (transactionId, retries = 20) => {
  // In a real implementation, you would check Firestore document for status update
  // For now, we simulate waiting or check Firestore
  let attempts = 0;

  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      attempts++;

      try {
        const transactionRef = doc(db, "transactions", transactionId);
        const snap = await getDoc(transactionRef);

        if (snap.exists()) {
          const status = snap.data().status;
          if (status === 'completed' || status === 'success') {
            clearInterval(interval);
            resolve(true);
            return;
          }
          if (status === 'failed') {
            clearInterval(interval);
            resolve(false);
            return;
          }
        }
      } catch (e) {
        console.error("Polling error", e);
      }

      if (attempts >= retries) {
        clearInterval(interval);
        resolve(false); // Timeout
      }
    }, 2000); // Check every 2 seconds
  });
};

// Update an extra
export const updateExtra = async (extraId, updates) => {
  try {
    const extraRef = doc(db, "extras", extraId);
    await updateDoc(extraRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating extra:", error);
    return { success: false, error: error.message };
  }
};

