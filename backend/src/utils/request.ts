import { AppError } from "./AppError";

export const getParam = (
  params: Record<string, string | string[] | undefined>,
  key: string
): string => {
  const value = params[key];
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  if (typeof value === "string") {
    return value;
  }
  throw new AppError(`Missing route param: ${key}`, 400);
};
