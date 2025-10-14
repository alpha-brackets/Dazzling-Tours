"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  useGetTestimonials,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from "@/lib/hooks";

const TestimonialsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");

  const { data: testimonialsData, isLoading: loading } = useGetTestimonials();
  const updateTestimonialMutation = useUpdateTestimonial();
  const deleteTestimonialMutation = useDeleteTestimonial();

  const testimonials = testimonialsData?.data || [];

  const deleteTestimonial = (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      deleteTestimonialMutation.mutate(id);
    }
  };

  const toggleFeatured = (id: string, currentFeatured: boolean) => {
    updateTestimonialMutation.mutate({
      _id: id,
      featured: !currentFeatured,
    });
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    updateTestimonialMutation.mutate({
      _id: id,
      status: currentStatus === "Active" ? "Inactive" : "Active",
    });
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || testimonial.status === filterStatus;
    const matchesFeatured =
      filterFeatured === "all" ||
      (filterFeatured === "featured" && testimonial.featured) ||
      (filterFeatured === "not-featured" && !testimonial.featured);
    return matchesSearch && matchesStatus && matchesFeatured;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`bi bi-star${i < rating ? "-fill" : ""} ${
          i < rating ? "text-warning" : "text-muted"
        }`}
      ></i>
    ));
  };

  if (loading) {
    return <div className="loading">Loading testimonials...</div>;
  }

  return (
    <div className="testimonials-list">
      <div className="page-header">
        <h1>Testimonials Management</h1>
        <Link href="/admin/testimonials/add" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Add New Testimonial
        </Link>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="bi bi-search"></i>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          value={filterFeatured}
          onChange={(e) => setFilterFeatured(e.target.value)}
        >
          <option value="all">All Featured</option>
          <option value="featured">Featured</option>
          <option value="not-featured">Not Featured</option>
        </select>
      </div>

      {/* Testimonials Grid */}
      <div className="testimonials-grid">
        {filteredTestimonials.map((testimonial) => (
          <div key={testimonial._id} className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-info">
                <h4>{testimonial.name}</h4>
                <p className="designation">{testimonial.designation}</p>
                {testimonial.company && (
                  <p className="company">{testimonial.company}</p>
                )}
                {testimonial.location && (
                  <p className="location">
                    <i className="bi bi-geo-alt"></i> {testimonial.location}
                  </p>
                )}
              </div>
              <div className="testimonial-rating">
                {renderStars(testimonial.rating)}
              </div>
            </div>

            <div className="testimonial-content">
              <p>&ldquo;{testimonial.content}&rdquo;</p>
            </div>

            {testimonial.tourId && (
              <div className="testimonial-tour">
                <small>
                  <i className="bi bi-map"></i> Related to: {testimonial.tourId}
                </small>
              </div>
            )}

            <div className="testimonial-meta">
              <div className="status-badges">
                <button
                  onClick={() =>
                    toggleStatus(testimonial._id, testimonial.status)
                  }
                  className={`status-badge ${testimonial.status.toLowerCase()} clickable`}
                >
                  {testimonial.status}
                </button>
                <button
                  onClick={() =>
                    toggleFeatured(testimonial._id, testimonial.featured)
                  }
                  className="btn btn-sm btn-link p-0"
                >
                  {testimonial.featured ? (
                    <i className="bi bi-star-fill text-warning"></i>
                  ) : (
                    <i className="bi bi-star text-muted"></i>
                  )}
                </button>
              </div>
              <div className="action-buttons">
                <Link
                  href={`/admin/testimonials/edit/${testimonial._id}`}
                  className="btn btn-sm btn-outline-primary"
                >
                  <i className="bi bi-pencil"></i>
                </Link>
                <button
                  onClick={() => deleteTestimonial(testimonial._id)}
                  className="btn btn-sm btn-outline-danger"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="no-data">
          <p>No testimonials found</p>
        </div>
      )}
    </div>
  );
};

export default TestimonialsList;
