import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// These are the log levels our simple JSON logger supports.
type LogLevel = 'debug' | 'log' | 'warn' | 'error';

// This logger writes one JSON object per log line.
// JSON logs are easier for Docker, Kubernetes, and log aggregation tools to parse.
@Injectable()
export class AppLoggerService implements LoggerService {
  constructor(private readonly configService: ConfigService) {}

  log(message: unknown, context?: string) {
    this.writeLog('log', message, context);
  }

  error(message: unknown, trace?: string, context?: string) {
    this.writeLog('error', message, context, trace);
  }

  warn(message: unknown, context?: string) {
    this.writeLog('warn', message, context);
  }

  debug(message: unknown, context?: string) {
    this.writeLog('debug', message, context);
  }

  private writeLog(
    level: LogLevel,
    message: unknown,
    context?: string,
    trace?: string,
  ) {
    const configuredLevel =
      this.configService.get<LogLevel>('LOG_LEVEL') ?? 'log';

    // Skip debug logs unless LOG_LEVEL is set to debug.
    if (level === 'debug' && configuredLevel !== 'debug') {
      return;
    }

    const logPayload = {
      timestamp: new Date().toISOString(),
      level,
      service: this.configService.get<string>('SERVICE_NAME'),
      context,
      message,
      trace,
      pid: process.pid,
    };

    // Use stderr for warnings/errors and stdout for normal logs.
    // This matches common container logging expectations.
    if (level === 'error' || level === 'warn') {
      process.stderr.write(`${JSON.stringify(logPayload)}\n`);
      return;
    }

    process.stdout.write(`${JSON.stringify(logPayload)}\n`);
  }
}
