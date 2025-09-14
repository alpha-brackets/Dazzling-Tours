import React from "react";
import Link from "next/link";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Tours", value: "12", icon: "bi bi-map", color: "primary" },
    {
      title: "Total Bookings",
      value: "45",
      icon: "bi bi-calendar-check",
      color: "success",
    },
    {
      title: "Total Blogs",
      value: "8",
      icon: "bi bi-journal-text",
      color: "info",
    },
    {
      title: "Contact Queries",
      value: "23",
      icon: "bi bi-envelope",
      color: "warning",
    },
  ];

  const recentActivities = [
    {
      type: "booking",
      message: "New booking for Paris Tour",
      time: "2 hours ago",
    },
    {
      type: "contact",
      message: "New contact query received",
      time: "4 hours ago",
    },
    { type: "blog", message: "New blog post published", time: "1 day ago" },
    { type: "tour", message: "Tour updated: Kenya Safari", time: "2 days ago" },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to Dazzling Tours CMS</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">
              <i className={stat.icon}></i>
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link href="/admin/tours/add" className="btn btn-primary">
            <i className="bi bi-plus-circle"></i> Add New Tour
          </Link>
          <Link href="/admin/blogs/add" className="btn btn-success">
            <i className="bi bi-plus-circle"></i> Add New Blog
          </Link>
          <Link href="/admin/tours/bookings" className="btn btn-info">
            <i className="bi bi-calendar-check"></i> View Bookings
          </Link>
          <Link href="/admin/contact" className="btn btn-warning">
            <i className="bi bi-envelope"></i> Contact Queries
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities">
        <h2>Recent Activities</h2>
        <div className="activity-list">
          {recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                <i
                  className={`bi bi-${
                    activity.type === "booking"
                      ? "calendar-check"
                      : activity.type === "contact"
                      ? "envelope"
                      : activity.type === "blog"
                      ? "journal-text"
                      : "map"
                  }`}
                ></i>
              </div>
              <div className="activity-content">
                <p>{activity.message}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
