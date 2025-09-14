"use client";
import React, { useEffect } from "react";
import loadBackgroundImages from "../Common/loadBackgroundImages";
import Image from "next/image";

const Counter3 = () => {
  useEffect(() => {
    loadBackgroundImages();
  }, []);

  return (
    <section className="counter-section-2 fix">
      <div className="container-fluid">
        <div
          className="counter-wrapper-2 bg-cover"
          data-background="/assets/img/counter-bg.png"
        >
          <div className="counter-image">
            <Image
              src="/assets/img/counter-image.png"
              alt="img"
              width={397}
              height={200}
            />
          </div>
          <div
            className="counter-items-2 wow fadeInUp wow"
            data-wow-delay=".2s"
          >
            <div className="counter-content">
              <h2>
                <span className="count">26</span>+
              </h2>
              <p>Years Experiences</p>
            </div>
          </div>
          <div
            className="counter-items-2 wow fadeInUp wow"
            data-wow-delay=".4s"
          >
            <div className="counter-content">
              <h2>
                <span className="count">3</span>.6k+
              </h2>
              <p>Yearly Customers</p>
            </div>
          </div>
          <div
            className="counter-items-2 wow fadeInUp wow"
            data-wow-delay=".6s"
          >
            <div className="counter-content">
              <h2>
                <span className="count">46</span>+
              </h2>
              <p>Visitors daily</p>
            </div>
          </div>
          <div
            className="counter-items-2 style-2 wow fadeInUp wow"
            data-wow-delay=".8s"
          >
            <div className="counter-content">
              <h2>
                <span className="count">56</span>+
              </h2>
              <p>Awards &amp; honors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counter3;
