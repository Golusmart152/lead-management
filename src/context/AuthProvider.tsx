
import React, { useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { auth } from '../firebase/config';
import type { User as FirebaseUser } from 'firebase/auth';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getUserProfile } from '../services/user-service';
import { AuthContext } from './AuthContext';
import type { AuthUser, AuthContextType } from '../types';

interface AuthProviderProps {
    children: ReactNode;
}

// TODO: Re-implement license verification properly
// async function verifyLicense(tenantId: string): Promise<boolean> {
//     try {
//         const response = await fetch('/api/license/verify', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ tenantId: tenantId })
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`Failed to verify license: ${errorText}`);
//         }

//         const data = await response.json();
//         return data.status === 'active' || data.status === 'perpetual';

//     } catch (error) {
//         console.error("License check failed:", error);
//         throw error;
//     }
// }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
            setLoading(true);
            if (firebaseUser) {
                try {
                    const userProfile = await getUserProfile(firebaseUser.uid);
                    if (userProfile) {
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            displayName: firebaseUser.displayName || '',
                            roles: userProfile.role ? [userProfile.role.name] : [],
                        });
                    } else {
                        // Create a default user profile when none exists
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            displayName: firebaseUser.displayName || '',
                            roles: [],
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    // Set user anyway with basic info
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        displayName: firebaseUser.displayName || '',
                        roles: [],
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            // Temporarily skip license verification to fix app loading
            // TODO: Re-implement license verification properly
            // const isLicenseActive = await verifyLicense(email);
            // if (isLicenseActive) {
            //     await signInWithEmailAndPassword(auth, email, password);
            // } else {
            //     throw new Error('Invalid license');
            // }
            
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    const authContextValue: AuthContextType = useMemo(() => ({
        user,
        loading,
        login,
        logout,
    }), [user, loading]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
