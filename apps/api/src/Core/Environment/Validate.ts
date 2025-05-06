import {config} from 'dotenv';
import {LoggingService} from '../Logging';
import {LogName} from '../Logging/LogName';
import {schema} from './Schema';

export const validate = (vars: Record<string, unknown>) => {
  config();

  const log = new LoggingService();
  const env = schema.safeParse(vars);

  if (!env.success) {
    log.error({ message: 'Invalid environment variables', issues: env.error.errors }, { name: LogName.server });
    return process.env;
  }

  log.info('environment variables parsed and validated', { name: LogName.server });

  return env.data;
};
