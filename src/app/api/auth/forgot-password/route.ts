import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, OTP } from "@/models";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
      role: "super_admin",
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: "If the email exists, a password reset OTP has been sent",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Account is deactivated" },
        { status: 401 }
      );
    }

    // Generate OTP for password reset
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing password reset OTPs for this email
    await OTP.deleteMany({
      email: user.email,
      type: "password_reset",
    });

    // Save new OTP
    await OTP.create({
      email: user.email,
      otp: otpCode,
      type: "password_reset",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    // TODO: Send OTP via email
    console.log(`Password reset OTP for ${user.email}: ${otpCode}`);

    return NextResponse.json({
      success: true,
      message: "If the email exists, a password reset OTP has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
