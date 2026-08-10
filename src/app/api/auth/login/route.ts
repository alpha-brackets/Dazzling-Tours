import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import { z } from "zod";
import { handleApiError } from "@/lib/utils/apiErrorHandler";
import {
  createSession,
  createSessionCookie,
  getRequestMeta,
} from "@/lib/auth";

const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
      role: "super_admin",
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Account is deactivated" },
        { status: 401 },
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Issue a server-side session. Signing in from another browser simply adds
    // another session row — it never disturbs existing ones.
    const { token, expiresAt } = await createSession(
      String(user._id),
      getRequestMeta(request),
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // The token goes back only as an httpOnly cookie, so page scripts cannot
    // read it and an XSS bug cannot exfiltrate the admin session.
    return NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
      {
        headers: { "Set-Cookie": createSessionCookie(token, expiresAt) },
      },
    );
  } catch (error) {
    return handleApiError(error, "Login error");
  }
}
