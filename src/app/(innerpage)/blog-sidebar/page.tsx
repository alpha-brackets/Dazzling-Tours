import React from "react";
import BreadCumb from "../../Components/Common/BreadCumb";
import BlogSidebar from "../../Components/BlogSidebar/BlogSidebar";

const page = () => {
  return (
    <div>
      <BreadCumb
        bgimg="/assets/img/breadcrumb/breadcrumb.jpg"
        Title="Blog Classic"
      ></BreadCumb>
      <BlogSidebar></BlogSidebar>
    </div>
  );
};

export default page;
