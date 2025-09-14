import React from "react";
import BreadCumb from "../../Components/Common/BreadCumb";
import Tour from "../../Components/Tour/Tour";

const page = () => {
  return (
    <div>
      <BreadCumb
        bgimg="/assets/img/breadcrumb/breadcrumb.jpg"
        Title="Tour"
      ></BreadCumb>
      <Tour></Tour>
    </div>
  );
};

export default page;
