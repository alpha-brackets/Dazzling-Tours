import React from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Tour from "../../Components/Tour/Tour";

const page = () => {
  return (
    <div>
      <BreadCrumb
        bgImg="/assets/img/tours/tourspage.png"
        Title="Tour"
      ></BreadCrumb>
      <Tour></Tour>
    </div>
  );
};

export default page;
