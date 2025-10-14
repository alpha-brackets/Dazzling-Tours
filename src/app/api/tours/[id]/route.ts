import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Tour } from "@/models";

// GET /api/tours/[id] - Get a single tour
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const tour = await Tour.findById(resolvedParams.id);

    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tour,
    });
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tour" },
      { status: 500 }
    );
  }
}

// PUT /api/tours/[id] - Update a tour
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const body = await request.json();
    const resolvedParams = await params;

    // Validate price if provided
    if (body.price && body.price <= 0) {
      return NextResponse.json(
        { success: false, error: "Price must be greater than 0" },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (body.rating && (body.rating < 0 || body.rating > 5)) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 0 and 5" },
        { status: 400 }
      );
    }

    const tour = await Tour.findByIdAndUpdate(resolvedParams.id, body, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tour,
      message: "Tour updated successfully",
    });
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update tour" },
      { status: 500 }
    );
  }
}

// DELETE /api/tours/[id] - Delete a tour
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const tour = await Tour.findByIdAndDelete(resolvedParams.id);

    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete tour" },
      { status: 500 }
    );
  }
}
