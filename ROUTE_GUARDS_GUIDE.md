# Route Guards Implementation Guide

This guide explains how to implement authentication and authorization guards for API routes in the Dazzling Tours application.

## Overview

The route guard system provides:

- **Authentication**: Verifies JWT tokens and user sessions
- **Authorization**: Checks user roles and permissions
- **Public Access**: Allows certain operations (like GET) to remain public
- **Admin Protection**: Restricts create, update, delete operations to super_admin users

## Role System

### Role Enum (`src/lib/enums/roles.ts`)

The application uses a type-safe role system:

```typescript
export enum UserRole {
  SUPER_ADMIN = "super_admin",
}

export enum Permission {
  READ = "read",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}
```

### Role-Based Permissions

```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    Permission.READ,
    Permission.CREATE,
    Permission.UPDATE,
    Permission.DELETE,
  ],
};
```

## Middleware Components

### 1. Authentication Middleware (`src/lib/middleware/auth.ts`)

The middleware provides several utility functions:

- `authenticateUser()` - Verifies JWT tokens and returns user context
- `withAuth()` - Higher-order function for basic authentication
- `withRoleAuth()` - Higher-order function for role-based authorization
- `createErrorResponse()` - Utility for consistent error responses
- `createSuccessResponse()` - Utility for consistent success responses

### 2. Usage Patterns

#### Public Routes (No Authentication Required)

```typescript
// GET operations remain public
export async function GET(request: NextRequest) {
  // Public access - no authentication required
}
```

#### Protected Routes (Authentication Required)

```typescript
import {
  withRoleAuth,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/middleware/auth";
import { UserRole } from "@/lib/enums/roles";

// POST operations require super_admin role
export const POST = withRoleAuth(UserRole.SUPER_ADMIN, async (request) => {
  // Your route logic here
  // User is automatically authenticated and authorized
});
```

#### Routes with User Context

```typescript
export const POST = withRoleAuth(
  UserRole.SUPER_ADMIN,
  async (request, context) => {
    // Access authenticated user information
    const { user } = context;
    console.log(`User ${user.email} is creating a resource`);

    // Your route logic here
  }
);
```

## Implementation Examples

### Example 1: Testimonials Route (Already Implemented)

**File**: `src/app/api/testimonials/route.ts`

```typescript
import {
  withRoleAuth,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/middleware/auth";
import { UserRole } from "@/lib/enums/roles";

// GET remains public
export async function GET(request: NextRequest) {
  // Public access for reading testimonials
}

// POST requires super_admin authentication
export const POST = withRoleAuth(UserRole.SUPER_ADMIN, async (request) => {
  // Only super_admin can create testimonials
});

// PUT requires super_admin authentication
export const PUT = withRoleAuth(UserRole.SUPER_ADMIN, async (request) => {
  // Only super_admin can update/delete testimonials
});
```

### Example 2: Tours Route (Needs Implementation)

**File**: `src/app/api/tours/route.ts`

```typescript
import {
  withRoleAuth,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/middleware/auth";
import { UserRole } from "@/lib/enums/roles";

// GET remains public
export async function GET(request: NextRequest) {
  // Public access for browsing tours
}

// POST requires super_admin authentication
export const POST = withRoleAuth(UserRole.SUPER_ADMIN, async (request) => {
  try {
    await connectDB();
    const body = await request.json();

    // Validation logic
    const requiredFields = ["title", "description", "price", "duration"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return createErrorResponse(`${field} is required`, 400);
      }
    }

    const tour = new Tour(body);
    await tour.save();

    return createSuccessResponse(tour, "Tour created successfully", 201);
  } catch (error) {
    console.error("Error creating tour:", error);
    return createErrorResponse("Failed to create tour", 500);
  }
});

// PUT requires super_admin authentication
export const PUT = withRoleAuth(UserRole.SUPER_ADMIN, async (request) => {
  // Bulk operations for tours
});
```

### Example 3: Blogs Route (Needs Implementation)

**File**: `src/app/api/blogs/route.ts`

