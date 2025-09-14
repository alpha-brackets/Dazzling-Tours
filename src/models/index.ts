import mongoose, { Document, Schema } from "mongoose";

// Tour Model
export interface ITour extends Document {
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: string;
  location: string;
  category: string;
  images: string[];
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  includes: string[];
  excludes: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  groupSize: number;
  rating: number;
  reviews: number;
  featured: boolean;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const TourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    highlights: [{ type: String }],
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    includes: [{ type: String }],
    excludes: [{ type: String }],
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    groupSize: { type: Number, default: 10 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  {
    timestamps: true,
  }
);

// Booking Model
export interface IBooking extends Document {
  tourId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
  };
  bookingDetails: {
    startDate: Date;
    endDate: Date;
    participants: number;
    totalPrice: number;
    specialRequests?: string;
  };
  payment: {
    method: "Credit Card" | "PayPal" | "Bank Transfer" | "Cash";
    status: "Pending" | "Completed" | "Failed" | "Refunded";
    transactionId?: string;
    paidAt?: Date;
  };
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    tourId: { type: Schema.Types.ObjectId, ref: "Tour", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    customerInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String },
    },
    bookingDetails: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      participants: { type: Number, required: true, min: 1 },
      totalPrice: { type: Number, required: true },
      specialRequests: { type: String },
    },
    payment: {
      method: {
        type: String,
        enum: ["Credit Card", "PayPal", "Bank Transfer", "Cash"],
        required: true,
      },
      status: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Refunded"],
        default: "Pending",
      },
      transactionId: { type: String },
      paidAt: { type: Date },
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// User Model
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  role: "User" | "Admin";
  profileImage?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    profileImage: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    preferences: {
      newsletter: { type: Boolean, default: true },
      notifications: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Contact/Inquiry Model
export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "New" | "Read" | "Replied" | "Closed";
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["New", "Read", "Replied", "Closed"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

// Blog Model
export interface IBlog extends Document {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  status: "Draft" | "Published";
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    featuredImage: { type: String },
    status: { type: String, enum: ["Draft", "Published"], default: "Draft" },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Newsletter Subscription Model
export interface INewsletter extends Document {
  email: string;
  status: "Active" | "Unsubscribed";
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

const NewsletterSchema = new Schema<INewsletter>({
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ["Active", "Unsubscribed"], default: "Active" },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date },
});

// Create models
export const Tour =
  mongoose.models.Tour || mongoose.model<ITour>("Tour", TourSchema);
export const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Contact =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
export const Blog =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
export const Newsletter =
  mongoose.models.Newsletter ||
  mongoose.model<INewsletter>("Newsletter", NewsletterSchema);
