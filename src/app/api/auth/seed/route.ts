import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import { UserRole } from "@/lib/enums/roles";
import { sendEmail } from "@/lib/services/emailService";
import { genericHtmlTemplate } from "@/lib/templates/emailTemplates";
import { requireEnv } from "@/lib/env";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // 1. Security Check: Use a secret from headers to prevent unauthorized
    // seeding. requireEnv throws when SEED_SECRET is unset, so the endpoint
    // fails closed rather than comparing against undefined.
    const authHeader = req.headers.get("x-seed-secret");

    if (authHeader !== requireEnv("SEED_SECRET")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail) {
      return NextResponse.json(
        { success: false, message: "Admin email not configured (ADMIN_EMAIL)" },
        { status: 500 },
      );
    }

    // 2. Create-only: never touch an existing admin.
    // Overwriting the password here would silently invalidate the credentials
    // the admin is already using, forcing a password reset.
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message:
          "Admin user already exists. No changes made. Use forgot-password to recover access.",
        data: {
          email: existingAdmin.email,
          role: existingAdmin.role,
          emailSent: false,
        },
      });
    }

    // A password supplied via ADMIN_PASSWORD is already known to whoever set
    // it; only a generated one has to be communicated back.
    const passwordWasGenerated = !adminPassword;
    const finalAdminPassword =
      adminPassword || crypto.randomBytes(12).toString("hex");

    const adminUser = new User({
      email: adminEmail,
      password: finalAdminPassword, // Will be hashed by pre-save hook
      firstName: "Super",
      lastName: "Admin",
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      isEmailVerified: true,
    });

    await adminUser.save();

    let emailSent = false;

    // Only mail the credentials when the password was generated here, so it
    // would otherwise exist nowhere. When ADMIN_PASSWORD was supplied, sending
    // it would put a password the operator already has into an inbox in plain
    // text — and make this step depend on a working mail server for no reason.
    if (passwordWasGenerated) {
      try {
        const html = genericHtmlTemplate(
          "Admin Account Created",
          `
        <p>Hello Super Admin,</p>
        <p>Your administrative account credentials for Dazzling Tours have been created.</p>
        <p><strong>Credentials:</strong></p>
        <ul>
          <li><strong>Email:</strong> ${adminEmail}</li>
          <li><strong>Password:</strong> ${finalAdminPassword}</li>
        </ul>
        <p>Please login and change your password immediately for security reasons.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || ""}/admin/login" class="button">Login Now</a>
        `,
          { companyName: "Dazzling Tours" },
        );

        await sendEmail({
          to: adminEmail,
          subject: "Your Admin Account Credentials - Dazzling Tours",
          html: html,
        });
        emailSent = true;
      } catch (emailError) {
        console.error("Failed to send admin credentials email:", emailError);
      }
    }

    // A generated password that could not be emailed exists nowhere: say so
    // loudly, because re-seeding will not recreate it (this route is
    // create-only) and password reset needs the same broken mail server.
    const outcome = !passwordWasGenerated
      ? "Sign in with the password from ADMIN_PASSWORD, then change it and clear that variable."
      : emailSent
        ? "Credentials sent to email."
        : "WARNING: the generated password could not be emailed and is now unrecoverable. Delete this user and re-seed with ADMIN_PASSWORD set.";

    return NextResponse.json({
      success: true,
      message: `Admin user created successfully. ${outcome}`,
      data: {
        email: adminUser.email,
        role: adminUser.role,
        passwordWasGenerated,
        emailSent,
      },
    });
  } catch (error: unknown) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to manage admin user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
