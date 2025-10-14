import React from "react";
import FeaturedTour1 from "@/app/Components/FeaturedTour/FeaturedTour1";
import Counter1 from "@/app/Components/Counter/Counter1";
import HeroBanner2 from "@/app/Components/HeroBanner/HeroBanner2";
import About2 from "./Components/About/About2";
import Choose2 from "./Components/Choose/Choose2";
import Testimonial2 from "./Components/Testimonial/Testimonial2";
import Cta2 from "./Components/Cta/Cta2";
import Blog3 from "./Components/Blogs/Blog3";

const HomePage = () => {
  return (
    <>
      <HeroBanner2 />
      <About2 />
      <FeaturedTour1 />
      <Choose2 />
      <Counter1 />
      <Testimonial2 />
      <Cta2 />
      <Blog3 />
    </>
  );
};

export default HomePage;
