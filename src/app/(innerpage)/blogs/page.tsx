import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import React from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Blog2 from "@/app/Components/Blogs/Blog2";

const page = () => {
  return (
    <div>
      <BreadCrumb
        bgImg={`${IMAGEKIT_URL_ENDPOINT}/assets/img/blogs/BlogsPage.webp`}
        Title="Blog"
      ></BreadCrumb>
      <Blog2></Blog2>
    </div>
  );
};

export default page;
