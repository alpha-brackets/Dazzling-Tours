"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UpdateTourData } from "@/lib/types/tour";
import { useGetTour, useUpdateTour, useNotification } from "@/lib/hooks";
import { TourStatus, TOUR_STATUS_OPTIONS } from "@/lib/enums";

const EditTour = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { data, isLoading } = useGetTour(params.id);
  const updateTourMutation = useUpdateTour();
  const { showSuccess, showError } = useNotification();

  const tour = data?.data;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    price: 0,
    duration: "",
    location: "",
    category: "",
    images: [] as string[],
    highlights: [] as string[],
    itinerary: [] as Array<{ day: number; title: string; description: string }>,
    includes: [] as string[],
    excludes: [] as string[],
    difficulty: "Easy",
    groupSize: 10,
    rating: 0,
    reviews: 0,
    featured: false,
    status: TourStatus.ACTIVE,
  });

  useEffect(() => {
    if (tour) {
      setFormData(tour);
    }
  }, [tour]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateData: UpdateTourData = {
      _id: params.id,
      ...formData,
    };

    updateTourMutation.mutate(updateData, {
      onSuccess: () => {
        showSuccess("Tour updated successfully!");
        router.push("/admin/tours");
      },
      onError: (error) => {
        showError(error.message || "Failed to update tour");
      },
    });
  };

  const addArrayItem = (field: string, value: string) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [
          ...(prev[field as keyof typeof prev] as string[]),
          value.trim(),
        ],
      }));
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addItineraryDay = () => {
    const newDay = {
      day: formData.itinerary.length + 1,
      title: "",
      description: "",
    };
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay],
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return <div className="loading">Loading tour...</div>;
  }

  if (!tour) {
    return <div className="error">Tour not found</div>;
  }

  return (
    <div className="edit-tour">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Edit Tour</h1>
            <p className="page-description">Update tour details and settings</p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => router.back()}
              className="btn btn-outline-secondary"
            >
              <i className="bi bi-arrow-left"></i> Back
            </button>
          </div>
        </div>
      </div>

      <div className="form-container">
        <form id="edit-tour-form" onSubmit={handleSubmit} className="tour-form">
          <div className="form-grid">
            <div className="form-section">
              <div className="section-header">
                <h3>
                  <i className="bi bi-info-circle"></i> Basic Information
                </h3>
                <p className="section-description">
                  Essential details about your tour package
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="shortDescription">Short Description *</label>
                <p className="field-help">
                  Brief overview (2-3 sentences) that appears in tour listings
                </p>
                <textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      shortDescription: e.target.value,
                    }))
                  }
                  rows={3}
                  required
                />
                <div className="char-count">
                  {formData.shortDescription.length}/200 characters
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="description">Full Description *</label>
                <p className="field-help">
                  Detailed description that appears on the tour details page
                </p>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={6}
                  required
                />
                <div className="char-count">
                  {formData.description.length}/1000 characters
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h3>
                  <i className="bi bi-geo-alt"></i> Tour Details
                </h3>
                <p className="section-description">
                  Pricing, location, and tour specifications
                </p>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="price">Price (USD) *</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: Number(e.target.value),
                        }))
                      }
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="duration">Duration *</label>
                  <input
                    id="duration"
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    placeholder="e.g., 3 days, 1 week"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Relaxation">Relaxation</option>
                    <option value="City Tour">City Tour</option>
                    <option value="Nature">Nature</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty Level</label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        difficulty: e.target.value,
                      }))
                    }
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="groupSize">Group Size</label>
                  <input
                    id="groupSize"
                    type="number"
                    value={formData.groupSize}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        groupSize: Number(e.target.value),
                      }))
                    }
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h3>
                  <i className="bi bi-star"></i> Highlights
                </h3>
                <p className="section-description">
                  Add key features and attractions that make this tour special
                </p>
              </div>
              <div className="list-manager">
                <div className="add-item">
                  <input
                    type="text"
                    placeholder="Add highlight"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArrayItem("highlights", e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget
                        .previousElementSibling as HTMLInputElement;
                      addArrayItem("highlights", input.value);
                      input.value = "";
                    }}
                    className="btn-add"
                  >
                    <i className="bi bi-plus"></i> Add
                  </button>
                </div>
                <div className="item-list">
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="item">
                      <span>{highlight}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem("highlights", index)}
                        className="btn-remove"
                        title="Remove highlight"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ))}
                  {formData.highlights.length === 0 && (
                    <div className="empty-state">
                      <i className="bi bi-star"></i>
                      <p>No highlights added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h3>
                  <i className="bi bi-calendar-check"></i> Itinerary
                </h3>
                <p className="section-description">
                  Create a detailed day-by-day schedule for your tour
                </p>
              </div>
              <div className="list-manager">
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="btn-add mb-3"
                >
                  <i className="bi bi-plus"></i> Add Day
                </button>
                <div className="item-list">
                  {formData.itinerary.map((day, index) => (
                    <div key={index} className="item itinerary-item">
                      <div className="itinerary-content">
                        <div className="day-header">
                          <span className="day-number">Day {day.day}</span>
                          <h4 className="day-title">{day.title}</h4>
                        </div>
                        <p className="day-description">{day.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(index)}
                        className="btn-remove"
                        title="Remove day"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))}
                  {formData.itinerary.length === 0 && (
                    <div className="empty-state">
                      <i className="bi bi-calendar-check"></i>
                      <p>No itinerary days added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h3>
                  <i className="bi bi-list-check"></i> Includes & Excludes
                </h3>
                <p className="section-description">
                  Define what&apos;s included and excluded in the tour price
                </p>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Includes</label>
                  <div className="list-manager">
                    <div className="add-item">
                      <input
                        type="text"
                        placeholder="Add include item"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem("includes", e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget
                            .previousElementSibling as HTMLInputElement;
                          addArrayItem("includes", input.value);
                          input.value = "";
                        }}
                        className="btn-add"
                      >
                        <i className="bi bi-plus"></i> Add
                      </button>
                    </div>
                    <div className="item-list">
                      {formData.includes.map((item, index) => (
                        <div key={index} className="item">
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem("includes", index)}
                            className="btn-remove"
                            title="Remove include"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                      {formData.includes.length === 0 && (
                        <div className="empty-state">
                          <i className="bi bi-check-circle"></i>
                          <p>No includes added yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Excludes</label>
                  <div className="list-manager">
                    <div className="add-item">
                      <input
                        type="text"
                        placeholder="Add exclude item"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem("excludes", e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget
                            .previousElementSibling as HTMLInputElement;
                          addArrayItem("excludes", input.value);
                          input.value = "";
                        }}
                        className="btn-add"
                      >
                        <i className="bi bi-plus"></i> Add
                      </button>
                    </div>
                    <div className="item-list">
                      {formData.excludes.map((item, index) => (
                        <div key={index} className="item">
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem("excludes", index)}
                            className="btn-remove"
                            title="Remove exclude"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                      {formData.excludes.length === 0 && (
                        <div className="empty-state">
                          <i className="bi bi-x-circle"></i>
                          <p>No excludes added yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h3>
                  <i className="bi bi-gear"></i> Settings
                </h3>
                <p className="section-description">
                  Configure additional tour settings and status
                </p>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="rating">Rating</label>
                  <input
                    id="rating"
                    type="number"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rating: Number(e.target.value),
                      }))
                    }
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reviews">Reviews Count</label>
                  <input
                    id="reviews"
                    type="number"
                    value={formData.reviews}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reviews: Number(e.target.value),
                      }))
                    }
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as TourStatus,
                      }))
                    }
                  >
                    {TOUR_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
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
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">
                      <strong>Featured Tour</strong>
                      <small>
                        Display this tour prominently on the homepage
                      </small>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <div className="actions-container">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-outline-secondary"
              >
                <i className="bi bi-arrow-left"></i> Cancel
              </button>
              <button
                type="submit"
                disabled={updateTourMutation.isPending}
                className="btn btn-primary"
              >
                {updateTourMutation.isPending ? (
                  <>
                    <i className="bi bi-hourglass-split"></i> Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg"></i> Update Tour
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTour;
