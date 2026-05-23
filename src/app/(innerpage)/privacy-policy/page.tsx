import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import React from "react";
import type { Metadata } from "next";
import BreadCrumb from "@/app/Components/Common/BreadCrumb";
import { Section, Container } from "@/app/Components/Common";

export const metadata: Metadata = {
  title: "Privacy Policy | Dazzling Tours - Explore the nature",
  description: "Read the Privacy Policy of Dazzling Tours. Learn how we collect, store, protect, and use user information to provide safe and secure travel services.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const PrivacyPolicyPage = () => {
  return (
    <>
      <BreadCrumb
        bgImg={`${IMAGEKIT_URL_ENDPOINT}/assets/img/breadcrumb/aboutpage.png`}
        Title="Privacy Policy"
      />
      <Section padding="lg" className="bg-gray-50/50">
        <Container>
          <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
              Privacy Policy
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              At Dazzling Tours, accessible from the website, one of our main
              priorities is the privacy of our visitors. This Privacy Policy
              document contains types of information that is collected and
              recorded by Dazzling Tours and how we use it.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">
              1. Information We Collect
            </h4>
            <p className="text-gray-600 leading-relaxed mb-6">
              The personal information that you are asked to provide, and the
              reasons why you are asked to provide it, will be made clear to you
              at the point we ask you to provide your personal information. If
              you contact us directly, we may receive additional information
              about you such as your name, email address, phone number, the
              contents of the message and/or attachments you may send us, and
              any other information you may choose to provide.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">
              2. How We Use Your Information
            </h4>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the information we collect in various ways, including to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Provide, operate, and maintain our website and services</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>
                Develop new products, services, features, and functionality
              </li>
              <li>
                Communicate with you, either directly or through one of our
                partners, including for customer service, to provide you with
                updates and other information relating to the website
              </li>
              <li>Send you emails related to your bookings and inquiries</li>
            </ul>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">
              3. Log Files
            </h4>
            <p className="text-gray-600 leading-relaxed mb-6">
              Dazzling Tours follows a standard procedure of using log files.
              These files log visitors when they visit websites. The information
              collected by log files include internet protocol (IP) addresses,
              browser type, Internet Service Provider (ISP), date and time
              stamp, referring/exit pages, and possibly the number of clicks.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">
              4. Security
            </h4>
            <p className="text-gray-600 leading-relaxed mb-6">
              We value your trust in providing us your Personal Information,
              thus we are striving to use commercially acceptable means of
              protecting it. But remember that no method of transmission over
              the internet, or method of electronic storage is 100% secure and
              reliable, and we cannot guarantee its absolute security.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">
              5. Changes to This Privacy Policy
            </h4>
            <p className="text-gray-600 leading-relaxed mb-6">
              We may update our Privacy Policy from time to time. Thus, we
              advise you to review this page periodically for any changes. We
              will notify you of any changes by posting the new Privacy Policy
              on this page. These changes are effective immediately, after they
              are posted on this page.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">
              6. Contact Us
            </h4>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions or suggestions about our Privacy Policy,
              do not hesitate to contact us
              {/* at{" "} */}
              {/* <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="text-[#fd7d02] font-semibold hover:underline"
              >
                {COMPANY_INFO.email}
              </a> */}
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default PrivacyPolicyPage;
