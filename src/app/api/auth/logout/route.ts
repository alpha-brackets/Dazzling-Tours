import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import {
  createLogoutCookie,
  getTokenFromRequest,
  revokeSession,
  revokeUserSessions,
  findSessionByToken,
} from "@/lib/auth";

/**
 * Deletes the session server-side, so the token is dead the moment this
 * returns — not merely forgotten by the browser.
 *
 * Body: { allDevices?: boolean } — when true, every session for the user is
 * revoked, which is the "log out everywhere" action after a suspected leak.
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromRequest(request);

    if (token) {
      let allDevices = false;
      try {
        const body = await request.json();
        allDevices = body?.allDevices === true;
      } catch {
        // No body, or not JSON. Default to revoking this session only.
      }

      if (allDevices) {
        const found = await findSessionByToken(token);
        if (found) {
          await revokeUserSessions(String(found.user._id));
        }
      }

      // Revoke the caller's own session regardless. revokeUserSessions above
      // has no exceptToken, so this is a harmless no-op in that branch.
      await revokeSession(token);
    }

    // Always clear the cookie and report success: logging out must not fail,
    // even if the session was already gone or expired.
    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { headers: { "Set-Cookie": createLogoutCookie() } },
    );
  } catch (error) {
    console.error("Logout error:", error);

    // Clear the cookie even on error, so the client is not left holding a
    // token it believes is valid.
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500, headers: { "Set-Cookie": createLogoutCookie() } },
    );
  }
}
