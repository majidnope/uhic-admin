"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/apis/auth.api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  userType: 'admin' | 'staff';
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string, userType: 'admin' | 'staff') => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for cookie management
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = getCookie('access_token');
    const storedUser = getCookie('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(decodeURIComponent(storedUser)));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        deleteCookie('access_token');
        deleteCookie('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string, userType: 'admin' | 'staff') => {
    const data = await authApi.login(email, password, userType);

    setCookie('access_token', data.access_token);
    setCookie('user', encodeURIComponent(JSON.stringify(data.user)));

    setUser(data.user);
  };

  const logout = () => {
    deleteCookie('access_token');
    deleteCookie('user');
    setUser(null);
    router.push('/login');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Super admins always have all permissions
    if (user.role === 'super_admin') return true;

    // Regular admins and staff need the specific permission
    return user?.permissions?.includes(permission) || false;
  };

  const isAdmin = user?.userType === 'admin' && user?.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        hasPermission,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
