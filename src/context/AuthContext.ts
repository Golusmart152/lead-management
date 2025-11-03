
import { createContext } from 'react';
import { User } from 'firebase/auth';

// Define the shape of our user object, including the custom 'role' field
export interface AuthUser extends User {
  role?: string;
}

// Define the shape of the context state
export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({ user: null, loading: true, logout: () => {} });
