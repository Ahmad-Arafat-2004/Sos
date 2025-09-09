import React, { createContext, useContext, useState } from 'react';

interface NotificationContextType {
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  notification: {
    isOpen: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  };
  closeNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState({
    isOpen: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({
      isOpen: true,
      message,
      type
    });

    // إغلاق تلقائي بعد 3 ثواني
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isOpen: false }));
    }, 3000);
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, notification, closeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
