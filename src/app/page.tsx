import React from "react";
import HeroBanner2 from "@/app/Components/HeroBanner/HeroBanner2";
import FeaturedTour1 from "@/app/Components/FeaturedTour/FeaturedTour1";
import Destination1 from "@/app/Components/Destination/Destination1";
import About1 from "@/app/Components/About/About1";
import Counter1 from "@/app/Components/Counter/Counter1";
import Testimonial1 from "@/app/Components/Testimonial/Testimonial1";
import Cta1 from "@/app/Components/Cta/Cta1";
import Instagram1 from "@/app/Components/Instagram/Instagram1";
import Footer1 from "@/app/Components/Footer/Footer1";
import Header1 from "@/app/Components/Header/Header1";

const HomePage = () => {
  return (
    <div className="main-page-area">
      <Header1 />
      <HeroBanner2 />
      <FeaturedTour1 />
      <Destination1 />
      <About1 />
      <Counter1 />
      <Testimonial1 />
      <Cta1 />
      <Instagram1 />
      <Footer1 />
    </div>
  );
};

export default HomePage;
