"use client";
import React, { useState, useEffect } from "react";

interface NewsletterStats {
  total: number;
  recent: number;
  byStatus: {
    Active: number;
    Unsubscribed: number;
  };
  monthly: Array<{
    _id: {
      year: number;
      month: number;
    };
    count: number;
  }>;
}

const NewsletterStats = () => {
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/newsletter");
      const data = await response.json();
      if (data.success) {
        // Calculate stats from the data
        const subscribers = data.data;
        const total = subscribers.length;
        const active = subscribers.filter(
          (s: { status: string }) => s.status === "Active"
        ).length;
        const unsubscribed = subscribers.filter(
          (s: { status: string }) => s.status === "Unsubscribed"
        ).length;

        // Recent subscribers (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recent = subscribers.filter(
          (s: { subscribedAt: string }) =>
            new Date(s.subscribedAt) >= sevenDaysAgo
        ).length;

        // Monthly stats (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyMap = new Map();
        subscribers.forEach((s: { subscribedAt: string }) => {
          const date = new Date(s.subscribedAt);
          if (date >= sixMonthsAgo) {
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
          }
        });

        const monthly = Array.from(monthlyMap.entries())
          .map(([key, count]) => {
            const [year, month] = key.split("-").map(Number);
            return { _id: { year, month }, count };
          })
          .sort((a, b) => a._id.year - b._id.year || a._id.month - b._id.month);

        setStats({
          total,
          recent,
          byStatus: { Active: active, Unsubscribed: unsubscribed },
          monthly,
        });
      }
    } catch (error) {
      console.error("Error fetching newsletter stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month - 1];
  };

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  if (!stats) {
    return <div className="error">Failed to load statistics</div>;
  }

  return (
    <div className="newsletter-stats">
      <div className="page-header">
        <h1>Newsletter Statistics</h1>
        <p>Overview of newsletter subscription trends and performance</p>
      </div>

      {/* Main Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="bi bi-envelope-open"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Subscribers</p>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="bi bi-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.byStatus.Active}</h3>
            <p>Active Subscribers</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="bi bi-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.recent}</h3>
            <p>New This Week</p>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon">
            <i className="bi bi-x-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.byStatus.Unsubscribed}</h3>
            <p>Unsubscribed</p>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="stats-section">
        <h3>Subscription Status Distribution</h3>
        <div className="status-chart">
          <div className="status-bar">
            <div
              className="status-segment active"
              style={{
                width: `${
                  stats.total > 0
                    ? (stats.byStatus.Active / stats.total) * 100
                    : 0
                }%`,
              }}
            >
              <span>Active: {stats.byStatus.Active}</span>
            </div>
            <div
              className="status-segment unsubscribed"
              style={{
                width: `${
                  stats.total > 0
                    ? (stats.byStatus.Unsubscribed / stats.total) * 100
                    : 0
                }%`,
              }}
            >
              <span>Unsubscribed: {stats.byStatus.Unsubscribed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="stats-section">
        <h3>Monthly Subscription Trends</h3>
        <div className="monthly-chart">
          {stats.monthly.length > 0 ? (
            <div className="chart-container">
              {stats.monthly.map((month, index) => {
                const maxCount = Math.max(...stats.monthly.map((m) => m.count));
                const height =
                  maxCount > 0 ? (month.count / maxCount) * 100 : 0;

                return (
                  <div key={index} className="chart-bar">
                    <div
                      className="bar"
                      style={{ height: `${height}%` }}
                      title={`${getMonthName(month._id.month)} ${
                        month._id.year
                      }: ${month.count} subscribers`}
                    >
                      <span className="bar-value">{month.count}</span>
                    </div>
                    <div className="bar-label">
                      {getMonthName(month._id.month)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-data">
              <p>No subscription data available for the last 6 months</p>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-section">
        <h3>Key Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <h4>Conversion Rate</h4>
            <p className="metric-value">
              {stats.total > 0
                ? ((stats.byStatus.Active / stats.total) * 100).toFixed(1)
                : 0}
              %
            </p>
            <small>Active subscribers / Total subscribers</small>
          </div>
          <div className="metric-card">
            <h4>Weekly Growth</h4>
            <p className="metric-value">
              {stats.recent > 0 ? `+${stats.recent}` : 0}
            </p>
            <small>New subscribers this week</small>
          </div>
          <div className="metric-card">
            <h4>Retention Rate</h4>
            <p className="metric-value">
              {stats.total > 0
                ? ((stats.byStatus.Active / stats.total) * 100).toFixed(1)
                : 0}
              %
            </p>
            <small>Percentage of active subscribers</small>
          </div>
          <div className="metric-card">
            <h4>Unsubscribe Rate</h4>
            <p className="metric-value">
              {stats.total > 0
                ? ((stats.byStatus.Unsubscribed / stats.total) * 100).toFixed(1)
                : 0}
              %
            </p>
            <small>Percentage of unsubscribed users</small>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="stats-section">
        <h3>Recent Activity</h3>
        <div className="activity-summary">
          <div className="activity-item">
            <i className="bi bi-arrow-up text-success"></i>
            <span>New subscribers this week: {stats.recent}</span>
          </div>
          <div className="activity-item">
            <i className="bi bi-graph-up text-primary"></i>
            <span>Total active subscribers: {stats.byStatus.Active}</span>
          </div>
          <div className="activity-item">
            <i className="bi bi-calendar text-info"></i>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterStats;
