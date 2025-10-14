"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useGetTours } from "@/lib/hooks";

const Tour = () => {
  const {
    data: toursData,
    isLoading: loading,
    error,
  } = useGetTours({
    status: "Active",
    featured: true,
    limit: 9,
  });

  const tours = toursData?.data || [];

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
      <section className="tour-section section-padding fix">
        <div className="container custom-container">
          <div className="text-center">
            <p>Loading tours...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="tour-section section-padding fix">
        <div className="container custom-container">
          <div className="text-center">
            <p>Error: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tour-section section-padding fix">
      <div className="container custom-container">
        <div className="tour-destination-wrapper">
          <div className="row g-4">
            <div className="col-xl-8">
              <div className="row g-4">
                {tours.map((tour) => (
                  <div
                    key={tour._id}
                    className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow"
                    data-wow-delay=".3s"
                  >
                    <div className="destination-card-items mt-0">
                      <div className="destination-image">
                        <Image
                          src={
                            tour.images?.[0] || "/assets/img/destination/01.jpg"
                          }
                          alt={tour.title}
                          width={287}
                          height={240}
                        />
                        <div className="heart-icon">
                          <i className="bi bi-heart"></i>
                        </div>
                      </div>
                      <div className="destination-content">
                        <ul className="meta">
                          <li>
                            <i className="bi bi-geo-alt"></i>
                            {tour.location}
                          </li>
                          <li className="rating">
                            <div className="star">
                              {renderStars(
                                typeof tour.rating === "number"
                                  ? tour.rating
                                  : 0
                              )}
                            </div>
                            <p>
                              {(typeof tour.rating === "number"
                                ? tour.rating
                                : 0
                              ).toFixed(1)}
                            </p>
                          </li>
                        </ul>
                        <h5>
                          <Link href={`/tours/${tour._id}`}>{tour.title}</Link>
                        </h5>
                        <ul className="info">
                          <li>
                            <i className="bi bi-clock"></i>
                            {tour.duration}
                          </li>
                          <li>
                            <i className="bi bi-person"></i>
                            {tour.reviews} reviews
                          </li>
                        </ul>
                        <div className="price">
                          <h6>
                            ${tour.price}
                            <span>/Per person</span>
                          </h6>
                          <Link
                            href={`/tours/${tour._id}`}
                            className="theme-btn style-2"
                          >
                            Book Now<i className="bi bi-arrow-right"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="page-nav-wrap text-center">
                <ul>
                  <li>
                    <a className="page-numbers" href="#">
                      <i className="bi bi-arrow-left"></i>
                    </a>
                  </li>
                  <li>
                    <a className="page-numbers" href="#">
                      01
                    </a>
                  </li>
                  <li>
                    <a className="page-numbers" href="#">
                      02
                    </a>
                  </li>
                  <li>
                    <a className="page-numbers" href="#">
                      03
                    </a>
                  </li>
                  <li>
                    <a className="page-numbers" href="#">
                      <i className="bi bi-arrow-right"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="main-sidebar mt-0">
                <div className="single-sidebar-widget">
                  <div className="wid-title">
                    <h3>Destination Category</h3>
                  </div>
                  <div className="categories-list">
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Canada</span>
                      </span>
                      <span className="text-color">04</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Europe</span>
                      </span>
                      <span className="text-color">03</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">France</span>
                      </span>
                      <span className="text-color">05</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Indonesia</span>
                      </span>
                      <span className="text-color">06</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Nepal</span>
                      </span>
                      <span className="text-color">05</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Maldives</span>
                      </span>
                      <span className="text-color">04</span>
                    </label>
                  </div>
                </div>

                <div className="single-sidebar-widget">
                  <div className="wid-title">
                    <h3>Activities</h3>
                  </div>
                  <div className="categories-list">
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" readOnly />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Canada</span>
                      </span>
                      <span className="text-color">04</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Europe</span>
                      </span>
                      <span className="text-color">03</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">France</span>
                      </span>
                      <span className="text-color">05</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Indonesia</span>
                      </span>
                      <span className="text-color">06</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Nepal</span>
                      </span>
                      <span className="text-color">05</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Maldives</span>
                      </span>
                      <span className="text-color">04</span>
                    </label>
                  </div>
                </div>
                <div className="single-sidebar-widget">
                  <div className="wid-title style-2">
                    <h3>Tour Types</h3>
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                  <div className="categories-list">
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Premium</span>
                      </span>
                      <span className="text-color">04</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Luxury</span>
                      </span>
                      <span className="text-color">03</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Standard</span>
                      </span>
                      <span className="text-color">05</span>
                    </label>
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

export default Tour;
