import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Tour } from "@/models";
import { MongoQuery } from "@/lib/types";

// GET /api/tours - Get all tours
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const query: MongoQuery = {};

    // Apply status filter: if provided, use it; otherwise default to Active for public listing
    if (status && status !== "all") {
      query.status = status;
    } else {
      query.status = "Active";
    }

    if (category) query.category = category;
    if (featured === "true") query.featured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const tours = await Tour.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Tour.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: tours,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}

// POST /api/tours - Create a new tour
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "shortDescription",
      "price",
      "duration",
      "location",
      "category",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate price is positive
    if (body.price <= 0) {
      return NextResponse.json(
        { success: false, error: "Price must be greater than 0" },
        { status: 400 }
      );
    }

    // Validate rating is between 0 and 5
    if (body.rating && (body.rating < 0 || body.rating > 5)) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 0 and 5" },
        { status: 400 }
      );
    }

    const tour = new Tour(body);
    await tour.save();

    return NextResponse.json(
      {
        success: true,
        data: tour,
        message: "Tour created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tour:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create tour" },
      { status: 500 }
    );
  }
}

// PUT /api/tours - Update multiple tours (bulk operations)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, tourIds, data } = body;

    if (!action || !tourIds || !Array.isArray(tourIds)) {
      return NextResponse.json(
        { success: false, error: "Action and tourIds are required" },
        { status: 400 }
      );
    }

    let result;
    switch (action) {
      case "updateStatus":
        result = await Tour.updateMany(
          { _id: { $in: tourIds } },
          { status: data.status }
        );
        break;
      case "updateFeatured":
        result = await Tour.updateMany(
          { _id: { $in: tourIds } },
          { featured: data.featured }
        );
        break;
      case "delete":
        result = await Tour.deleteMany({ _id: { $in: tourIds } });
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Tours ${action} completed successfully`,
    });
  } catch (error) {
    console.error("Error updating tours:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update tours" },
      { status: 500 }
    );
  }
}
