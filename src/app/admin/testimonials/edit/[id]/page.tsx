"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Testimonial {
  _id: string;
  name: string;
  designation: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
  location?: string;
  tourId?: {
    _id: string;
    title: string;
  };
  status: string;
  featured: boolean;
}

interface Tour {
  _id: string;
  title: string;
}

const EditTestimonial = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const fetchTestimonial = useCallback(async () => {
    try {
      const response = await fetch(`/api/testimonials/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setTestimonial(data.data);
        setFormData({
          name: data.data.name,
          designation: data.data.designation,
          company: data.data.company || "",
          content: data.data.content,
          rating: data.data.rating,
          image: data.data.image || "",
          location: data.data.location || "",
          tourId: data.data.tourId?._id || "",
          status: data.data.status,
          featured: data.data.featured,
        });
      }
    } catch (error) {
      console.error("Error fetching testimonial:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const fetchTours = useCallback(async () => {
    try {
      const response = await fetch("/api/tours");
      const data = await response.json();
      if (data.success) {
        setTours(data.data);
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  }, []);

  useEffect(() => {
    fetchTestimonial();
    fetchTours();
  }, [fetchTestimonial, fetchTours]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/testimonials/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/testimonials");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update testimonial");
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      alert("Failed to update testimonial");
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

  if (loading) {
    return <div className="loading">Loading testimonial...</div>;
  }

  if (!testimonial) {
    return <div className="error">Testimonial not found</div>;
  }

  return (
    <div className="edit-testimonial">
      <div className="page-header">
        <h1>Edit Testimonial</h1>
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
            {saving ? "Updating..." : "Update Testimonial"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTestimonial;
