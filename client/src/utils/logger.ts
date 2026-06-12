/**
 * Production-ready logger that automatically suppresses non-essential output in production.
 * In development, it uses console.debug for chatty logs to keep the main console clean.
 */
export const logger = {
  log: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.debug(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.info(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // We always log errors to the console in all environments for easier troubleshooting
    console.error(...args);
  },
  debug: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.debug(...args);
    }
  }
};
