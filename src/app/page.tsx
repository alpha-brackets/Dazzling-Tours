import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import { Metadata } from "next";
import HeroBanner2 from "./Components/HeroBanner/HeroBanner";
import About from "./Components/About/About";
import FeaturedTour from "./Components/FeaturedTour/FeaturedTour";
import Choose from "./Components/Choose/Choose";
import Testimonial from "./Components/Testimonial/Testimonial";
import Cta from "./Components/Cta/Cta";
import Blog3 from "./Components/Blogs/Blog3";

export const metadata: Metadata = {
  title: "Dazzling Tours - Explore the nature",
  description:
    "Discover the most beautiful places in Pakistan with Dazzling Tours. We offer customized tour packages for families and groups.",
  keywords: [
    "Pakistan Tours",
    "Travel Agency",
    "Family Tours",
    "Dazzling Tours",
  ],
  openGraph: {
    title: "Dazzling Tours - Explore the nature",
    description:
      "Discover the most beautiful places in Pakistan with Dazzling Tours.",
    url: `${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero2.webp`,
    siteName: "Dazzling Tours",
    images: [`${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero2.webp`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dazzling Tours - Explore the nature",
    description:
      "Discover the most beautiful places in Pakistan with Dazzling Tours.",
    images: [`${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero2.webp`],
  },
};

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://dazzlingtours.pk";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dazzling Tours",
    description: "Explore the nature",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/tours?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Dazzling Tours",
    description: "Explore the nature",
    url: baseUrl,
    logo: `${IMAGEKIT_URL_ENDPOINT}/assets/img/logo-dazzling/Logo_Black.png`,
    image: `${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero2.webp`,
    sameAs: [
      // TODO: Add social media links if available
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English"],
    },
    areaServed: {
      "@type": "Place",
      name: "Pakistan",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
        id="website-schema"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
        id="org-schema"
      />
      <HeroBanner2 />
      <About />
      <FeaturedTour />
      <Choose />
      <Testimonial />
      <Cta />
      <Blog3 />
    </>
  );
}
