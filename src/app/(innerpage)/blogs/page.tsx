import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import React from "react";
import type { Metadata } from "next";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Blog2 from "@/app/Components/Blogs/Blog2";

export const metadata: Metadata = {
  title: "Blog & Travel Stories | Dazzling Tours",
  description: "Read travel guides, destination tips, local itineraries, and stories from our expert travel team. Plan your trip across Pakistan with Dazzling Tours.",
  keywords: [
    "travel blog",
    "Pakistan travel guides",
    "Hunza travel stories",
    "Skardu travel tips",
    "Dazzling Tours blog",
    "Pakistan sightseeing guides",
  ],
  openGraph: {
    title: "Blog & Travel Stories | Dazzling Tours",
    description: "Read travel guides, destination tips, local itineraries, and stories from our expert travel team.",
    type: "website",
    images: [
      {
        url: `${IMAGEKIT_URL_ENDPOINT}/assets/img/blogs/BlogsPage.webp`,
        alt: "Dazzling Tours Blog",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Travel Stories | Dazzling Tours",
    description: "Read travel guides, destination tips, local itineraries, and stories from our expert travel team.",
    images: [`${IMAGEKIT_URL_ENDPOINT}/assets/img/blogs/BlogsPage.webp`],
  },
  alternates: {
    canonical: "/blogs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://dazzlingtours.pk";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blogs`,
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
        id="blogs-breadcrumb-schema"
      />
      <BreadCrumb
        bgImg={`${IMAGEKIT_URL_ENDPOINT}/assets/img/blogs/BlogsPage.webp`}
        Title="Blog"
      ></BreadCrumb>
      <Blog2></Blog2>
    </div>
  );
};

export default page;
