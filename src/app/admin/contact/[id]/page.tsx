"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

const ContactQueryDetails = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const router = useRouter();
  const [query, setQuery] = useState<ContactQuery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      await fetchQueryDetails(resolvedParams.id);
    };
    fetchData();
  }, [params]);

  const fetchQueryDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`);
      const data = await response.json();
      if (data.success) {
        setQuery(data.data);
      }
    } catch (error) {
      console.error("Error fetching query details:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!query) return;

    try {
      const resolvedParams = await params;
      const response = await fetch(`/api/contact/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setQuery({ ...query, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading query details...</div>;
  }

  if (!query) {
    return <div className="error">Query not found</div>;
  }

  return (
    <div className="contact-query-details">
      <div className="page-header">
        <h1>Contact Query Details</h1>
        <div className="header-actions">
          <button
            onClick={() => router.back()}
            className="btn btn-outline-secondary"
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>
        </div>
      </div>

      <div className="query-details">
        <div className="query-header">
          <div className="query-info">
            <h2>{query.subject}</h2>
            <div className="query-meta">
              <span className="query-date">
                <i className="bi bi-calendar"></i>
                {new Date(query.createdAt).toLocaleString()}
              </span>
              <span className={`query-status ${query.status.toLowerCase()}`}>
                {query.status}
              </span>
            </div>
          </div>
          <div className="status-actions">
            <select
              value={query.status}
              onChange={(e) => updateStatus(e.target.value)}
              className="status-select"
            >
              <option value="New">New</option>
              <option value="Read">Read</option>
              <option value="Replied">Replied</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="query-content">
          <div className="contact-info-card">
            <h3>Contact Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <span>{query.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>
                  <a href={`mailto:${query.email}`}>{query.email}</a>
                </span>
              </div>
              {query.phone && (
                <div className="info-item">
                  <label>Phone:</label>
                  <span>
                    <a href={`tel:${query.phone}`}>{query.phone}</a>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="message-card">
            <h3>Message</h3>
            <div className="message-content">
              {query.message.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="query-actions">
          <a
            href={`mailto:${query.email}?subject=Re: ${query.subject}&body=Dear ${query.name},%0D%0A%0D%0AThank you for contacting Dazzling Tours.%0D%0A%0D%0A`}
            className="btn btn-primary"
          >
            <i className="bi bi-reply"></i> Reply via Email
          </a>
          <button
            onClick={() => updateStatus("Replied")}
            className="btn btn-success"
          >
            <i className="bi bi-check-circle"></i> Mark as Replied
          </button>
          <button
            onClick={() => updateStatus("Closed")}
            className="btn btn-secondary"
          >
            <i className="bi bi-x-circle"></i> Close Query
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactQueryDetails;
