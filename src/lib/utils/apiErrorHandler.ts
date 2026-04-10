import { NextResponse } from "next/server";
import { z } from "zod";

export function handleApiError(error: unknown, context: string = "API error") {
  console.error(`${context}:`, error);

  const err = error as any;

  // Handle database connection errors specifically
  if (
    err.message?.includes("Database connection failed") ||
    err.message?.includes("MONGODB_URI") ||
    err.message?.includes("ECONNREFUSED") ||
    err.name === "MongooseServerSelectionError"
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Database connection failed. Please ensure your environment variables are configured correctly and MongoDB is accessible.",
      },
      { status: 503 },
    );
  }

  // Handle validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation error",
        errors: error.issues,
      },
      { status: 400 },
    );
  }

  // Standard internal server error
  return NextResponse.json(
    {
      success: false,
      message: err.message || "Internal server error",
    },
    { status: 500 },
  );
}
