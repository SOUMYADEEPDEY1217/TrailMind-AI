import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { UserProfile } from '../types';

/**
 * User provided Firebase configuration for TrailMind AI
 */
export const firebaseConfig = {
  apiKey: "AIzaSyAAPBaWyCunoVnfFtyVxfdkSdrzsvfY68A",
  authDomain: "trailmind-ai-4316a.firebaseapp.com",
  projectId: "trailmind-ai-4316a",
  storageBucket: "trailmind-ai-4316a.firebasestorage.app",
  messagingSenderId: "533500160007",
  appId: "1:533500160007:web:ce445cc5d48cf1ab60e2a2"
};

// Initialize Firebase safely (avoid duplicate app initializations)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Save or update user details in the Firestore `users` database collection
 */
export async function saveUserDetailsToFirestore(
  uid: string,
  details: Partial<UserProfile>
): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const existingSnap = await getDoc(userDocRef);

    if (existingSnap.exists()) {
      await updateDoc(userDocRef, {
        ...details,
        lastLoginAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      });
    } else {
      const initialProfile: UserProfile = {
        uid,
        email: details.email || null,
        displayName: details.displayName || 'Explorer',
        photoURL: details.photoURL || null,
        experienceLevel: details.experienceLevel || 'Novice Explorer',
        preferredBiome: details.preferredBiome || 'forest_trail',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        totalAdventures: details.totalAdventures || 0,
        totalOutdoorMinutes: details.totalOutdoorMinutes || 0,
      };
      await setDoc(userDocRef, {
        ...initialProfile,
        serverCreatedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.warn('[Firebase] Could not save user details to Firestore:', error);
    // Do not crash the app if Firestore offline or permission issue
  }
}

/**
 * Retrieve user details from the Firestore `users` database collection
 */
export async function getUserDetailsFromFirestore(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('[Firebase] Could not fetch user details from Firestore:', error);
    return null;
  }
}

/**
 * Sign up a new user with Email, Password and optional Explorer Call-sign / Display Name
 */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Set auth profile displayName
  if (displayName.trim()) {
    try {
      await updateProfile(user, { displayName: displayName.trim() });
    } catch {
      // Ignore secondary profile update error
    }
  }

  // Persist user record into Firestore database
  await saveUserDetailsToFirestore(user.uid, {
    uid: user.uid,
    email: user.email,
    displayName: displayName.trim() || user.displayName || 'Trail Explorer',
    photoURL: user.photoURL,
    experienceLevel: 'Novice Explorer',
    preferredBiome: 'forest_trail',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  });

  return user;
}

/**
 * Sign in an existing user with Email and Password
 */
export async function loginWithEmail(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Update last login timestamp in Firestore database
  await saveUserDetailsToFirestore(user.uid, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'Explorer',
    photoURL: user.photoURL,
    lastLoginAt: new Date().toISOString(),
  });

  return user;
}

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogle(): Promise<User> {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Persist / update user details in Firestore
  await saveUserDetailsToFirestore(user.uid, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'Explorer',
    photoURL: user.photoURL,
    lastLoginAt: new Date().toISOString(),
  });

  return user;
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Send password reset email
 */
export async function resetUserPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Record completed adventure telemetry in user Firestore document
 */
export async function recordAdventureCompletionInFirestore(
  uid: string,
  adventureData: {
    title: string;
    durationMinutes: number;
    rating: number;
    reflection?: string;
  }
): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const currentCount = Number(data.totalAdventures || 0) + 1;
      const currentMinutes = Number(data.totalOutdoorMinutes || 0) + Number(adventureData.durationMinutes || 0);

      let newLevel = data.experienceLevel || 'Novice Explorer';
      if (currentCount >= 10 || currentMinutes >= 300) {
        newLevel = 'Trail Master';
      } else if (currentCount >= 3 || currentMinutes >= 60) {
        newLevel = 'Seasoned Rambler';
      }

      await updateDoc(userDocRef, {
        totalAdventures: currentCount,
        totalOutdoorMinutes: currentMinutes,
        experienceLevel: newLevel,
        lastAdventureAt: new Date().toISOString(),
        lastAdventureTitle: adventureData.title,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.warn('[Firebase] Could not record adventure stats in Firestore:', err);
  }
}

