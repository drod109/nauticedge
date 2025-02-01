import React from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  title: string;
  message: string;
  duration?: number;
  type?: NotificationType;
}

class NotificationService {
  private container: HTMLDivElement | null = null;

  private createContainer() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.className = 'fixed inset-0 z-[100] pointer-events-none';
    document.body.appendChild(this.container);
  }

  private createNotification(options: NotificationOptions) {
    this.createContainer();

    const notification = document.createElement('div');
    notification.className = `
      fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in
      bg-black/60 backdrop-blur-sm
    `;
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease-in-out';

    // Enable pointer events for the modal
    notification.style.pointerEvents = 'auto';

    const modalHtml = `
      <div class="
        max-w-md w-full bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200/50 dark:border-dark-700/50
        transform transition-all duration-300 scale-95 opacity-0
      ">
        <div class="p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              ${this.getIcon(options.type || 'info')}
            </div>
            <div class="ml-3 w-0 flex-1">
              <p class="text-base font-medium text-gray-900 dark:text-white">
                ${options.title}
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                ${options.message}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button class="
                bg-transparent rounded-md inline-flex text-gray-400 dark:text-gray-500 
                hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none 
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-1.5
                transition-colors duration-200
              ">
                <span class="sr-only">Close</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    notification.innerHTML = modalHtml;

    // Add click handler to close button
    const closeButton = notification.querySelector('button');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.removeNotification(notification));
    }

    // Add click handler to backdrop
    notification.addEventListener('click', (e) => {
      if (e.target === notification) {
        this.removeNotification(notification);
      }
    });

    this.container?.appendChild(notification);

    // Trigger animations
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      const modal = notification.querySelector('div:first-child > div');
      if (modal) {
        modal.classList.remove('scale-95', 'opacity-0');
        modal.classList.add('scale-100', 'opacity-100');
      }
    });

    // Auto remove after duration
    if (options.duration !== 0) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, options.duration || 3000);
    }
  }

  private removeNotification(notification: HTMLDivElement) {
    const modal = notification.querySelector('div:first-child > div');
    
    // Fade out animations
    notification.style.opacity = '0';
    if (modal) {
      modal.classList.remove('scale-100', 'opacity-100');
      modal.classList.add('scale-95', 'opacity-0');
    }

    // Remove after animation
    setTimeout(() => {
      notification.remove();
      
      // Clean up container if empty
      if (this.container && !this.container.hasChildNodes()) {
        this.container.remove();
        this.container = null;
      }
    }, 300);
  }

  private getIcon(type: NotificationType): string {
    const baseClass = 'h-6 w-6';
    const colors = {
      success: 'text-green-600 dark:text-green-400',
      error: 'text-red-600 dark:text-red-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      info: 'text-blue-600 dark:text-blue-400'
    };

    const bgColors = {
      success: 'bg-green-100 dark:bg-green-900/20',
      error: 'bg-red-100 dark:bg-red-900/20',
      warning: 'bg-yellow-100 dark:bg-yellow-900/20',
      info: 'bg-blue-100 dark:bg-blue-900/20'
    };

    return `
      <div class="h-8 w-8 ${bgColors[type]} rounded-lg flex items-center justify-center">
        ${this.getIconSvg(type, `${baseClass} ${colors[type]}`)}
      </div>
    `;
  }

  private getIconSvg(type: NotificationType, className: string): string {
    switch (type) {
      case 'success':
        return `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>`;
      case 'error':
        return `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>`;
      case 'warning':
        return `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>`;
      default:
        return `<svg class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`;
    }
  }

  success(options: Omit<NotificationOptions, 'type'>) {
    this.createNotification({ ...options, type: 'success' });
  }

  error(options: Omit<NotificationOptions, 'type'>) {
    this.createNotification({ ...options, type: 'error' });
  }

  warning(options: Omit<NotificationOptions, 'type'>) {
    this.createNotification({ ...options, type: 'warning' });
  }

  info(options: Omit<NotificationOptions, 'type'>) {
    this.createNotification({ ...options, type: 'info' });
  }
}

export const notificationService = new NotificationService();