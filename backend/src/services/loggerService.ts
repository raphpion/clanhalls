import path from 'path';

import { inject, injectable } from 'tsyringe';
import winston, { type Logger } from 'winston';

import type ConfigService from '../config';

const APP_LOGGER_NAME = 'App';

export type LogLevel = 'info' | 'warn' | 'error';

export interface ILoggerService {
  log(level: LogLevel, message: string): void;
  logService(level: LogLevel, service: string, message: string): void;
}

@injectable()
class LoggerService implements ILoggerService {
  private readonly loggers: Map<string, Logger> = new Map<string, Logger>();

  public constructor(
    @inject('ConfigService') private readonly configService: ConfigService,
  ) {}

  private createLogger(name: string) {
    const logDir = path.join(__dirname, '../logs'); // Adjust path as needed
    const logFile = path.join(logDir, `${name}.log`);

    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${name}] ${level}: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.File({ filename: logFile }),
        ...(name === APP_LOGGER_NAME ||
        this.configService.get((config) => config.env) !== 'production'
          ? [new winston.transports.Console()]
          : []),
      ],
    });
  }

  private getLogger(name: string) {
    if (!this.loggers.has(name)) {
      this.loggers.set(name, this.createLogger(name));
    }
    return this.loggers.get(name)!;
  }

  public log(level: LogLevel, message: string) {
    this.getLogger(APP_LOGGER_NAME).log(level, message);
  }

  public logService(level: LogLevel, service: string, message: string) {
    this.getLogger(service).log(level, message);
  }
}

export default LoggerService;
