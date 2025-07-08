type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  userId?: string;
  requestId?: string;
}

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';

  private formatLog(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      requestId: (context?.requestId as string) || this.generateRequestId(),
      userId: context?.userId as string,
    };
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isProduction) return true;
    
    const logLevels = ['error', 'warn', 'info', 'debug'];
    const currentLevel = process.env.LOG_LEVEL || 'info';
    const currentLevelIndex = logLevels.indexOf(currentLevel);
    const messageLevelIndex = logLevels.indexOf(level);
    
    return messageLevelIndex <= currentLevelIndex;
  }

  private writeLog(logEntry: LogEntry): void {
    if (!this.shouldLog(logEntry.level)) return;

    if (this.isProduction) {
      // In production, structure logs for external logging services
      console.log(JSON.stringify(logEntry));
    } else {
      // In development, format for readability
      const { timestamp, level, message, context } = logEntry;
      const contextStr = context ? ` ${JSON.stringify(context)}` : '';
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`);
    }
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.writeLog(this.formatLog('error', message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.writeLog(this.formatLog('warn', message, context));
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.writeLog(this.formatLog('info', message, context));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.writeLog(this.formatLog('debug', message, context));
  }

  // Security-specific logging methods
  securityAlert(message: string, context?: Record<string, unknown>): void {
    this.error(`[SECURITY] ${message}`, {
      ...context,
      alert: true,
      severity: 'critical'
    });
  }

  authFailure(message: string, context?: Record<string, unknown>): void {
    this.warn(`[AUTH] ${message}`, {
      ...context,
      category: 'authentication'
    });
  }

  apiRequest(method: string, path: string, statusCode: number, duration: number, context?: Record<string, unknown>): void {
    this.info(`API ${method} ${path} - ${statusCode} (${duration}ms)`, {
      ...context,
      method,
      path,
      statusCode,
      duration,
      category: 'api'
    });
  }
}

export const logger = new Logger();

// Sanitize sensitive data from logs
export function sanitizeForLog(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth', 'authorization'];
  const sanitized = { ...obj } as Record<string, unknown>;
  
  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}