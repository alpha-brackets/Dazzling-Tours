import React from "react";
import Contact from "@/app/Components/Contact/Contact";
import BreadCrumb from "@/app/Components/Common/BreadCrumb";

const ContactPage = () => {
  return (
    <>
      <BreadCrumb
        bgImg="/assets/img/contact/ContactUs.png"
        Title="Contact Us"
      ></BreadCrumb>
      <Contact />
    </>
  );
};

export default ContactPage;
