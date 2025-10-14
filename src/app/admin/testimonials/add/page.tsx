"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Tour {
  _id: string;
  title: string;
}

const AddTestimonial = () => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    company: "",
    content: "",
    rating: 5,
    image: "",
    location: "",
    tourId: "",
    status: "Active",
    featured: false,
  });

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await fetch("/api/tours");
      const data = await response.json();
      if (data.success) {
        setTours(data.data);
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/testimonials");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create testimonial");
      }
    } catch (error) {
      console.error("Error creating testimonial:", error);
      alert("Failed to create testimonial");
    } finally {
      setSaving(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setFormData((prev) => ({ ...prev, rating: i + 1 }))}
        className={`star-btn ${i < rating ? "active" : ""}`}
      >
        <i className={`bi bi-star${i < rating ? "-fill" : ""}`}></i>
      </button>
    ));
  };

  return (
    <div className="add-testimonial">
      <div className="page-header">
        <h1>Add New Testimonial</h1>
        <button
          onClick={() => router.back()}
          className="btn btn-outline-secondary"
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="testimonial-form">
        <div className="form-grid">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Designation *</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    designation: e.target.value,
                  }))
                }
                placeholder="e.g., CEO, Travel Blogger, Customer"
                required
              />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, company: e.target.value }))
                }
                placeholder="Company name (optional)"
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="City, Country (optional)"
              />
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="form-section">
            <h3>Testimonial Content</h3>
            <div className="form-group">
              <label>Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={6}
                placeholder="Write the testimonial content here..."
                required
              />
            </div>
            <div className="form-group">
              <label>Rating *</label>
              <div className="rating-input">
                {renderStars(formData.rating)}
                <span className="rating-text">
                  ({formData.rating} out of 5)
                </span>
              </div>
            </div>
          </div>

          {/* Tour Association */}
          <div className="form-section">
            <h3>Tour Association</h3>
            <div className="form-group">
              <label>Related Tour</label>
              <select
                value={formData.tourId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tourId: e.target.value }))
                }
              >
                <option value="">Select a tour (optional)</option>
                {tours.map((tour) => (
                  <option key={tour._id} value={tour._id}>
                    {tour.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Settings */}
          <div className="form-section">
            <h3>Settings</h3>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        featured: e.target.checked,
                      }))
                    }
                  />
                  Featured Testimonial
                </label>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-outline-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Creating..." : "Create Testimonial"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTestimonial;
