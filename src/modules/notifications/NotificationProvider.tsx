
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface NotificationState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationContextType {
    showNotification: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationState>({ 
        open: false, 
        message: '', 
        severity: 'success' 
    });

    const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        setNotification({ open: true, message, severity });
    };

    const handleClose = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar 
                open={notification.open} 
                autoHideDuration={6000} 
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
