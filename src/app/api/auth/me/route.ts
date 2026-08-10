import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth";

/**
 * Returns the signed-in admin. Session validation, expiry, and the
 * account-deactivated check all live in withAuth, so there is no duplicated
 * token handling here.
 */
export const GET = withAuth(async (_request, { user }) => {
  return NextResponse.json({
    success: true,
    data: { user },
  });
});
