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

    const query: MongoQuery = { status: "Active" };

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
