import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import React from "react";
import type { Metadata } from "next";
import BreadCrumb from "@/app/Components/Common/BreadCrumb";
import { Section, Container } from "@/app/Components/Common";

export const metadata: Metadata = {
  title: "Terms and Conditions | Dazzling Tours - Explore the nature",
  description: "Review the Terms and Conditions of Dazzling Tours. Details booking options, cancellation policy, payments, and liability terms for all tour packages.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

const TermsAndConditionsPage = () => {
  return (
    <>
      <BreadCrumb
        bgImg={`${IMAGEKIT_URL_ENDPOINT}/assets/img/breadcrumb/aboutpage.png`}
        Title="Terms & Conditions"
      />
      <Section padding="lg" className="bg-gray-50/50">
        <Container>
          <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
              Terms and Conditions
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Welcome to Dazzling Tours. These terms and conditions outline the
              rules and regulations for the use of Dazzling Tours&apos; Website
              and Services.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">
              1. Acceptance of Terms
            </h4>
            <p className="text-gray-600 leading-relaxed mb-6">
              By accessing this website we assume you accept these terms and
              conditions. Do not continue to use Dazzling Tours if you do not
              agree to take all of the terms and conditions stated on this page.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">
              2. Booking and Payments
            </h4>
            <p className="text-gray-600 leading-relaxed mb-6">
              All bookings are subject to availability and confirmation. A
              deposit or full payment may be required at the time of booking
              depending on the tour package. We reserve the right to alter
              pricing before booking confirmation.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">
              3. Cancellations and Refunds
            </h4>
            <p className="text-gray-600 leading-relaxed mb-6">
              Cancellation policies vary depending on the tour booked.
              Generally, cancellations made within a certain window before the
              departure date may be subject to a cancellation fee. Please review
              the specific cancellation policy for your chosen tour.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">
              4. Travel Documents
            </h4>
            <p className="text-gray-600 leading-relaxed mb-6">
              It is the passenger&apos;s responsibility to ensure they have
              valid passports, visas, and necessary health requirements for
              their journey. Dazzling Tours is not liable for any issues arising
              from incorrect documentation.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">
              5. Liability
            </h4>
            <p className="text-gray-600 leading-relaxed mb-6">
              Dazzling Tours shall not be liable for any injury, damage, loss,
              accident, delay, or irregularity that may be caused to person or
              property in connection with any service provided.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">
              6. Changes to Terms
            </h4>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to make changes to these terms and conditions
              at any time. Your continued use of the website and our services
              following any changes indicates your acceptance of the new terms.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default TermsAndConditionsPage;
