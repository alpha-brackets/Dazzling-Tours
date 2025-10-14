import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";

export async function POST() {
  try {
    await connectDB();

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      email: "admin@dazzlingtours.com",
      role: "super_admin",
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: "Admin user already exists",
      });
    }

    // Create admin user
    const adminUser = await User.create({
      email: "admin@dazzlingtours.com",
      password: "admin123", // This will be hashed by the pre-save middleware
      firstName: "Admin",
      lastName: "User",
      role: "super_admin",
      isActive: true,
      isEmailVerified: true,
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      data: {
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create admin user" },
      { status: 500 }
    );
  }
}
