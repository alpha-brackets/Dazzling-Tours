"use client";
import React, { useEffect } from "react";
import loadBackgroundImages from "../Common/loadBackgroundImages";
import Link from "next/link";
import Image from "next/image";

const Counter2 = () => {
  useEffect(() => {
    loadBackgroundImages();
  }, []);

  return (
    <section
      className="cta-offer-section section-padding fix bg-cover"
      data-background="/assets/img/offer/bg2.png"
    >
      <div className="container">
        <div className="cta-offer-wrapper">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="offer-content">
                <div className="section-title">
                  <span className="sub-title text-white wow fadeInUp">
                    What we’re Offering
                  </span>
                  <h2
                    className="text-white wow fadeInUp wow"
                    data-wow-delay=".2s"
                  >
                    Get 30% Discount Every <br />
                    Tour
                  </h2>
                </div>
                <div className="coming-soon-timer">
                  <div
                    className="timer-content wow fadeInUp"
                    data-wow-delay=".2s"
                  >
                    <h3 id="day">04</h3>
                    <p>Days</p>
                  </div>
                  <div
                    className="timer-content wow fadeInUp"
                    data-wow-delay=".4s"
                  >
                    <h3 id="hour">15</h3>
                    <p>HRS</p>
                  </div>
                  <div
                    className="timer-content wow fadeInUp"
                    data-wow-delay=".6s"
                  >
                    <h3 id="min">41</h3>
                    <p>MINS</p>
                  </div>
                  <div
                    className="timer-content wow fadeInUp"
                    data-wow-delay=".8s"
                  >
                    <h3 id="sec">55</h3>
                    <p>SECS</p>
                  </div>
                </div>
                <Link
                  href="/tour/tour-details"
                  className="theme-btn wow fadeInUp wow"
                  data-wow-delay=".9s"
                >
                  Explore Flight<i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="offer-image">
                <Image
                  src="/assets/img/offer/circle.png"
                  alt="img"
                  width={386}
                  height={386}
                />
                <div className="circle">
                  <div className="text-item">
                    <div className="icon">
                      <Link href="/tour/tour-details">
                        <Image
                          src="/assets/img/icon/16.svg"
                          alt="img"
                          width={70}
                          height={51}
                        />
                      </Link>
                    </div>
                    <div className="image">
                      <Image
                        src="/assets/img/offer/text.png"
                        alt="img"
                        width={212}
                        height={216}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counter2;
