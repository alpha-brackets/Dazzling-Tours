import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Newsletter } from "@/models";

// GET /api/newsletter - Get all newsletter subscribers
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "Active";

    const skip = (page - 1) * limit;

    const subscribers = await Newsletter.find({ status })
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Newsletter.countDocuments({ status });

    return NextResponse.json({
      success: true,
      data: subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      if (existingSubscriber.status === "Active") {
        return NextResponse.json(
          { success: false, error: "Email already subscribed" },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        existingSubscriber.status = "Active";
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.unsubscribedAt = undefined;
        await existingSubscriber.save();

        return NextResponse.json({
          success: true,
          data: existingSubscriber,
          message: "Email reactivated successfully",
        });
      }
    }

    const subscriber = new Newsletter({ email });
    await subscriber.save();

    return NextResponse.json(
      {
        success: true,
        data: subscriber,
        message: "Successfully subscribed to newsletter",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe to newsletter" },
      { status: 500 }
    );
  }
}

// DELETE /api/newsletter - Unsubscribe from newsletter
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const subscriber = await Newsletter.findOneAndUpdate(
      { email },
      {
        status: "Unsubscribed",
        unsubscribedAt: new Date(),
      },
      { new: true }
    );

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: "Email not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    return NextResponse.json(
      { success: false, error: "Failed to unsubscribe from newsletter" },
      { status: 500 }
    );
  }
}
