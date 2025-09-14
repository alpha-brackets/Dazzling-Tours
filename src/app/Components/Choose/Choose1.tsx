"use client";
import React, { useEffect } from "react";
import loadBackgroundImages from "../Common/loadBackgroundImages";
import Link from "next/link";
import Image from "next/image";

const Choose1 = () => {
  useEffect(() => {
    loadBackgroundImages();
  }, []);

  return (
    <section
      className="travel-feature-section section-padding fix"
      data-background="/assets/img/travel-bg.jpg"
    >
      <div className="shape-1 float-bob-y">
        <Image
          src="/assets/img/plane-shape1.png"
          alt="img"
          width={218}
          height={244}
        />
      </div>
      <div className="shape-2 float-bob-x">
        <Image
          src="/assets/img/plane-shape2.png"
          alt="img"
          width={310}
          height={459}
        />
      </div>
      <div className="container">
        <div className="feature-wrapper">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="feature-content">
                <div className="section-title">
                  <span className="sub-title wow fadeInUp">
                    Are you ready to travel?
                  </span>
                  <h2 className="wow fadeInUp wow" data-wow-delay=".2s">
                    World Leading Online Tour Booking Platform
                  </h2>
                </div>
                <p className="wow fadeInUp wow" data-wow-delay=".3s">
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which do not
                  look even slightly believable.
                </p>
                <div className="feature-area">
                  <div className="line-shape">
                    <Image
                      src="/assets/img/line-shape.png"
                      alt="img"
                      width={1}
                      height={174}
                    />
                  </div>
                  <div
                    className="feature-items wow fadeInUp wow"
                    data-wow-delay=".5s"
                  >
                    <div className="feature-icon-item">
                      <div className="icon">
                        <Image
                          src="/assets/img/icon/08.svg"
                          alt="img"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="content">
                        <h5>
                          Most Adventure <br />
                          Tour Ever
                        </h5>
                      </div>
                    </div>
                    <ul className="circle-icon">
                      <li>
                        <i className="fa-solid fa-badge-check"></i>
                      </li>
                      <li>
                        <span>
                          There are many variations of <br />
                          passages of available,
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div
                    className="feature-items wow fadeInUp wow"
                    data-wow-delay=".7s"
                  >
                    <div className="feature-icon-item">
                      <div className="icon">
                        <Image
                          src="/assets/img/icon/09.svg"
                          alt="img"
                          width={29}
                          height={40}
                        />
                      </div>
                      <div className="content">
                        <h5>
                          Real Tour Starts <br />
                          from Here
                        </h5>
                      </div>
                    </div>
                    <ul className="circle-icon">
                      <li>
                        <i className="fa-solid fa-badge-check"></i>
                      </li>
                      <li>
                        <span>
                          There are many variations of <br />
                          passages of available,
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="theme-btn wow fadeInUp wow"
                  data-wow-delay=".9s"
                >
                  Contact US<i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="feature-image wow img-custom-anim-left">
                <Image
                  src="/assets/img/man-image.png"
                  alt="img"
                  width={636}
                  height={577}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Choose1;
