"use client";
import React, { useRef } from "react";
import Slider from "react-slick";
import parse from "html-react-parser";
import Link from "next/link";
import Image from "next/image";

const FeaturedTour1 = () => {
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

  const tourContent = [
    {
      img: "/assets/img/feature/01.jpg",
      location: "Netherlands",
      title: "Best Time Ever to Explore <br>Molina's Nature",
      price: "$49.00",
    },
    {
      img: "/assets/img/feature/02.jpg",
      location: "Thailand",
      title: "Bathing and Kayaking at <br>Nonrival Beach",
      price: "$49.00",
    },
    {
      img: "/assets/img/feature/03.jpg",
      location: "Austria",
      title: "5 Best Tips for an Amazing <br>Molina Trip",
      price: "$49.00",
    },
    {
      img: "/assets/img/feature/04.jpg",
      location: "Switzerland",
      title: "Discover Beautiful Moliva: <br>Nature's Paradise",
      price: "$49.00",
    },
  ];

  return (
    <section className="featured-tour-section section-padding section-bg">
      <div className="left-shape">
        <Image
          src="/assets/img/feature/plane-shape.png"
          alt="img"
          width={372}
          height={112}
        />
      </div>
      <div className="right-shape">
        <Image
          src="/assets/img/feature/plane-shape.png"
          alt="img"
          width={372}
          height={112}
        />
      </div>
      <div className="array-button">
        <button onClick={previous} className="array-prev">
          <Image
            src="/assets/img/offer/chervon-right.png"
            alt="img"
            width={24}
            height={16}
          />
        </button>
        <button onClick={next} className="array-next">
          <Image
            src="/assets/img/icon/39.svg"
            alt="img"
            width={24}
            height={16}
          />
        </button>
      </div>
      <div className="container">
        <div className="section-title">
          <span className="sub-title wow fadeInUp">Featured Tour</span>
          <h2 className="wow fadeInUp wow" data-wow-delay=".5s">
            unforgettable Travel Discoveries
          </h2>
        </div>
        <p className="wow fadeInUp wow" data-wow-delay=".7s">
          There are many variations of passages of available, but the majority
          have suffered alteration in some <br /> form, by injected humour words
          which do not look even slightly believable
        </p>
        <div className="swiper tour-slider">
          <div className="swiper-wrapper cs_slider_gap_301">
            <Slider ref={sliderRef} {...settings}>
              {tourContent.map((item, i) => (
                <div key={i} className="swiper-slide">
                  <div className="feature-tour-items">
                    <div className="feature-tour-image">
                      <Image
                        src={item.img}
                        alt="img"
                        width={294}
                        height={238}
                      />
                      <ul className="location">
                        <li>
                          <i className="bi bi-geo-alt-fill"></i>
                          {item.location}
                        </li>
                      </ul>
                    </div>
                    <div className="feature-tour-content">
                      <h4>
                        <Link href="/tour/tour-details">
                          {parse(item.title)}
                        </Link>
                      </h4>
                      <h5>
                        {item.price}
                        <span>/Per day</span>
                      </h5>
                      <Link href="/tour/tour-details" className="icon">
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTour1;
