import React from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import BlogDetails from "../../../Components/BlogDetails/BlogDetails";

const page = () => {
  return (
    <div>
      <BreadCrumb
        bgImg="/assets/img/breadcrumb/breadcrumb.jpg"
        Title="Blog Details"
      ></BreadCrumb>
      <BlogDetails></BlogDetails>
    </div>
  );
};

export default page;
