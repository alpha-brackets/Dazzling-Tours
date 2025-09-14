"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ContactQuery {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const ContactQueriesList = () => {
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await fetch("/api/contact");
      const data = await response.json();
      if (data.success) {
        setQueries(data.data);
      }
    } catch (error) {
      console.error("Error fetching contact queries:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setQueries(
          queries.map((query) =>
            query._id === id ? { ...query, status: newStatus } : query
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || query.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading contact queries...</div>;
  }

  return (
    <div className="contact-queries-list">
      <div className="page-header">
        <h1>Contact Queries</h1>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{queries.length}</span>
            <span className="stat-label">Total Queries</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {queries.filter((q) => q.status === "New").length}
            </span>
            <span className="stat-label">New</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search queries..."
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
          <option value="New">New</option>
          <option value="Read">Read</option>
          <option value="Replied">Replied</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Queries Table */}
      <div className="queries-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueries.map((query) => (
              <tr key={query._id}>
                <td>
                  <div className="contact-info">
                    <strong>{query.name}</strong>
                    {query.phone && <small>{query.phone}</small>}
                  </div>
                </td>
                <td>{query.email}</td>
                <td>{query.subject}</td>
                <td>
                  <select
                    value={query.status}
                    onChange={(e) => updateStatus(query._id, e.target.value)}
                    className={`status-select ${query.status.toLowerCase()}`}
                  >
                    <option value="New">New</option>
                    <option value="Read">Read</option>
                    <option value="Replied">Replied</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td>{new Date(query.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <Link
                      href={`/admin/contact/${query._id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-eye"></i> View
                    </Link>
                    <a
                      href={`mailto:${query.email}?subject=Re: ${query.subject}`}
                      className="btn btn-sm btn-outline-success"
                    >
                      <i className="bi bi-reply"></i> Reply
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredQueries.length === 0 && (
        <div className="no-data">
          <p>No contact queries found</p>
        </div>
      )}
    </div>
  );
};

export default ContactQueriesList;
