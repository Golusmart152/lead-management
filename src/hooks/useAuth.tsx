
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Create the custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};
