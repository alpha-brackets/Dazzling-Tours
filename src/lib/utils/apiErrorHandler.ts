import { NextResponse } from "next/server";
import { z } from "zod";

export function handleApiError(error: unknown, context: string = "API error") {
  console.error(`${context}:`, error);

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorName = error instanceof Error ? error.name : "";

  // Handle database connection errors specifically
  if (
    errorMessage.includes("Database connection failed") ||
    errorMessage.includes("MONGODB_URI") ||
    errorMessage.includes("ECONNREFUSED") ||
    errorName === "MongooseServerSelectionError"
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
      message: errorMessage || "Internal server error",
    },
    { status: 500 },
  );
}
