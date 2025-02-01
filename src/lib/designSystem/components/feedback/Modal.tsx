import React from 'react';
import { cn } from '../../utils/styles';
import { X } from 'lucide-react';
import { usePreventScroll } from '../../../../hooks/usePreventScroll';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  footer,
  children,
  className,
  ...props
}) => {
  usePreventScroll(isOpen);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4 overflow-y-auto"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        className={cn(
          'bg-white dark:bg-dark-800 w-full rounded-none sm:rounded-xl shadow-xl',
          'flex flex-col max-h-[100dvh] sm:max-h-[90dvh] my-auto animate-fade-in',
          sizes[size],
          className
        )}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="sticky top-0 z-10 bg-white dark:bg-dark-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700 rounded-t-none sm:rounded-t-xl">
            {title && (
              <div>
                <h2 id="modal-title" className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h2>
                {description && (
                  <p id="modal-description" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                )}
              </div>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="sticky bottom-0 z-10 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 p-6 rounded-b-none sm:rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};