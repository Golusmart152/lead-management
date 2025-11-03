
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthUser } from './AuthContext';
import type { IdTokenResult } from 'firebase/auth';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);
    const mockUser: AuthUser = {
      uid: 'mock-uid',
      email: 'mock@example.com',
      displayName: 'Mock User',
      photoURL: 'https://example.com/mock-photo.jpg',
      emailVerified: true,
      isAnonymous: false,
      providerData: [],
      metadata: {},
      refreshToken: 'mock-refresh-token',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => 'mock-id-token',
      getIdTokenResult: async () => ({
        token: 'mock-id-token',
        expirationTime: '',
        authTime: '',
        issuedAtTime: '',
        signInProvider: null,
        signInSecondFactor: null,
        claims: {},
      } as IdTokenResult),
      reload: async () => {},
      toJSON: () => ({}),
      role: 'Super Admin',
      providerId: "",
      phoneNumber: null,
    };
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
