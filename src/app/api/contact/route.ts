import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Contact } from "@/models";
import { MongoQuery } from "@/lib/types";

// GET /api/contact - Get all contact inquiries
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const query: MongoQuery = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// POST /api/contact - Create a new contact inquiry
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const contact = new Contact(body);
    await contact.save();

    return NextResponse.json(
      {
        success: true,
        data: contact,
        message: "Contact inquiry submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit contact inquiry" },
      { status: 500 }
    );
  }
}
