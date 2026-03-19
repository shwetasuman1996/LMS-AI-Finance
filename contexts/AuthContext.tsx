'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/lib/mock-data';
import { getUserByEmail, updateUser } from '@/lib/mock-data';
import { getCurrentUser, setCurrentUser, clearCurrentUser } from '@/lib/auth';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const fresh = getUserByEmail(user.email);
      setCurrentUserState(fresh ?? user);
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const user = getUserByEmail(email);
    if (!user) return { success: false, error: 'Invalid email or password.' };

    if (user.isLocked) {
      return { success: false, error: 'Account is locked. Please reset your password.' };
    }

    if (user.password !== password) {
      const attempts = user.failedLoginAttempts + 1;
      const locked = attempts >= 3;
      const updated: User = { ...user, failedLoginAttempts: attempts, isLocked: locked };
      updateUser(updated);
      if (locked) return { success: false, error: 'Account locked due to too many failed attempts.' };
      return { success: false, error: `Invalid email or password. ${3 - attempts} attempt(s) remaining.` };
    }

    const updated: User = { ...user, failedLoginAttempts: 0 };
    updateUser(updated);
    setCurrentUser(updated);
    setCurrentUserState(updated);
    return { success: true };
  }

  function logout() {
    clearCurrentUser();
    setCurrentUserState(null);
  }

  async function resetPassword(email: string): Promise<{ success: boolean }> {
    const user = getUserByEmail(email);
    if (user && user.isLocked) {
      updateUser({ ...user, isLocked: false, failedLoginAttempts: 0 });
    }
    return { success: true };
  }

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
