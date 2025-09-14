import React from "react";
import BreadCumb from "../../../Components/Common/BreadCumb";
import TourDetails from "../../../Components/TourDetails/TourDetails";

const page = () => {
  return (
    <div>
      <BreadCumb
        bgimg="/assets/img/breadcrumb/breadcrumb.jpg"
        Title="Tour Details"
      ></BreadCumb>
      <TourDetails></TourDetails>
    </div>
  );
};

export default page;
