import React from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Blog2 from "@/app/Components/Blogs/Blog2";

const page = () => {
  return (
    <div>
      <BreadCrumb
        bgImg="/assets/img/blogs/BlogsPage.webp"
        Title="Blog"
      ></BreadCrumb>
      <Blog2></Blog2>
    </div>
  );
};

export default page;
