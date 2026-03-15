import xss from "xss";
import type { NextFunction, Request, Response } from "express";

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return xss(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }

  return value;
};

// Sanitize input to mitigate XSS payloads
export const xssProtection = (req: Request, _res: Response, next: NextFunction) => {
  const applyValues = <T extends Record<string, any>>(target: T, value: T) => {
    if (target && typeof target === "object") {
      for (const key of Object.keys(target)) {
        delete target[key];
      }
      if (value && typeof value === "object") {
        Object.assign(target, value);
      }
      return target;
    }
    return value;
  };

  req.body = sanitizeValue(req.body);
  applyValues(req.query as Record<string, any>, sanitizeValue(req.query) as Record<string, any>);
  applyValues(req.params as Record<string, any>, sanitizeValue(req.params) as Record<string, any>);
  next();
};