```typescript
import {
  withRoleAuth,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/middleware/auth";

// GET remains public
export async function GET(request: NextRequest) {
  // Public access for reading blogs
}

// POST requires super_admin authentication
export const POST = withRoleAuth("super_admin", async (request) => {
  try {
    await connectDB();
    const body = await request.json();

    const blog = new Blog(body);
    await blog.save();

    return createSuccessResponse(blog, "Blog created successfully", 201);
  } catch (error) {
    console.error("Error creating blog:", error);
    return createErrorResponse("Failed to create blog", 500);
  }
});

// PUT requires super_admin authentication
export const PUT = withRoleAuth("super_admin", async (request) => {
  // Bulk operations for blogs
});
```

### Example 4: Individual Resource Routes

**File**: `src/app/api/tours/[id]/route.ts`

```typescript
import {
  withRoleAuth,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/middleware/auth";

// GET remains public
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Public access for individual tour details
}

// PUT requires super_admin authentication
export const PUT = withRoleAuth(
  "super_admin",
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      await connectDB();
      const body = await request.json();
      const resolvedParams = await params;

      const tour = await Tour.findByIdAndUpdate(resolvedParams.id, body, {
        new: true,
        runValidators: true,
      });

      if (!tour) {
        return createErrorResponse("Tour not found", 404);
      }

      return createSuccessResponse(tour, "Tour updated successfully");
    } catch (error) {
      console.error("Error updating tour:", error);
      return createErrorResponse("Failed to update tour", 500);
    }
  }
);

// DELETE requires super_admin authentication
export const DELETE = withRoleAuth(
  "super_admin",
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      await connectDB();
      const resolvedParams = await params;

      const tour = await Tour.findByIdAndDelete(resolvedParams.id);

      if (!tour) {
        return createErrorResponse("Tour not found", 404);
      }

      return createSuccessResponse(null, "Tour deleted successfully");
    } catch (error) {
      console.error("Error deleting tour:", error);
      return createErrorResponse("Failed to delete tour", 500);
    }
  }
);
```

## Routes That Need Protection

Based on the codebase analysis, the following routes need authentication guards:

### Collection Routes (POST, PUT operations)

- `src/app/api/tours/route.ts` - POST, PUT
- `src/app/api/blogs/route.ts` - POST, PUT
- `src/app/api/contact/route.ts` - PUT (POST can remain public for contact forms)
- `src/app/api/comments/route.ts` - PUT (POST can remain public for comments)

### Individual Resource Routes (PUT, DELETE operations)

- `src/app/api/tours/[id]/route.ts` - PUT, DELETE
- `src/app/api/blogs/[id]/route.ts` - PUT, DELETE
- `src/app/api/contact/[id]/route.ts` - PUT
- `src/app/api/comments/[id]/route.ts` - PUT

### Already Protected Routes

- `src/app/api/testimonials/route.ts` - ✅ Implemented
- `src/app/api/testimonials/[id]/route.ts` - ✅ Implemented

## Error Responses

The middleware provides consistent error responses:

```typescript
// 401 Unauthorized
{ success: false, error: "Authorization token required" }
{ success: false, error: "Invalid or expired token" }
{ success: false, error: "Account is deactivated" }

// 403 Forbidden
{ success: false, error: "Access denied. Required role: super_admin" }

// 404 Not Found
{ success: false, error: "User not found" }
```

## Success Responses

The middleware provides consistent success responses:

```typescript
// 200 OK
{ success: true, data: {...}, message: "Operation completed successfully" }

// 201 Created
{ success: true, data: {...}, message: "Resource created successfully" }
```

## Testing the Implementation

To test the route guards:

1. **Test Public Access**: GET requests should work without authentication
2. **Test Protected Access**: POST/PUT/DELETE requests should require valid JWT token
3. **Test Role Authorization**: Only users with `super_admin` role should access protected routes
4. **Test Error Handling**: Invalid tokens should return appropriate error messages

## Frontend Integration

The frontend should include the JWT token in requests:

```typescript
// Include token in headers
const response = await fetch("/api/testimonials", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});
```

## Security Benefits

1. **Authentication**: Ensures only logged-in users can perform sensitive operations
2. **Authorization**: Restricts operations to users with appropriate roles
3. **Public Access**: Maintains public access for reading content
4. **Consistent Errors**: Provides uniform error responses across all routes
5. **Token Validation**: Validates JWT tokens and checks for token expiration
6. **Password Security**: Ensures users re-authenticate after password changes
