import { env } from "../config/env";

// Minimal log-level filtering using console under the hood
const levels = ["error", "warn", "info", "debug"] as const;
type LogLevel = (typeof levels)[number];

const getLevelIndex = (level: LogLevel) => levels.indexOf(level);
const configuredLevel = (env.LOG_LEVEL as LogLevel) ?? "info";
const configuredIndex = getLevelIndex(configuredLevel);

const shouldLog = (level: LogLevel) => getLevelIndex(level) <= configuredIndex;

export const logger = {
  error: (...args: unknown[]) => {
    if (shouldLog("error")) console.error(...args);
  },
  warn: (...args: unknown[]) => {
    if (shouldLog("warn")) console.warn(...args);
  },
  info: (...args: unknown[]) => {
    if (shouldLog("info")) console.log(...args);
  },
  debug: (...args: unknown[]) => {
    if (shouldLog("debug")) console.debug(...args);
  }
};
