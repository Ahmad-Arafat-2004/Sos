import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface NotificationProps {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  isOpen,
  message,
  type,
  onClose
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'info':
      default:
        return <Info className="w-6 h-6 text-olive-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
      case 'error':
        return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
      case 'info':
      default:
        return 'bg-gradient-to-br from-olive-50 to-olive-100 border-olive-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'info':
      default:
        return 'text-olive-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className={`${getBgColor()} border rounded-lg shadow-soft-lg p-4 max-w-sm w-full`}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1">
            <p className={`${getTextColor()} font-arabic text-sm leading-relaxed`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
