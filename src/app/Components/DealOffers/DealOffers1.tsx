"use client";
import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import loadBackgroundImages from "../Common/loadBackgroundImages";
import Link from "next/link";
import Image from "next/image";

const DealOffers1 = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const sliderRef = useRef<Slider>(null);

  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  useEffect(() => {
    loadBackgroundImages();
  }, []);

  const offerContent = [
    {
      img: "/assets/img/offer/01.jpg",
      subtitle: "-50% Off",
      title: "Nepal City",
      price: "$160",
    },
    {
      img: "/assets/img/offer/02.jpg",
      subtitle: "-50% Off",
      title: "Mishor",
      price: "$160",
    },
    {
      img: "/assets/img/offer/03.jpg",
      subtitle: "-50% Off",
      title: "China City",
      price: "$160",
    },
    {
      img: "/assets/img/offer/04.jpg",
      subtitle: "-50% Off",
      title: "New York City",
      price: "$160",
    },
  ];

  return (
    <section
      className="deals-offer-section section-padding fix bg-cover"
      data-background="/assets/img/offer/bg.jpg"
    >
      <div className="deals-offer-wrapper">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="price-items">
              <div
                className="price-image wow fadeInUp wow"
                data-wow-delay=".2s"
              >
                <Image
                  src="/assets/img/offer/price.png"
                  alt="img"
                  width={382}
                  height={227}
                />
              </div>
              <div className="coming-soon-timer">
                <div
                  className="timer-content wow fadeInUp"
                  data-wow-delay=".2s"
                >
                  <h2 id="day">07</h2>
                  <p>Days</p>
                </div>
                <div
                  className="timer-content wow fadeInUp"
                  data-wow-delay=".4s"
                >
                  <h2 id="hour">13</h2>
                  <p>Hours</p>
                </div>
                <div
                  className="timer-content wow fadeInUp"
                  data-wow-delay=".6s"
                >
                  <h2 id="min">39</h2>
                  <p>Minutes</p>
                </div>
                <div
                  className="timer-content wow fadeInUp"
                  data-wow-delay=".8s"
                >
                  <h2 id="sec">15</h2>
                  <p>Secound</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="section-title-area">
              <div className="section-title">
                <span className="sub-title text-white wow fadeInUp">
                  Deals & Offers
                </span>
                <h2
                  className="text-white wow fadeInUp wow"
                  data-wow-delay=".3s"
                >
                  Incredible Last-Minute Offers
                </h2>
              </div>
              <div
                className="array-button justify-content-center wow fadeInUp wow"
                data-wow-delay=".5s"
              >
                <button onClick={previous} className="array-prev">
                  <i className="bi bi-arrow-left"></i>
                </button>
                <button onClick={next} className="array-next">
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
            <div className="offer-slide-items">
              <div className="swiper offer-slider">
                <div className="swiper-wrapper cs_slider_gap_301">
                  <Slider ref={sliderRef} {...settings}>
                    {offerContent.map((item, i) => (
                      <div key={i} className="swiper-slide">
                        <div className="offer-items">
                          <div className="offer-image">
                            <Image
                              src={item.img}
                              alt="img"
                              width={309}
                              height={281}
                            />
                            <div className="offer-content">
                              <ul className="offer-btn">
                                <li>{item.subtitle}</li>
                              </ul>
                              <div className="content">
                                <h3>
                                  <Link href="/tour/tour-details">
                                    {item.title}
                                  </Link>
                                </h3>
                                <span>{item.price}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealOffers1;
