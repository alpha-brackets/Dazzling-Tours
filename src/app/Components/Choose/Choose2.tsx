"use client";
import React from "react";
import Image from "next/image";

const Choose2 = () => {
  return (
    <section
      className="choose-us-section section-padding fix"
      style={{
        background:
          "linear-gradient(135deg, rgba(253, 125, 2, 0.1) 0%, rgba(2, 109, 247, 0.05) 50%, rgba(255, 193, 7, 0.08) 100%)",
        position: "relative",
      }}
    >
      <div className="container">
        <div className="choose-us-wrapper">
          <div className="row g-4 align-items-center">
            <div className="col-xl-7 col-lg-6">
              <div className="choose-us-content">
                <div className="section-title">
                  <span className="sub-title wow fadeInUp">Why Choose Us</span>
                  <h2 className="wow fadeInUp wow" data-wow-delay=".3s">
                    Get The Best Travel Experience
                  </h2>
                </div>
                <p className="wow fadeInUp wow" data-wow-delay=".3s">
                  There are many variations of passages of available, but the
                  majority have suffered alteration in <br /> some form, by
                  injected humour words which do not look even slightly
                  believable
                </p>
                <div className="choose-us-area">
                  <div className="line-shape">
                    <div className="custom-line"></div>
                  </div>
                  <div
                    className="choose-us-items wow fadeInUp wow"
                    data-wow-delay=".3s"
                  >
                    <h3 className="number">01</h3>
                    <div className="content">
                      <h4>
                        Find ans enjoy a Trip that fits Your Lifestyle with{" "}
                        <br />
                        your Friends
                      </h4>
                      <p>
                        Globally productize flexible potentialities via
                        high-payoff markets. Proactively <br /> revolutionize
                        parallel growth strategies.
                      </p>
                    </div>
                  </div>
                  <div
                    className="choose-us-items wow fadeInUp wow"
                    data-wow-delay=".5s"
                  >
                    <h3 className="number">02</h3>
                    <div className="content">
                      <h4>Travel With More Confidence</h4>
                      <p>
                        Globally productize flexible potentialities via
                        high-payoff markets. Proactively <br /> revolutionize
                        parallel growth strategies.
                      </p>
                    </div>
                  </div>
                  <div
                    className="choose-us-items wow fadeInUp wow"
                    data-wow-delay=".7s"
                  >
                    <h3 className="number">03</h3>
                    <div className="content">
                      <h4>See What you really Get form us</h4>
                      <p>
                        Globally productize flexible potentialities via
                        high-payoff markets. Proactively <br /> revolutionize
                        parallel growth strategies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-xl-5 col-lg-6 wow fadeInUp wow"
              data-wow-delay=".3s"
            >
              <div className="choose-us-thumb">
                <Image
                  src="/assets/img/choose/Choose1.webp"
                  className="wow img-custom-anim-left"
                  alt="img"
                  width={828}
                  height={620}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Choose2;
