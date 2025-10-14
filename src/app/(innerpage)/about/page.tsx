import React from "react";
import Choose1 from "@/app/Components/Choose/Choose1";
import Counter1 from "@/app/Components/Counter/Counter1";
import BreadCrumb from "@/app/Components/Common/BreadCrumb";
import About2 from "@/app/Components/About/About2";
import Testimonial2 from "@/app/Components/Testimonial/Testimonial2";

const AboutPage = () => {
  return (
    <>
      <BreadCrumb
        bgImg="/assets/img/breadcrumb/aboutpage.png"
        Title="About"
      ></BreadCrumb>
      <About2 />
      <Choose1 />
      <Counter1 />
      <Testimonial2 />
    </>
  );
};

export default AboutPage;
