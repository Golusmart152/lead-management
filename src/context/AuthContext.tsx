
import { createContext } from 'react';

export interface AuthUser {
    uid: string;
    email: string | null;
    role: string;
}

export interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
