"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  useGetContactInquiries,
  useUpdateContactInquiry,
  useBulkUpdateContactInquiries,
} from "@/lib/hooks";

const ContactQueriesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedQueries, setSelectedQueries] = useState<string[]>([]);

  const { data: queriesData, isLoading: loading } = useGetContactInquiries();
  const updateContactMutation = useUpdateContactInquiry();
  const bulkUpdateContactMutation = useBulkUpdateContactInquiries();

  const queries = queriesData?.data || [];

  const updateStatus = (id: string, newStatus: string) => {
    updateContactMutation.mutate({
      _id: id,
      status: newStatus,
    });
  };

  const bulkUpdateStatus = (status: string) => {
    if (selectedQueries.length === 0) {
      alert("Please select queries to update");
      return;
    }

    bulkUpdateContactMutation.mutate(
      {
        ids: selectedQueries,
        action: "updateStatus",
        data: { status },
      },
      {
        onSuccess: () => {
          setSelectedQueries([]);
        },
      }
    );
  };

  const bulkDelete = () => {
    if (selectedQueries.length === 0) {
      alert("Please select queries to delete");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${selectedQueries.length} queries?`
      )
    ) {
      bulkUpdateContactMutation.mutate(
        {
          ids: selectedQueries,
          action: "delete",
        },
        {
          onSuccess: () => {
            setSelectedQueries([]);
          },
        }
      );
    }
  };

  const toggleQuerySelection = (id: string) => {
    setSelectedQueries((prev) =>
      prev.includes(id)
        ? prev.filter((queryId) => queryId !== id)
        : [...prev, id]
    );
  };

  const selectAllQueries = () => {
    const filteredQueryIds = filteredQueries.map((query) => query._id);
    setSelectedQueries(
      selectedQueries.length === filteredQueryIds.length ? [] : filteredQueryIds
    );
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
        <div className="header-actions">
          <button
            onClick={() => bulkUpdateStatus("Read")}
            className="btn btn-info"
            disabled={selectedQueries.length === 0}
          >
            <i className="bi bi-eye"></i> Mark as Read
          </button>
          <button
            onClick={() => bulkUpdateStatus("Replied")}
            className="btn btn-success"
            disabled={selectedQueries.length === 0}
          >
            <i className="bi bi-reply"></i> Mark as Replied
          </button>
          <button
            onClick={() => bulkUpdateStatus("Closed")}
            className="btn btn-warning"
            disabled={selectedQueries.length === 0}
          >
            <i className="bi bi-check-circle"></i> Mark as Closed
          </button>
          <button
            onClick={bulkDelete}
            className="btn btn-danger"
            disabled={selectedQueries.length === 0}
          >
            <i className="bi bi-trash"></i> Delete Selected
          </button>
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
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedQueries.length === filteredQueries.length &&
                    filteredQueries.length > 0
                  }
                  onChange={selectAllQueries}
                />
              </th>
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
                  <input
                    type="checkbox"
                    checked={selectedQueries.includes(query._id)}
                    onChange={() => toggleQuerySelection(query._id)}
                  />
                </td>
                <td>
                  <div className="contact-info">
                    <strong>{query.name}</strong>
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

      {/* Statistics */}
      <div className="contact-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Queries</h4>
            <p>{queries.length}</p>
          </div>
          <div className="stat-card">
            <h4>New</h4>
            <p>{queries.filter((q) => q.status === "New").length}</p>
          </div>
          <div className="stat-card">
            <h4>Read</h4>
            <p>{queries.filter((q) => q.status === "Read").length}</p>
          </div>
          <div className="stat-card">
            <h4>Replied</h4>
            <p>{queries.filter((q) => q.status === "Replied").length}</p>
          </div>
          <div className="stat-card">
            <h4>Closed</h4>
            <p>{queries.filter((q) => q.status === "Closed").length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactQueriesList;
