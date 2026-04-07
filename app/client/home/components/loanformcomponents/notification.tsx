// app/components/LoanForm/components/Notification.tsx
import React from 'react';
import { NotificationType } from './type';

interface NotificationProps {
  notification: NotificationType;
}

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  if (!notification.type) return null;

  return (
    <div
      className={`mb-4 p-4 rounded-lg text-sm flex items-start ${
        notification.type === 'success'
          ? 'bg-green-50 text-green-800 border border-green-200'
          : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
      }`}
    >
      {notification.type === 'success' ? (
        <svg className="w-5 h-5 mr-2 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 mr-2 flex-shrink-0 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )}
      <span>{notification.message}</span>
    </div>
  );
};