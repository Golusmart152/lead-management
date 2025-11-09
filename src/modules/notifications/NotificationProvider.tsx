import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { NotificationContext } from './NotificationContext';

interface NotificationProviderProps {
    children: ReactNode;
}

// Notification display component
const NotificationDisplay: React.FC<{
    notifications: Array<{
        id: string;
        message: string;
        variant: 'success' | 'error' | 'default';
    }>;
}> = ({ notifications }) => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
            <div
                key={notification.id}
                className={`p-4 rounded-lg shadow-lg max-w-sm ${
                    notification.variant === 'success' ? 'bg-green-500 text-white' :
                    notification.variant === 'error' ? 'bg-red-500 text-white' :
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
        variant: 'success' | 'error' | 'default';
    }>>([]);

    const showNotification = (message: string, variant: 'success' | 'error' | 'default') => {
        const id = Math.random().toString(36).substr(2, 9);
        const notification = { id, message, variant };
        
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