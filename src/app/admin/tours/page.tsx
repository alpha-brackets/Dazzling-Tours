"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Tour {
  _id: string;
  title: string;
  price: number;
  duration: string;
  location: string;
  category: string;
  status: string;
  featured: boolean;
  createdAt: string;
}

const ToursList = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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
    } finally {
      setLoading(false);
    }
  };

  const deleteTour = async (id: string) => {
    if (confirm("Are you sure you want to delete this tour?")) {
      try {
        const response = await fetch(`/api/tours/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setTours(tours.filter((tour) => tour._id !== id));
        }
      } catch (error) {
        console.error("Error deleting tour:", error);
      }
    }
  };

  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || tour.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading tours...</div>;
  }

  return (
    <div className="tours-list">
      <div className="page-header">
        <h1>Tours Management</h1>
        <Link href="/admin/tours/add" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Add New Tour
        </Link>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tours..."
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
      </div>

      {/* Tours Table */}
      <div className="tours-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Category</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTours.map((tour) => (
              <tr key={tour._id}>
                <td>{tour.title}</td>
                <td>{tour.location}</td>
                <td>${tour.price}</td>
                <td>{tour.duration}</td>
                <td>{tour.category}</td>
                <td>
                  <span className={`status-badge ${tour.status.toLowerCase()}`}>
                    {tour.status}
                  </span>
                </td>
                <td>
                  {tour.featured ? (
                    <i className="bi bi-star-fill text-warning"></i>
                  ) : (
                    <i className="bi bi-star text-muted"></i>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <Link
                      href={`/admin/tours/edit/${tour._id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <Link
                      href={`/tours/${tour._id}`}
                      className="btn btn-sm btn-outline-info"
                      target="_blank"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>
                    <button
                      onClick={() => deleteTour(tour._id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTours.length === 0 && (
        <div className="no-data">
          <p>No tours found</p>
        </div>
      )}
    </div>
  );
};

export default ToursList;
