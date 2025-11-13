"use client";
import Image from "next/image";
import React, { useRef } from "react";
import Slider from "react-slick";
import { useGetTestimonials } from "@/lib/hooks";

const Testimonial2 = () => {
  const { data: testimonialsData, isLoading: loading } = useGetTestimonials({
    status: "Active",
    featured: true,
    limit: 6,
  });

  const testimonials = testimonialsData?.data || [];

  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 1,
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`bi bi-star${i < Math.floor(rating) ? "-fill" : ""}`}
      ></i>
    ));
  };

  if (loading) {
    return (
      <section className="testimonial-section section-padding fix section-bg">
        <div className="container">
          <div className="text-center">
            <p>Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonial-section section-padding fix section-bg">
      <div className="container">
        <div className="testimonial-wrapper-2">
          <div className="row g-4">
            <div className="col-lg-5 wow fadeInUp wow" data-wow-delay=".3s">
              <div className="testimonial-image">
                <Image
                  src="/assets/img/testimonial/01.jpg"
                  alt="img"
                  width={450}
                  height={530}
                />
              </div>
            </div>
            <div className="col-lg-7">
              <div className="testimonial-content">
                <div className="section-title">
                  <span className="sub-title wow fadeInUp">Testimonial</span>
                  <h2 className="wow fadeInUp wow" data-wow-delay=".5s">
                    What They Say About Us
                  </h2>
                </div>
                <div className="swiper testimonial-slider2">
                  <div className="swiper-wrapper">
                    <Slider ref={sliderRef} {...settings}>
                      {testimonials.map((testimonial) => (
                        <div key={testimonial._id} className="swiper-slide">
                          <div className="testimonial-card-items">
                            <div className="star-item">
                              <div className="icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="54"
                                  height="48"
                                  viewBox="0 0 54 48"
                                  fill="none"
                                >
                                  <path
                                    d="M2 24.8696H16.4927C20.3157 24.8696 22.9395 27.7946 22.9395 31.3751V39.4945C22.9395 43.075 20.3157 45.9998 16.4927 45.9998H8.44679C4.89858 45.9998 2 43.075 2 39.4945V24.8696"
                                    stroke="var(--theme)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M2 24.8699C2 9.6148 4.82365 7.09343 13.3194 2"
                                    stroke="var(--theme)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M31.0605 24.8696H45.5532C49.3763 24.8696 52 27.7946 52 31.3751V39.4945C52 43.075 49.3763 45.9998 45.5532 45.9998H37.5073C33.9591 45.9998 31.0605 43.075 31.0605 39.4945V24.8696"
                                    stroke="var(--theme)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M31.0605 24.8699C31.0605 9.6148 33.884 7.09343 42.3798 2"
                                    stroke="var(--theme)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="star">
                                {renderStars(testimonial.rating)}
                                <span>
                                  {testimonial.rating.toFixed(1)} /5.0
                                </span>
                              </div>
                            </div>
                            <p>&ldquo;{testimonial.content}&rdquo;</p>
                            <div className="client-info-items">
                              <div className="info-text">
                                <h6>{testimonial.name}</h6>
                                {testimonial.location && (
                                  <p>{testimonial.location}</p>
                                )}
                              </div>
                              <h5>({testimonial.location || "Traveler"})</h5>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>
                <div className="array-button">
                  <button onClick={previous} className="array-prev">
                    <i className="bi bi-arrow-up"></i>
                  </button>
                  <button onClick={next} className="array-next">
                    <i className="bi bi-arrow-down"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial2;
