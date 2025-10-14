import React from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TourDetails from "../../../Components/TourDetails/TourDetails";

const page = () => {
  return (
    <div>
      <BreadCrumb
        bgImg="/assets/img/breadcrumb/breadcrumb.jpg"
        Title="Tour Details"
      ></BreadCrumb>
      <TourDetails></TourDetails>
    </div>
  );
};

export default page;
