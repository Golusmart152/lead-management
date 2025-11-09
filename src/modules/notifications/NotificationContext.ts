import { createContext } from 'react';

export interface NotificationContextType {
  showNotification: (message: string, variant: 'success' | 'error' | 'default') => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);
