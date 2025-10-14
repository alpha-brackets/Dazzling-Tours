import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IconTick } from "../Common/icons";

const About2 = () => {
  return (
    <section className="about-section section-padding fix">
      <div className="container">
        <div className="about-wrapper-2">
          <div className="row g-4">
            <div className="col-lg-6">
              <div
                className="about-image wow fadeInUp wow"
                data-wow-delay=".3s"
              >
                <Image
                  src="/assets/img/about/about1.webp"
                  alt="img"
                  width={450}
                  height={449}
                />
                <div
                  className="about-image-2 wow fadeInUp wow"
                  data-wow-delay=".5s"
                >
                  <Image
                    src="/assets/img/about/about2.webp"
                    alt="img"
                    width={150}
                    height={150}
                  />
                </div>
                <div
                  className="about-image-3 wow fadeInUp wow"
                  data-wow-delay=".7s"
                >
                  <Image
                    src="/assets/img/about/about3.webp"
                    alt="img"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about-content">
                <div className="section-title">
                  <span className="sub-title wow fadeInUp">Get About Us</span>
                  <h2 className="wow fadeInUp wow" data-wow-delay=".3s">
                    We are Strived Only For The Best In The World
                  </h2>
                </div>
                <p className="wow fadeInUp wow" data-wow-delay=".5s">
                  There are many variations of passages of available, but the
                  majority have suffered alteration in some form, by injected
                  humour words which do not look even slightly believable
                  injected humour words which
                </p>
                <div
                  className="about-items wow fadeInUp wow"
                  data-wow-delay=".3s"
                >
                  <div className="about-icon-items">
                    <div className="icon">
                      <IconTick />
                    </div>
                    <div className="content">
                      <h5>
                        Easy Booking <br /> System
                      </h5>
                    </div>
                  </div>
                  <div className="text">
                    <p>
                      Our hotel also prides itself on <br /> offering
                      exceptional services.
                    </p>
                  </div>
                </div>
                <div
                  className="about-items wow fadeInUp wow"
                  data-wow-delay=".5s"
                >
                  <div className="about-icon-items">
                    <div className="icon">
                      <IconTick />
                    </div>
                    <div className="content">
                      <h5>
                        Easy Booking <br /> System
                      </h5>
                    </div>
                  </div>
                  <div className="text">
                    <p>
                      Our hotel also prides itself on <br /> offering
                      exceptional services.
                    </p>
                  </div>
                </div>
                <Link
                  href="/about"
                  className="theme-btn wow fadeInUp wow"
                  data-wow-delay=".7s"
                >
                  Discover More<i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About2;
