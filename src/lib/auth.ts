import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { IUser } from "@/models";
import { UserRole } from "@/lib/enums/roles";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export const generateToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: (user._id as { toString(): string }).toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
};

export const getTokenFromRequest = (request: NextRequest): string | null => {
  // Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Check cookies
  const token = request.cookies.get("auth-token")?.value;
  if (token) {
    return token;
  }

  return null;
};

export const createAuthCookie = (token: string): string => {
  const isProduction = process.env.NODE_ENV === "production";

  return `auth-token=${token}; Path=/; HttpOnly; SameSite=Strict; ${
    isProduction ? "Secure; " : ""
  }Max-Age=${7 * 24 * 60 * 60}`; // 7 days
};

export const createLogoutCookie = (): string => {
  const isProduction = process.env.NODE_ENV === "production";

  return `auth-token=; Path=/; HttpOnly; SameSite=Strict; ${
    isProduction ? "Secure; " : ""
  }Max-Age=0`;
};
