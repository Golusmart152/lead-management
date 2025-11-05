
import React, { useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { auth } from '../firebase/config';
import type { User as FirebaseUser } from 'firebase/auth';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getUserProfile } from '../services/user-service';
import { AuthContext } from './AuthContext';
import type { AuthUser, AuthContextType, Role } from '../types';

interface AuthProviderProps {
    children: ReactNode;
}

const defaultRole: Role = { id: 'user', name: 'User' };

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
            setLoading(true);
            if (firebaseUser) {
                try {
                    const userProfile = await getUserProfile(firebaseUser.uid);
                    setUser({ ...firebaseUser, role: userProfile.role || defaultRole });
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    setUser({ ...firebaseUser, role: defaultRole });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
    const logOut = () => signOut(auth);

    const authContextValue: AuthContextType = useMemo(() => ({
        user,
        loading,
        signIn,
        signOut: logOut,
    }), [user, loading]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
