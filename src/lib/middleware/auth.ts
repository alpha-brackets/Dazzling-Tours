import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import {
  findSessionByToken,
  getTokenFromRequest,
  touchSession,
} from "@/lib/auth";
import { UserRole } from "@/lib/enums/roles";

export interface AuthenticatedUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  lastLogin?: Date;
}

export interface AuthContext {
  user: AuthenticatedUser;
  token: string;
}

/**
 * Middleware to authenticate user and verify JWT token
 * Returns user context if authentication is successful
 */
export async function authenticateUser(request: NextRequest): Promise<{
  success: boolean;
  user?: AuthenticatedUser;
  token?: string;
  error?: string;
  statusCode?: number;
}> {
  try {
    // Checked before connecting: an unauthenticated request should be rejected
    // without touching the database.
    const token = getTokenFromRequest(request);
    if (!token) {
      return {
        success: false,
        error: "Authorization token required",
        statusCode: 401,
      };
    }

    await connectDB();

    // A session exists only while it is valid: logout deletes the row and
    // expiry is filtered on lookup, so there is no separate revocation check.
    const found = await findSessionByToken(token);
    if (!found) {
      return {
        success: false,
        error: "Invalid or expired session",
        statusCode: 401,
      };
    }

    const { session, user } = found;

    // Deactivating an account takes effect on the next request.
    if (!user.isActive) {
      return {
        success: false,
        error: "Account is deactivated",
        statusCode: 401,
      };
    }

    // Slide the expiry forward so an active admin is not logged out mid-session.
    await touchSession(session);

    return {
      success: true,
      user: {
        _id: String(user._id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
      },
      token,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      error: "Authentication failed",
      statusCode: 500,
    };
  }
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(requiredRole: UserRole) {
  return (user: AuthenticatedUser): boolean => {
    return user.role === requiredRole;
  };
}

/**
 * Higher-order function to protect routes with authentication
 * Usage: export const POST = withAuth(async (request, context) => { ... })
 */
export function withAuth(
  handler: (
    request: NextRequest,
    context: AuthContext,
  ) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await authenticateUser(request);

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.statusCode || 401 },
      );
    }

    const context: AuthContext = {
      user: authResult.user!,
      token: authResult.token!,
    };

    return handler(request, context);
  };
}

/**
 * Higher-order function to protect routes with role-based authorization
 * Usage: export const POST = withRoleAuth(UserRole.SUPER_ADMIN, async (request, context) => { ... })
 */
export function withRoleAuth(
  requiredRole: UserRole,
  handler: (
    request: NextRequest,
    context: AuthContext,
  ) => Promise<NextResponse>,
) {
  return withAuth(async (request, context) => {
    if (!requireRole(requiredRole)(context.user)) {
      return NextResponse.json(
        {
          success: false,
          error: `Access denied. Required role: ${requiredRole}`,
        },
        { status: 403 },
      );
    }

    return handler(request, context);
  });
}

/**
 * Utility function to create error responses
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 400,
): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status: statusCode },
  );
}

/**
 * Utility function to create success responses
 */
export function createSuccessResponse<T = unknown>(
  data: T,
  message?: string,
  statusCode: number = 200,
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status: statusCode },
  );
}
