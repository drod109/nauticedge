type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private static formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const data = entry.data ? ` ${JSON.stringify(entry.data)}` : '';
    return `[${timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${data}`;
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };

    if (import.meta.env.DEV) {
      const formattedMessage = Logger.formatMessage(entry);
      switch (level) {
        case 'info':
          console.log(formattedMessage);
          break;
        case 'warn':
          console.warn(formattedMessage);
          break;
        case 'error':
          console.error(formattedMessage);
          break;
      }
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }
}

export const logger = new Logger();