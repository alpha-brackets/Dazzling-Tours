"use client";
import React, { useState } from "react";
import {
  useGetNewsletterSubscribers,
  useUpdateNewsletterSubscription,
  useBulkUpdateNewsletter,
} from "@/lib/hooks";

const NewsletterList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Active");
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);

  const { data: subscribersData, isLoading: loading } =
    useGetNewsletterSubscribers();
  const updateNewsletterMutation = useUpdateNewsletterSubscription();
  const bulkUpdateNewsletterMutation = useBulkUpdateNewsletter();

  const subscribers = subscribersData?.data || [];

  const updateSubscriberStatus = (email: string, status: string) => {
    updateNewsletterMutation.mutate({
      email,
      status,
    });
  };

  const bulkUpdateStatus = (status: string) => {
    if (selectedSubscribers.length === 0) {
      alert("Please select subscribers to update");
      return;
    }

    bulkUpdateNewsletterMutation.mutate(
      {
        emails: selectedSubscribers,
        action: "updateStatus",
        data: { status },
      },
      {
        onSuccess: () => {
          setSelectedSubscribers([]);
        },
      }
    );
  };

  const toggleSubscriberSelection = (email: string) => {
    setSelectedSubscribers((prev) =>
      prev.includes(email)
        ? prev.filter((subEmail) => subEmail !== email)
        : [...prev, email]
    );
  };

  const selectAllSubscribers = () => {
    const filteredEmails = filteredSubscribers.map(
      (subscriber) => subscriber.email
    );
    setSelectedSubscribers(
      selectedSubscribers.length === filteredEmails.length ? [] : filteredEmails
    );
  };

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch = subscriber.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || subscriber.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active":
        return "status-badge success";
      case "Unsubscribed":
        return "status-badge danger";
      default:
        return "status-badge secondary";
    }
  };

  if (loading) {
    return <div className="loading">Loading subscribers...</div>;
  }

  return (
    <div className="newsletter-list">
      <div className="page-header">
        <h1>Newsletter Subscribers</h1>
        <div className="header-actions">
          <button
            onClick={() => bulkUpdateStatus("Active")}
            className="btn btn-success"
            disabled={selectedSubscribers.length === 0}
          >
            <i className="bi bi-check-circle"></i> Activate Selected
          </button>
          <button
            onClick={() => bulkUpdateStatus("Unsubscribed")}
            className="btn btn-warning"
            disabled={selectedSubscribers.length === 0}
          >
            <i className="bi bi-x-circle"></i> Unsubscribe Selected
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search subscribers..."
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
          <option value="Unsubscribed">Unsubscribed</option>
        </select>
      </div>

      {/* Subscribers Table */}
      <div className="subscribers-table">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedSubscribers.length === filteredSubscribers.length &&
                    filteredSubscribers.length > 0
                  }
                  onChange={selectAllSubscribers}
                />
              </th>
              <th>Email</th>
              <th>Status</th>
              <th>Subscribed Date</th>
              <th>Unsubscribed Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscribers.map((subscriber) => (
              <tr key={subscriber._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.includes(subscriber.email)}
                    onChange={() => toggleSubscriberSelection(subscriber.email)}
                  />
                </td>
                <td>
                  <div className="email-info">
                    <strong>{subscriber.email}</strong>
                  </div>
                </td>
                <td>
                  <span className={getStatusBadgeClass(subscriber.status)}>
                    {subscriber.status}
                  </span>
                </td>
                <td>
                  <div className="date-info">
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    <br />
                    <small>
                      {new Date(subscriber.subscribedAt).toLocaleTimeString()}
                    </small>
                  </div>
                </td>
                <td>
                  {subscriber.unsubscribedAt ? (
                    <div className="date-info">
                      {new Date(subscriber.unsubscribedAt).toLocaleDateString()}
                      <br />
                      <small>
                        {new Date(
                          subscriber.unsubscribedAt
                        ).toLocaleTimeString()}
                      </small>
                    </div>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {subscriber.status === "Unsubscribed" && (
                      <button
                        onClick={() =>
                          updateSubscriberStatus(subscriber.email, "Active")
                        }
                        className="btn btn-sm btn-outline-success"
                        title="Reactivate"
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                    )}
                    {subscriber.status === "Active" && (
                      <button
                        onClick={() =>
                          updateSubscriberStatus(
                            subscriber.email,
                            "Unsubscribed"
                          )
                        }
                        className="btn btn-sm btn-outline-warning"
                        title="Unsubscribe"
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSubscribers.length === 0 && (
        <div className="no-data">
          <p>No subscribers found</p>
        </div>
      )}

      {/* Statistics */}
      <div className="newsletter-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Subscribers</h4>
            <p>{subscribers.length}</p>
          </div>
          <div className="stat-card">
            <h4>Active</h4>
            <p>{subscribers.filter((s) => s.status === "Active").length}</p>
          </div>
          <div className="stat-card">
            <h4>Unsubscribed</h4>
            <p>
              {subscribers.filter((s) => s.status === "Unsubscribed").length}
            </p>
          </div>
          <div className="stat-card">
            <h4>This Month</h4>
            <p>
              {
                subscribers.filter((s) => {
                  const subDate = new Date(s.subscribedAt);
                  const now = new Date();
                  return (
                    subDate.getMonth() === now.getMonth() &&
                    subDate.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterList;
