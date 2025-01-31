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
    this.container.className = 'fixed top-4 right-4 z-50 space-y-4';
    document.body.appendChild(this.container);
  }

  private createNotification(options: NotificationOptions) {
    this.createContainer();

    const notification = document.createElement('div');
    notification.className = `
      max-w-sm w-full bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200/50 dark:border-dark-700/50
      transform transition-all duration-500 hover:scale-105
      animate-fade-in-up
    `;

    const innerHtml = `
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            ${this.getIcon(options.type || 'info')}
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              ${options.title}
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              ${options.message}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button class="bg-white dark:bg-dark-800 rounded-md inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none">
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    notification.innerHTML = innerHtml;

    // Add click handler to close button
    const closeButton = notification.querySelector('button');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.removeNotification(notification));
    }

    this.container?.appendChild(notification);

    // Auto remove after duration
    setTimeout(() => {
      this.removeNotification(notification);
    }, options.duration || 5000);
  }

  private removeNotification(notification: HTMLDivElement) {
    notification.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }

  private getIcon(type: NotificationType): string {
    const baseClass = 'h-6 w-6';
    switch (type) {
      case 'success':
        return `<div class="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
          <svg class="${baseClass} text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>`;
      case 'error':
        return `<div class="h-8 w-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
          <svg class="${baseClass} text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>`;
      case 'warning':
        return `<div class="h-8 w-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
          <svg class="${baseClass} text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>`;
      default:
        return `<div class="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
          <svg class="${baseClass} text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>`;
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