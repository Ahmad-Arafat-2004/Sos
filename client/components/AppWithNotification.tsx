import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { Notification } from './Notification';

export const AppWithNotification: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notification, closeNotification } = useNotification();

  return (
    <>
      {children}
      <Notification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
    </>
  );
};
