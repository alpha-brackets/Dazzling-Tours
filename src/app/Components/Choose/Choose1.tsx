"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Choose1 = () => {
  return (
    <section
      className="travel-feature-section section-padding fix"
      style={{
        background:
          "linear-gradient(135deg, rgba(253, 125, 2, 0.1) 0%, rgba(2, 109, 247, 0.05) 50%, rgba(255, 193, 7, 0.08) 100%)",
        position: "relative",
      }}
    >
      <div className="container">
        <div className="feature-wrapper">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="feature-content">
                <div className="section-title">
                  <span className="sub-title wow fadeInUp">Why Choose Us</span>
                  <h2 className="wow fadeInUp wow" data-wow-delay=".2s">
                    Experience Northern Pakistan Like Never Before
                  </h2>
                </div>
                <p className="wow fadeInUp wow" data-wow-delay=".3s">
                  Discover the breathtaking beauty of Northern Pakistan with our
                  expert-guided tours. From majestic mountains to pristine
                  lakes, we offer unforgettable adventures in Pakistan&apos;s
                  most stunning landscapes.
                </p>
                <div className="feature-area">
                  <div className="line-shape">
                    <div className="custom-line"></div>
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
                          Mountain Trekking <br />
                          Adventures
                        </h5>
                      </div>
                    </div>
                    <ul className="circle-icon">
                      <li>
                        <i className="fa-solid fa-badge-check"></i>
                      </li>
                      <li>
                        <span>
                          Expert guides for safe and <br />
                          memorable mountain experiences,
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
                          Cultural Heritage <br />
                          Exploration
                        </h5>
                      </div>
                    </div>
                    <ul className="circle-icon">
                      <li>
                        <i className="fa-solid fa-badge-check"></i>
                      </li>
                      <li>
                        <span>
                          Discover rich local culture and <br />
                          traditional mountain communities,
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
                  Plan Your Adventure<i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="feature-image wow img-custom-anim-left">
                <Image
                  src="/assets/img/choose/Choose1.webp"
                  alt="Northern Pakistan Mountains"
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
