import React from 'react';
import { cn } from '../../lib/utils/styles';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  icon?: boolean;
  closeable?: boolean;
  onClose?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({
  variant = 'info',
  title,
  icon = true,
  closeable = false,
  onClose,
  className,
  children,
  ...props
}, ref) => {
  const variants = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: Info
    },
    success: {
      bg: 'bg-success-50 dark:bg-success-900/20',
      border: 'border-success-200 dark:border-success-800',
      text: 'text-success-800 dark:text-success-200',
      icon: CheckCircle
    },
    warning: {
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      border: 'border-warning-200 dark:border-warning-800',
      text: 'text-warning-800 dark:text-warning-200',
      icon: AlertTriangle
    },
    error: {
      bg: 'bg-error-50 dark:bg-error-900/20',
      border: 'border-error-200 dark:border-error-800',
      text: 'text-error-800 dark:text-error-200',
      icon: AlertCircle
    }
  };

  const variantStyle = variants[variant];
  const Icon = variantStyle.icon;

  return (
    <div
      ref={ref}
      className={cn(
        'p-4 rounded-lg border',
        variantStyle.bg,
        variantStyle.border,
        className
      )}
      {...props}
    >
      <div className="flex">
        {icon && (
          <div className="flex-shrink-0">
            <Icon className={cn('h-5 w-5', variantStyle.text)} />
          </div>
        )}
        <div className={cn('flex-1', icon && 'ml-3')}>
          {title && (
            <h3 className={cn('text-sm font-medium', variantStyle.text)}>
              {title}
            </h3>
          )}
          <div className={cn('text-sm', variantStyle.text, title && 'mt-2')}>
            {children}
          </div>
        </div>
        {closeable && (
          <button
            type="button"
            className={cn(
              'ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5',
              variantStyle.text,
              'hover:bg-opacity-10 focus:ring-2 focus:ring-offset-2',
              `focus:ring-${variant}-500 dark:focus:ring-${variant}-400`
            )}
            onClick={onClose}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
});