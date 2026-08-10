import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, IUser } from "@/models";
import { z } from "zod";
import { withAuth } from "@/lib/middleware/auth";
import { revokeUserSessions } from "@/lib/auth";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const POST = withAuth(async (request, context) => {
  try {
    await connectDB();

    const body = await request.json();
    const { currentPassword, newPassword } = changePasswordSchema.parse(body);

    const user = await User.findById(context.user._id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Verify current password
    const isMatch = await (user as unknown as IUser).comparePassword(
      currentPassword,
    );
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 },
      );
    }

    // Check if new password is different from current password
    const isSamePassword = await (user as unknown as IUser).comparePassword(
      newPassword,
    );
    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be different from current password",
        },
        { status: 400 },
      );
    }

    // Update password. The pre-save hook hashes it.
    user.password = newPassword;
    await user.save();

    // Changing a password should boot every other device, in case one of them
    // is an attacker. The caller's own session survives, so they stay logged in.
    const revoked = await revokeUserSessions(
      String(user._id),
      context.token,
    );

    return NextResponse.json({
      success: true,
      message:
        revoked > 0
          ? `Password changed successfully. ${revoked} other session(s) signed out.`
          : "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
});
