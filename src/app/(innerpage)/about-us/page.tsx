import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import React from "react";
import type { Metadata } from "next";
import BreadCrumb from "@/app/Components/Common/BreadCrumb";
import About from "@/app/Components/About/About";
import Testimonial from "@/app/Components/Testimonial/Testimonial";
import Choose from "@/app/Components/Choose/Choose";

// SEO Metadata
export const metadata: Metadata = {
  title: "About Us | Dazzling Tours - Explore the nature",
  description: "Learn more about Dazzling Tours, your trusted travel partner in Pakistan. We specialize in curating custom family tour packages, trekking adventures, and sightseeing guides.",
  keywords: [
    "about us",
    "travel agency",
    "tour company",
    "travel experts",
    "personalized tours",
    "travel experiences",
    "Dazzling Tours",
  ],
  openGraph: {
    title: "About Us | Dazzling Tours - Explore the nature",
    description: "Learn more about Dazzling Tours, your trusted travel partner in Pakistan. We specialize in curating custom family tour packages, trekking adventures, and sightseeing guides.",
    type: "website",
    images: [
      {
        url: `${IMAGEKIT_URL_ENDPOINT}/assets/img/about/about1.webp`,
        alt: "Dazzling Tours - Explore the nature",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Dazzling Tours - Explore the nature",
    description: "Learn more about Dazzling Tours, your trusted travel partner in Pakistan. We specialize in curating custom family tour packages, trekking adventures, and sightseeing guides.",
    images: [`${IMAGEKIT_URL_ENDPOINT}/assets/img/about/about1.webp`],
  },
  alternates: {
    canonical: "/about-us",
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

const AboutPage = () => {
  // Structured Data (JSON-LD) for SEO
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://dazzlingtours.pk";

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Us | Dazzling Tours",
    "description": "Learn more about Dazzling Tours, your trusted travel partner in Pakistan. We specialize in curating custom family tour packages, trekking adventures, and sightseeing guides.",
    "url": `${baseUrl}/about-us`,
    "mainEntity": {
      "@type": "TravelAgency",
      "name": "Dazzling Tours",
      "url": baseUrl,
      "logo": `${IMAGEKIT_URL_ENDPOINT}/assets/img/logo-dazzling/Logo_Black.png`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageSchema),
        }}
        id="about-page-schema"
      />
      <BreadCrumb
        bgImg={`${IMAGEKIT_URL_ENDPOINT}/assets/img/breadcrumb/aboutpage.png`}
        Title="About Us"
      />
      <About />
      <Choose />
      <Testimonial />
    </>
  );
};

export default AboutPage;
