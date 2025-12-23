import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Character = 'spark' | 'zen' | 'sage' | null;

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  character: Character;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, mobile: string, password: string) => Promise<void>;
  logout: () => void;
  selectCharacter: (character: Character) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('finflow-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    // Simulated login - will be replaced with real auth
    const mockUser: User = {
      id: '1',
      name: 'Demo User',
      email,
      mobile: '+1234567890',
      character: localStorage.getItem('finflow-character') as Character || null,
    };
    setUser(mockUser);
    localStorage.setItem('finflow-user', JSON.stringify(mockUser));
  };

  const signup = async (name: string, email: string, mobile: string, password: string) => {
    const mockUser: User = {
      id: '1',
      name,
      email,
      mobile,
      character: null,
    };
    setUser(mockUser);
    localStorage.setItem('finflow-user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finflow-user');
  };

  const selectCharacter = (character: Character) => {
    if (user) {
      const updatedUser = { ...user, character };
      setUser(updatedUser);
      localStorage.setItem('finflow-user', JSON.stringify(updatedUser));
      localStorage.setItem('finflow-character', character || '');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      selectCharacter,
    }}>
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
