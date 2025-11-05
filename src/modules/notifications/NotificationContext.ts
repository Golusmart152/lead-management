
import { createContext } from 'react';

interface NotificationContextType {
    showNotification: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
