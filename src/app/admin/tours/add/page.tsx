"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AddTour = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    price: "",
    duration: "",
    location: "",
    category: "",
    images: [] as string[],
    highlights: [] as string[],
    itinerary: [] as Array<{ day: number; title: string; description: string }>,
    includes: [] as string[],
    excludes: [] as string[],
    difficulty: "Easy",
    groupSize: "",
    rating: "",
    reviews: "",
    featured: false,
    status: "Active",
  });

  const [newHighlight, setNewHighlight] = useState("");
  const [newInclude, setNewInclude] = useState("");
  const [newExclude, setNewExclude] = useState("");
  const [newItineraryDay, setNewItineraryDay] = useState({
    day: "",
    title: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setFormData((prev) => ({
        ...prev,
        includes: [...prev.includes, newInclude.trim()],
      }));
      setNewInclude("");
    }
  };

  const removeInclude = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index),
    }));
  };

  const addExclude = () => {
    if (newExclude.trim()) {
      setFormData((prev) => ({
        ...prev,
        excludes: [...prev.excludes, newExclude.trim()],
      }));
      setNewExclude("");
    }
  };

  const removeExclude = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      excludes: prev.excludes.filter((_, i) => i !== index),
    }));
  };

  const addItineraryDay = () => {
    if (
      newItineraryDay.day &&
      newItineraryDay.title &&
      newItineraryDay.description
    ) {
      setFormData((prev) => ({
        ...prev,
        itinerary: [
          ...prev.itinerary,
          {
            day: parseInt(newItineraryDay.day),
            title: newItineraryDay.title,
            description: newItineraryDay.description,
          },
        ],
      }));
      setNewItineraryDay({ day: "", title: "", description: "" });
    }
  };

  const removeItineraryDay = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/tours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/tours");
      } else {
        console.error("Error creating tour");
      }
    } catch (error) {
      console.error("Error creating tour:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-tour">
      <div className="page-header">
        <h1>Add New Tour</h1>
        <button
          onClick={() => router.back()}
          className="btn btn-outline-secondary"
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="tour-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Duration *</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 3 days"
                required
              />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Adventure">Adventure</option>
                <option value="Cultural">Cultural</option>
                <option value="City Tour">City Tour</option>
                <option value="Beach">Beach</option>
                <option value="Mountain">Mountain</option>
              </select>
            </div>
            <div className="form-group">
              <label>Group Size</label>
              <input
                type="number"
                name="groupSize"
                value={formData.groupSize}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Descriptions</h3>
          <div className="form-group">
            <label>Short Description *</label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>
          <div className="form-group">
            <label>Full Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Highlights</h3>
          <div className="list-manager">
            <div className="add-item">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="Add highlight"
              />
              <button type="button" onClick={addHighlight}>
                <i className="bi bi-plus"></i>
              </button>
            </div>
            <div className="item-list">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="item">
                  <span>{highlight}</span>
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="btn-remove"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Itinerary</h3>
          <div className="list-manager">
            <div className="add-item itinerary-form">
              <input
                type="number"
                value={newItineraryDay.day}
                onChange={(e) =>
                  setNewItineraryDay((prev) => ({
                    ...prev,
                    day: e.target.value,
                  }))
                }
                placeholder="Day"
                min="1"
              />
              <input
                type="text"
                value={newItineraryDay.title}
                onChange={(e) =>
                  setNewItineraryDay((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Title"
              />
              <textarea
                value={newItineraryDay.description}
                onChange={(e) =>
                  setNewItineraryDay((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description"
                rows={2}
              />
              <button type="button" onClick={addItineraryDay}>
                <i className="bi bi-plus"></i>
              </button>
            </div>
            <div className="item-list">
              {formData.itinerary.map((day, index) => (
                <div key={index} className="item itinerary-item">
                  <div className="itinerary-content">
                    <strong>
                      Day {day.day}: {day.title}
                    </strong>
                    <p>{day.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItineraryDay(index)}
                    className="btn-remove"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Includes</h3>
          <div className="list-manager">
            <div className="add-item">
              <input
                type="text"
                value={newInclude}
                onChange={(e) => setNewInclude(e.target.value)}
                placeholder="Add inclusion"
              />
              <button type="button" onClick={addInclude}>
                <i className="bi bi-plus"></i>
              </button>
            </div>
            <div className="item-list">
              {formData.includes.map((include, index) => (
                <div key={index} className="item">
                  <span>{include}</span>
                  <button
                    type="button"
                    onClick={() => removeInclude(index)}
                    className="btn-remove"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Excludes</h3>
          <div className="list-manager">
            <div className="add-item">
              <input
                type="text"
                value={newExclude}
                onChange={(e) => setNewExclude(e.target.value)}
                placeholder="Add exclusion"
              />
              <button type="button" onClick={addExclude}>
                <i className="bi bi-plus"></i>
              </button>
            </div>
            <div className="item-list">
              {formData.excludes.map((exclude, index) => (
                <div key={index} className="item">
                  <span>{exclude}</span>
                  <button
                    type="button"
                    onClick={() => removeExclude(index)}
                    className="btn-remove"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Options</h3>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              Featured Tour
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Tour"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-outline-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTour;
