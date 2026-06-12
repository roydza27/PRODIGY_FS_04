import { env } from "../config/env";

export const logger = {
  log: (message: string, ...args: unknown[]) => {
    if (env.nodeEnv !== "production") {
      console.log(`[LOG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (env.nodeEnv !== "production") {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  }
};