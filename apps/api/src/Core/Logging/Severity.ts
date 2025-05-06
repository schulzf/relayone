export const Severity = {
  default: 'DEFAULT',
  debug: 'DEBUG',
  info: 'INFO',
  notice: 'NOTICE',
  warning: 'WARNING',
  error: 'ERROR',
  critical: 'CRITICAL',
  alert: 'ALERT',
  emergency: 'EMERGENCY',
};

export type Severity = (typeof Severity)[keyof typeof Severity];
