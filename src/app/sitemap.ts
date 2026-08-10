import { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import { Tour, Blog, ITour, IBlog } from "@/models";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://dazzlingtours.pk";

  // Static routes
  const staticRoutes = [
    "",
    "/about-us",
    "/contact",
    "/tours",
    "/blogs",
    "/privacy-policy",
    "/terms-and-conditions",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let tourRoutes: {
    url: string;
    lastModified: Date;
    changeFrequency: "weekly";
    priority: number;
  }[] = [];
  let blogRoutes: {
    url: string;
    lastModified: Date;
    changeFrequency: "weekly";
    priority: number;
  }[] = [];

  try {
    await connectDB();

    // Fetch active tours
    const activeTours = await Tour.find({ status: "Active" })
      .select("_id seo.slug updatedAt")
      .lean();
    tourRoutes = (activeTours as unknown as ITour[]).map((tour) => {
      const slug = tour.seo?.slug || tour.id?.toString();
      return {
        url: `${baseUrl}/tours/${slug}`,
        lastModified: tour.updatedAt ? new Date(tour.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });

    // Fetch active blogs
    const activeBlogs = await Blog.find({ status: "Active" })
      .select("_id seo.slug updatedAt")
      .lean();
    blogRoutes = (activeBlogs as unknown as IBlog[]).map((blog) => {
      const slug = blog.seo?.slug || blog.id?.toString();
      return {
        url: `${baseUrl}/blogs/${slug}`,
        lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    });
  } catch (error) {
    console.error("Error generating dynamic sitemap routes:", error);
  }

  return [...staticRoutes, ...tourRoutes, ...blogRoutes];
}
