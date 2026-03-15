import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: "admin" | "staff" | "customer";
};

// Sign a JWT for authenticated users
export const signToken = (payload: AuthTokenPayload) => {
  return jwt.sign(payload, env.JWT_SECRET as jwt.Secret, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });
};

// Verify and decode a JWT
export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
};
