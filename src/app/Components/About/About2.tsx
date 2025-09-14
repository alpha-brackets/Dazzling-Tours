import Image from "next/image";
import Link from "next/link";
import React from "react";

const About2 = () => {
  return (
    <section className="about-section section-padding fix">
      <div className="container">
        <div className="about-wrapper-2">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="about-image">
                <Image
                  src="/assets/img/about/03.jpg"
                  className="wow img-custom-anim-left"
                  alt="img"
                  width={330}
                  height={512}
                />
                <div className="shape-image float-bob-y">
                  <Image
                    src="/assets/img/about/04.png"
                    alt="img"
                    width={196}
                    height={109}
                  />
                </div>
                <div className="group-image float-bob-x">
                  <Image
                    src="/assets/img/about/group.png"
                    alt="img"
                    width={170}
                    height={50}
                  />
                </div>
                <div className="about-image-2">
                  <Image
                    src="/assets/img/about/05.jpg"
                    className="wow img-custom-anim-top"
                    alt="img"
                    width={284}
                    height={411}
                  />
                  <div className="plane-shape">
                    <Image
                      src="/assets/img/about/plane-shape2.png"
                      alt="img"
                      width={370}
                      height={205}
                    />
                  </div>
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
                      <Image
                        src="/assets/img/check.png"
                        alt="img"
                        width={34}
                        height={30}
                      />
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
                      <Image
                        src="/assets/img/check.png"
                        alt="img"
                        width={34}
                        height={30}
                      />
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
