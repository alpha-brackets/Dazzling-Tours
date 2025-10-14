"use client";
import React from "react";
import Link from "next/link";
import { useGetTour } from "@/lib/hooks";
import { ImageGallery } from "@/app/Components/Common";
import Image from "next/image";

const ViewTour = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useGetTour(params.id);
  const tour = data?.data;

  if (isLoading) {
    return <div className="loading">Loading tour...</div>;
  }

  if (!tour) {
    return (
      <section className="admin-view">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <h1>View Tour</h1>
              <p>Tour not found</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="admin-view">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>View Tour</h1>
            <p className="page-description">Tour details and information</p>
          </div>
          <div className="header-actions">
            <Link
              href={`/admin/tours/edit/${tour._id}`}
              className="btn btn-primary"
            >
              <i className="bi bi-pencil"></i> Edit
            </Link>
            <Link href="/admin/tours" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back
            </Link>
          </div>
        </div>
      </div>

      <div className="form-container">
        <div className="card">
          <div className="card-body">
            <div className="tour-overview">
              <div className="tour-header">
                <h2 className="tour-title">{tour.title}</h2>
                <div className="tour-meta">
                  <span
                    className={`badge status-badge ${tour.status?.toLowerCase()}`}
                  >
                    {tour.status || "Active"}
                  </span>
                  {tour.featured && (
                    <span className="badge featured-badge">
                      <i className="bi bi-star-fill"></i> Featured
                    </span>
                  )}
                  {tour.category && (
                    <span className="badge category-badge">
                      {tour.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="tour-description">
                <p className="short-description">
                  {tour.shortDescription || tour.description}
                </p>
              </div>

              <div className="tour-details-grid">
                <div className="detail-item">
                  <i className="bi bi-geo-alt"></i>
                  <div className="detail-content">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{tour.location}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="bi bi-calendar3"></i>
                  <div className="detail-content">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{tour.duration}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="bi bi-cash"></i>
                  <div className="detail-content">
                    <span className="detail-label">Price</span>
                    <span className="detail-value">${tour.price}</span>
                  </div>
                </div>
                {typeof tour.groupSize === "number" && (
                  <div className="detail-item">
                    <i className="bi bi-people"></i>
                    <div className="detail-content">
                      <span className="detail-label">Group Size</span>
                      <span className="detail-value">
                        {tour.groupSize} people
                      </span>
                    </div>
                  </div>
                )}
                {tour.difficulty && (
                  <div className="detail-item">
                    <i className="bi bi-speedometer2"></i>
                    <div className="detail-content">
                      <span className="detail-label">Difficulty</span>
                      <span className="detail-value">{tour.difficulty}</span>
                    </div>
                  </div>
                )}
                {tour.rating > 0 && (
                  <div className="detail-item">
                    <i className="bi bi-star-fill"></i>
                    <div className="detail-content">
                      <span className="detail-label">Rating</span>
                      <span className="detail-value">
                        {tour.rating}/5 ({tour.reviews} reviews)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tour Images Gallery */}
            {Array.isArray(tour.images) && tour.images.length > 0 && (
              <div className="content-section">
                <div className="section-header">
                  <h3>
                    <i className="bi bi-images"></i> Tour Images
                  </h3>
                  <p className="section-description">
                    Visual showcase of tour destinations and activities
                  </p>
                </div>
                <ImageGallery
                  images={tour.images}
                  alt={tour.title}
                  aspectRatio="4/3"
                  showThumbnails={true}
                />
              </div>
            )}

            {Array.isArray(tour.highlights) && tour.highlights.length > 0 && (
              <div className="content-section">
                <div className="section-header">
                  <h3>
                    <i className="bi bi-star"></i> Highlights
                  </h3>
                  <p className="section-description">
                    Key features and attractions
                  </p>
                </div>
                <div className="highlights-list">
                  {tour.highlights.map((highlight, idx) => (
                    <div key={idx} className="highlight-item">
                      <i className="bi bi-check-circle-fill"></i>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(tour.includes) && tour.includes.length > 0 && (
              <div className="content-section">
                <div className="section-header">
                  <h3>
                    <i className="bi bi-check-circle"></i> Includes
                  </h3>
                  <p className="section-description">
                    What&apos;s included in the tour price
                  </p>
                </div>
                <div className="includes-list">
                  {tour.includes.map((include, idx) => (
                    <div key={idx} className="include-item">
                      <i className="bi bi-plus-circle-fill"></i>
                      <span>{include}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(tour.excludes) && tour.excludes.length > 0 && (
              <div className="content-section">
                <div className="section-header">
                  <h3>
                    <i className="bi bi-x-circle"></i> Excludes
                  </h3>
                  <p className="section-description">
                    What&apos;s not included in the tour price
                  </p>
                </div>
                <div className="excludes-list">
                  {tour.excludes.map((exclude, idx) => (
                    <div key={idx} className="exclude-item">
                      <i className="bi bi-dash-circle-fill"></i>
                      <span>{exclude}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(tour.itinerary) && tour.itinerary.length > 0 && (
              <div className="content-section">
                <div className="section-header">
                  <h3>
                    <i className="bi bi-calendar-check"></i> Itinerary
                  </h3>
                  <p className="section-description">
                    Detailed day-by-day schedule
                  </p>
                </div>
                <div className="itinerary-list">
                  {tour.itinerary.map((item, idx) => (
                    <div key={idx} className="itinerary-item">
                      <div className="day-number">
                        <span>Day {item.day}</span>
                      </div>
                      <div className="day-content">
                        <h4 className="day-title">{item.title}</h4>
                        <p className="day-description">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(tour.images) && tour.images.length > 0 && (
              <div className="content-section">
                <div className="section-header">
                  <h3>
                    <i className="bi bi-images"></i> Images
                  </h3>
                  <p className="section-description">
                    Tour photos and galleries
                  </p>
                </div>
                <div className="image-gallery">
                  {tour.images.map((src, idx) => (
                    <div key={idx} className="gallery-item">
                      <Image
                        src={src}
                        alt={`Tour image ${idx + 1}`}
                        className="gallery-image"
                        width={100}
                        height={100}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTour;
