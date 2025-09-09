import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  isDestructive?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText,
  cancelText,
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-white to-olive-50 border border-olive-200 rounded-lg shadow-soft-lg max-w-md w-full mx-4 p-6 animate-fade-in">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-olive-400 hover:text-olive-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center space-y-4">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-olive-100 to-olive-200 rounded-full flex items-center justify-center">
            {isDestructive ? (
              <Trash2 className="w-8 h-8 text-olive-600" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-olive-600" />
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-olive-800 font-arabic">
            {title}
          </h3>

          {/* Description */}
          <p className="text-olive-600 text-base leading-relaxed font-arabic">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-olive-300 text-olive-700 bg-white hover:bg-olive-50 hover:border-olive-400 rounded-md transition-all duration-200 font-arabic"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-md font-arabic transition-all duration-200 ${
                isDestructive
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-olive-600 to-olive-700 hover:from-olive-700 hover:to-olive-800 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
