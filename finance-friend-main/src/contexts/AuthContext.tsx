import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { userStorage, sessionStorage, clearAllData } from '@/lib/storage';

export type Character = 'spark' | 'zen' | 'sage' | null;
export type AuthProviderType = 'password' | 'google';

export interface User {
  uid: string;
  email: string;
  username: string;
  phoneNumber: string;
  authProvider: AuthProviderType;
  createdAt: string;
  character: Character;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (username: string, email: string, phoneNumber: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  updateProfile: (data: Partial<Pick<User, 'username' | 'phoneNumber'>>) => Promise<void>;
  logout: () => void;
  selectCharacter: (character: Character) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Load user from storage using email as key
 */
function loadUserFromStorage(): User | null {
  try {
    const currentEmail = sessionStorage.getCurrentUserEmail();
    if (!currentEmail) return null;

    const profile = userStorage.getProfile(currentEmail);
    if (!profile) return null;

    // Migrate legacy data if needed
    if (profile && !profile.uid && profile.id) {
      const migrated: User = {
        uid: String(profile.id),
        email: profile.email || currentEmail,
        username: profile.username || profile.name || '',
        phoneNumber: profile.phoneNumber || profile.mobile || '',
        authProvider: profile.authProvider || 'password',
        createdAt: profile.createdAt || new Date().toISOString(),
        character: profile.character ?? null,
      };
      userStorage.setProfile(currentEmail, migrated);
      return migrated;
    }

    return profile as User;
  } catch {
    return null;
  }
}

/**
 * Persist user profile using email as key
 */
function persistUser(user: User | null) {
  if (!user) {
    sessionStorage.setCurrentUserEmail(null);
    return;
  }
  // Store profile keyed by email
  userStorage.setProfile(user.email, user);
  // Store current session email
  sessionStorage.setCurrentUserEmail(user.email);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadUserFromStorage());
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-load user on mount if session exists
  useEffect(() => {
    if (!isInitialized) {
      const loadedUser = loadUserFromStorage();
      if (loadedUser) {
        setUser(loadedUser);
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const login = async (email: string, password: string): Promise<User> => {
    // Simulated login - replace with real auth later
    // In real app, verify password with backend/Firebase
    
    // Load existing profile for this email
    const existingProfile = userStorage.getProfile(email);
    
    const mockUser: User = existingProfile
      ? {
          ...existingProfile,
          email, // Ensure email matches
        }
      : {
          uid: `user_${Date.now()}`,
          email,
          username: '',
          phoneNumber: '',
          authProvider: 'password',
          createdAt: new Date().toISOString(),
          character: null,
        };

    setUser(mockUser);
    persistUser(mockUser);
    return mockUser;
  };

  const signup = async (
    username: string,
    email: string,
    phoneNumber: string,
    password: string
  ): Promise<User> => {
    // Simulated signup - replace with real auth later
    // In real app, create user account with backend/Firebase
    
    const mockUser: User = {
      uid: `user_${Date.now()}`,
      email,
      username,
      phoneNumber,
      authProvider: 'password',
      createdAt: new Date().toISOString(),
      character: null,
    };
    
    setUser(mockUser);
    persistUser(mockUser);
    return mockUser;
  };

  const loginWithGoogle = async (): Promise<User> => {
    // Simulated Google login - in real app, integrate Firebase / OAuth here
    // For demo, prompt for email or use a default
    const email = prompt('Enter your Gmail address (for demo):') || 'demo.google@example.com';
    
    // Load existing profile for this email
    const existingProfile = userStorage.getProfile(email);
    
    const mockUser: User = existingProfile
      ? {
          ...existingProfile,
          email,
          authProvider: 'google',
        }
      : {
          uid: `google_${Date.now()}`,
          email,
          username: '',
          phoneNumber: '',
          authProvider: 'google',
          createdAt: new Date().toISOString(),
          character: null,
        };

    setUser(mockUser);
    persistUser(mockUser);
    return mockUser;
  };

  const updateProfile = async (data: Partial<Pick<User, 'username' | 'phoneNumber'>>) => {
    if (!user) return;
    const updated: User = { ...user, ...data };
    setUser(updated);
    persistUser(updated);
  };

  const logout = () => {
    // Clear session but keep user data (so user can log back in)
    setUser(null);
    sessionStorage.setCurrentUserEmail(null);
  };

  const selectCharacter = (character: Character) => {
    if (user) {
      const updatedUser = { ...user, character };
      setUser(updatedUser);
      persistUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        loginWithGoogle,
        updateProfile,
        logout,
        selectCharacter,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
