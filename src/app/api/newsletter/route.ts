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

// PUT /api/newsletter - Update newsletter subscription
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, email, status } = body;

    if (!action || !email) {
      return NextResponse.json(
        { success: false, error: "Action and email are required" },
        { status: 400 }
      );
    }

    let result;
    switch (action) {
      case "unsubscribe":
        result = await Newsletter.findOneAndUpdate(
          { email },
          {
            status: "Unsubscribed",
            unsubscribedAt: new Date(),
          },
          { new: true }
        );
        break;
      case "reactivate":
        result = await Newsletter.findOneAndUpdate(
          { email },
          {
            status: "Active",
            subscribedAt: new Date(),
            unsubscribedAt: undefined,
          },
          { new: true }
        );
        break;
      case "updateStatus":
        if (!status) {
          return NextResponse.json(
            { success: false, error: "Status is required" },
            { status: 400 }
          );
        }
        const updateData: {
          status: string;
          unsubscribedAt?: Date;
          subscribedAt?: Date;
        } = { status };
        if (status === "Unsubscribed") {
          updateData.unsubscribedAt = new Date();
        } else if (status === "Active") {
          updateData.subscribedAt = new Date();
          updateData.unsubscribedAt = undefined;
        }
        result = await Newsletter.findOneAndUpdate({ email }, updateData, {
          new: true,
        });
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Email not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Newsletter ${action} completed successfully`,
    });
  } catch (error) {
    console.error("Error updating newsletter:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update newsletter" },
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
