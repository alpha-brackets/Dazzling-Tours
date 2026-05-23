import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import { Metadata } from "next";
import HeroBanner2 from "./Components/HeroBanner/HeroBanner";
import About from "./Components/About/About";
import FeaturedTour from "./Components/FeaturedTour/FeaturedTour";
import Choose from "./Components/Choose/Choose";
import CustomTourSection from "./Components/CustomTourSection/CustomTourSection";
import Testimonial from "./Components/Testimonial/Testimonial";
import Cta from "./Components/Cta/Cta";
import Blog3 from "./Components/Blogs/Blog3";

export const metadata: Metadata = {
  title: "Dazzling Tours | Premium Travel & Customized Tours in Pakistan",
  description:
    "Discover the most beautiful places in Pakistan with Dazzling Tours. We offer customized tour packages, guided family tours, group adventures, and transport services.",
  keywords: [
    "Pakistan Tours",
    "Travel Agency Pakistan",
    "Family Tours Hunza",
    "Skardu Tour Packages",
    "Dazzling Tours",
    "Hunza Valley Tours",
    "Custom Travel Packages Pakistan",
  ],
  openGraph: {
    title: "Dazzling Tours | Premium Travel & Customized Tours in Pakistan",
    description:
      "Discover the most beautiful places in Pakistan with Dazzling Tours. Premium custom tours and travel packages.",
    url: `${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero2.webp`,
    siteName: "Dazzling Tours",
    images: [`${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero2.webp`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dazzling Tours | Premium Travel & Customized Tours in Pakistan",
    description:
      "Discover the most beautiful places in Pakistan with Dazzling Tours. Premium custom tours and travel packages.",
    images: [`${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero2.webp`],
  },
};

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://dazzlingtours.pk";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dazzling Tours",
    description: "Discover the most beautiful places in Pakistan with Dazzling Tours.",
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
    description: "Premium travel agency offering customized tour packages, guided family trips, and transport services across Pakistan.",
    url: baseUrl,
    logo: `${IMAGEKIT_URL_ENDPOINT}/assets/img/logo-dazzling/Logo_Black.png`,
    image: `${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero2.webp`,
    sameAs: [
      "https://www.facebook.com/dazzlingtourscompany/",
      "https://www.instagram.com/dazzlingtoursofficial/",
      "https://www.tiktok.com/@dazzlingtours"
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
      <CustomTourSection />
      <Testimonial />
      <Cta />
      <Blog3 />
    </>
  );
}
