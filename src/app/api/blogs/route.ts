import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Blog } from "@/models";
import { MongoQuery } from "@/lib/types";

// GET /api/blogs - Get all blogs
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query: MongoQuery = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "excerpt",
      "content",
      "author",
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

    // Set publishedAt if status is Published and no publishedAt is provided
    if (body.status === "Published" && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    const blog = new Blog(body);
    await blog.save();

    return NextResponse.json(
      {
        success: true,
        data: blog,
        message: "Blog created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

// PUT /api/blogs - Update multiple blogs (bulk operations)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, blogIds, data } = body;

    if (!action || !blogIds || !Array.isArray(blogIds)) {
      return NextResponse.json(
        { success: false, error: "Action and blogIds are required" },
        { status: 400 }
      );
    }

    let result;
    switch (action) {
      case "updateStatus":
        const updateData: { status: string; publishedAt?: Date } = {
          status: data.status as string,
        };
        if (data.status === "Published") {
          updateData.publishedAt = new Date();
        }
        result = await Blog.updateMany({ _id: { $in: blogIds } }, updateData);
        break;
      case "updateCategory":
        result = await Blog.updateMany(
          { _id: { $in: blogIds } },
          { category: data.category }
        );
        break;
      case "delete":
        result = await Blog.deleteMany({ _id: { $in: blogIds } });
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
      message: `Blogs ${action} completed successfully`,
    });
  } catch (error) {
    console.error("Error updating blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blogs" },
      { status: 500 }
    );
  }
}
