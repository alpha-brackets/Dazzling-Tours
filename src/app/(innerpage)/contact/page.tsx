import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import React from "react";
import type { Metadata } from "next";
import Contact from "@/app/Components/Contact/Contact";
import BreadCrumb from "@/app/Components/Common/BreadCrumb";

export const metadata: Metadata = {
  title: "Contact Us | Dazzling Tours - Plan Your Custom Tour",
  description:
    "Get in touch with Dazzling Tours. Plan your custom tour to Hunza, Skardu, Naran, and other breathtaking locations in Pakistan. We are here to help.",
  keywords: [
    "contact dazzling tours",
    "custom tour planner",
    "pakistan travel inquiry",
    "dazzling tours contact",
  ],
  alternates: {
    canonical: "/contact",
  },
};

const ContactPage = () => {
  return (
    <>
      <BreadCrumb
        bgImg={`${IMAGEKIT_URL_ENDPOINT}/assets/img/contact/ContactUs.png`}
        Title="Contact Us"
      />
      <Contact />
    </>
  );
};

export default ContactPage;
