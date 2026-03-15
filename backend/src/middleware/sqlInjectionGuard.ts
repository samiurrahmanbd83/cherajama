import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

const suspiciousPattern = /('|"|;|--|\/\*|\*\/|\b(select|insert|update|delete|drop|alter|create|truncate|union|sleep|benchmark)\b)/i;

const collectStrings = (value: unknown, acc: string[] = []) => {
  if (typeof value === "string") {
    acc.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, acc));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectStrings(item, acc));
  }
  return acc;
};

// Lightweight guard to block obvious SQL injection attempts
export const sqlInjectionGuard = (req: Request, _res: Response, next: NextFunction) => {
  const values = [
    ...collectStrings(req.body),
    ...collectStrings(req.query),
    ...collectStrings(req.params)
  ];

  const hit = values.find((value) => suspiciousPattern.test(value));

  if (hit) {
    return next(new AppError("Potentially malicious input detected.", 400));
  }

  return next();
};
