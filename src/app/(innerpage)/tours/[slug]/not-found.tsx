import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import React from "react";
import Link from "next/link";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import Icon from "@/app/Components/Common/Icon";

export default function NotFound() {
  return (
    <div>
      <BreadCrumb
        bgImg={`${IMAGEKIT_URL_ENDPOINT}/assets/img/tours/tourspage.png`}
        Title="Tour Not Found"
      />
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Tour Not Found</h2>
            <p className="mt-3 text-gray-600 mb-8">
              The tour you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link href="/tours" className="inline-flex items-center relative overflow-hidden bg-primary text-white hover:text-white rounded-full font-bold uppercase transition-all duration-300 px-8 py-3 mt-4">
              Browse All Tours <Icon name="arrow-right" className="ml-2 inline-block" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
