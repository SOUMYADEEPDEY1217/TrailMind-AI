import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  resetUserPassword,
  getUserDetailsFromFirestore,
  saveUserDetailsToFirestore,
} from '../services/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  signUp: (email: string, pass: string, name: string) => Promise<User>;
  signIn: (email: string, pass: string) => Promise<User>;
  signInGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileDetails: (details: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await getUserDetailsFromFirestore(user.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            // Auto create if not in Firestore yet
            const fallbackProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'Trail Explorer',
              photoURL: user.photoURL,
              experienceLevel: 'Novice Explorer',
              preferredBiome: 'forest_trail',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              totalAdventures: 0,
              totalOutdoorMinutes: 0,
            };
            setUserProfile(fallbackProfile);
            await saveUserDetailsToFirestore(user.uid, fallbackProfile);
          }
        } catch (err) {
          console.warn('[AuthProvider] Error fetching Firestore user details:', err);
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signUp = async (email: string, pass: string, name: string) => {
    const user = await registerWithEmail(email, pass, name);
    const profile = await getUserDetailsFromFirestore(user.uid);
    if (profile) setUserProfile(profile);
    return user;
  };

  const signIn = async (email: string, pass: string) => {
    const user = await loginWithEmail(email, pass);
    const profile = await getUserDetailsFromFirestore(user.uid);
    if (profile) setUserProfile(profile);
    return user;
  };

  const signInGoogle = async () => {
    const user = await loginWithGoogle();
    const profile = await getUserDetailsFromFirestore(user.uid);
    if (profile) setUserProfile(profile);
    return user;
  };

  const signOut = async () => {
    await logoutUser();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await resetUserPassword(email);
  };

  const updateProfileDetails = async (details: Partial<UserProfile>) => {
    if (!currentUser) return;
    await saveUserDetailsToFirestore(currentUser.uid, details);
    const updated = await getUserDetailsFromFirestore(currentUser.uid);
    if (updated) setUserProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isLoading,
        isLoggedIn: !!currentUser,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        signUp,
        signIn,
        signInGoogle,
        signOut,
        resetPassword,
        updateProfileDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
