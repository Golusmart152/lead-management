import React, { useState } from 'react';
import { createContext } from 'react';
import type { ReactNode } from 'react';

interface NotificationContextType {
    showNotification: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

// Notification display component
const NotificationDisplay: React.FC<{
    notifications: Array<{
        id: string;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>;
}> = ({ notifications }) => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
            <div
                key={notification.id}
                className={`p-4 rounded-lg shadow-lg max-w-sm ${
                    notification.severity === 'success' ? 'bg-green-500 text-white' :
                    notification.severity === 'error' ? 'bg-red-500 text-white' :
                    notification.severity === 'warning' ? 'bg-yellow-500 text-white' :
                    'bg-blue-500 text-white'
                }`}
            >
                {notification.message}
            </div>
        ))}
    </div>
);

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<Array<{
        id: string;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>>([]);

    const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        const id = Math.random().toString(36).substr(2, 9);
        const notification = { id, message, severity };
        
        setNotifications(prev => [...prev, notification]);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <NotificationDisplay notifications={notifications} />
        </NotificationContext.Provider>
    );
};