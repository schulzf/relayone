import {HttpRequest, Logging} from '@google-cloud/logging';
import {Injectable} from '@nestjs/common';
import {LogName} from './LogName';
import {Severity} from './Severity';

export interface LogOptions {
  name?: LogName;
  httpRequest?: HttpRequest | Request;
  severity?: Severity;
}

@Injectable()
export class LoggingService {
  private logger: Logging;

  getLogger() {
    if (process.env.ENV !== 'dev' && !this.logger && process.env.GCP_LOGS_KEY_FILE) {
      if (process.env.GCP_LOGS_KEY_FILE && process.env.GCP_LOGS_PROJECT_ID) {
        // For apps running outside of GCP
        this.logger = new Logging({
          projectId: process.env.GCP_LOGS_PROJECT_ID,
          credentials: JSON.parse(process.env.GCP_LOGS_KEY_FILE),
        });
      } else {
        // For apps running on GCP
        this.logger = new Logging();
      }
    }

    return this.logger;
  }

  private logEntry = (message: any, options?: LogOptions) => {
    const stackLines = new Error().stack?.split('\n').slice(3);
    const stack = stackLines?.join('\n');

    try {
      if (process.env.ENV === 'dev' || !process.env.GCP_LOGS_KEY_FILE || process.env.APP_MODE === 'LOCAL') {
        return console.log(
          JSON.stringify(
            {
              bundle: process.env.BUNDLE,
              timestamp: new Date().toISOString(),
              logName: options?.name ?? LogName.server,
              severity: options?.severity ?? Severity.info,
              msg: message,
              stack: options?.severity === Severity.error ? stackLines : undefined,
            },
            null,
            process.env.DEV_LOG_PRETTY ? 2 : 0,
          ),
        );
      }

      const namespace = this.getLogger().log(options?.name ?? LogName.server);
      const entry = namespace.entry(
        {
          severity: options?.severity ?? Severity.info,
          httpRequest: options?.httpRequest as HttpRequest,
          labels: { service: process.env.BUNDLE, name: options?.name ?? LogName.server },
        },
        message,
      );

      void namespace.write(entry);
    } catch (err) {
      console.log(`logger error`, err);
      console.log(`Logger fallbacked to stdout - [${options?.name ?? LogName.server}] - ${options?.severity ?? Severity.info} -`, message);
      console.log(`Stack trace:`, stack);
    }
  };

  public default = (message: any, options?: LogOptions) => this.logEntry(message, { ...options, severity: Severity.default });
  public debug = (message: any, options?: LogOptions) => this.logEntry(message, { ...options, severity: Severity.debug });
  public info = (message: any, options?: LogOptions) => this.logEntry(message, { ...options, severity: Severity.info });
  public log = (message: any, options?: LogOptions) => this.logEntry(message, { ...options, severity: Severity.info });
  public notice = (message: any, options?: LogOptions) => this.logEntry(message, { ...options, severity: Severity.notice });
  public warn = (message: any, options?: LogOptions) => this.logEntry(message, { ...options, severity: Severity.warning });
  public error = (message: any, options?: LogOptions) => this.logEntry(message, { ...options, severity: Severity.error });
  public critical = (message: any, options?: LogOptions) => this.logEntry(message, { ...options, severity: Severity.critical });
  public alert = (message: any, options?: LogOptions) => this.logEntry(message, { ...options, severity: Severity.alert });
  public emergency = (message: any, options?: LogOptions) => this.logEntry(message, { ...options, severity: Severity.emergency });

  /**
   * Logs an error with full details and throws it
   * @param message The error message to throw
   * @param error The original error object (optional)
   * @param options Additional logging options
   * @throws Error with the provided message
   */
  public throwError(message: string, error?: Error | unknown, options?: LogOptions): never {
    const errorDetails = {
      message,
      originalError:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message
                ?.split('\n')
                .filter((line) => line.trim())
                .map((line) => line.trim()),
            }
          : error,
    };

    this.error(errorDetails, options);

    throw new Error(message.replace(/\\n/g, '\n'));
  }
}
