import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthPayload } from '../types/user';

interface AuthContextProps {
  isAuth: boolean;
  userId: string;
  userRole: string;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  isAuth: false,
  userId: '',
  userRole: '',
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

function decodeJWT(token: string): AuthPayload | null {
  try {
    const payload = token.split('.')[1];
    const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=');
    const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const payload = decodeJWT(token);
        if (payload && payload.exp * 1000 > Date.now()) {
          setIsAuth(true);
          setUserId(payload.id);
          setUserRole(payload.role ?? 'user');
        } else {
          await AsyncStorage.removeItem('access_token');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (token: string) => {
    await AsyncStorage.setItem('access_token', token);
    const payload = decodeJWT(token);
    if (payload) {
      setIsAuth(true);
      setUserId(payload.id);
      setUserRole(payload.role ?? 'user');
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('access_token');
    setIsAuth(false);
    setUserId('');
    setUserRole('');
  };

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return (
    <AuthContext.Provider value={{ isAuth, userId, userRole, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
