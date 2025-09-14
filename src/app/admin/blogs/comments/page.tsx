"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Comment {
  _id: string;
  blogId: string;
  blogTitle: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

const CommentsList = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      // For now, we'll use mock data since we don't have a comments API yet
      // You can replace this with actual API call when you implement comments
      const mockComments: Comment[] = [
        {
          _id: "1",
          blogId: "blog1",
          blogTitle: "Amazing Travel Destinations",
          name: "John Doe",
          email: "john@example.com",
          message:
            "Great article! I really enjoyed reading about these destinations.",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          blogId: "blog2",
          blogTitle: "Travel Tips for Beginners",
          name: "Jane Smith",
          email: "jane@example.com",
          message: "Very helpful tips for someone new to traveling.",
          status: "approved",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "3",
          blogId: "blog1",
          blogTitle: "Amazing Travel Destinations",
          name: "Mike Johnson",
          email: "mike@example.com",
          message:
            "I've been to some of these places and can confirm they're amazing!",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ];

      setComments(mockComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCommentStatus = async (id: string, status: string) => {
    try {
      // Update comment status logic here
      setComments(
        comments.map((comment) =>
          comment._id === id ? { ...comment, status } : comment
        )
      );
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const deleteComment = async (id: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        // Delete comment logic here
        setComments(comments.filter((comment) => comment._id !== id));
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.blogTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || comment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading comments...</div>;
  }

  return (
    <div className="comments-list">
      <div className="page-header">
        <h1>Blog Comments Management</h1>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{comments.length}</span>
            <span className="stat-label">Total Comments</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {comments.filter((c) => c.status === "pending").length}
            </span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {comments.filter((c) => c.status === "approved").length}
            </span>
            <span className="stat-label">Approved</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search comments..."
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Comments Table */}
      <div className="comments-table">
        <table>
          <thead>
            <tr>
              <th>Comment</th>
              <th>Blog Post</th>
              <th>Author</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.map((comment) => (
              <tr key={comment._id}>
                <td>
                  <div className="comment-content">
                    <p className="comment-message">{comment.message}</p>
                    <small className="comment-email">{comment.email}</small>
                  </div>
                </td>
                <td>
                  <Link href={`/blogs/${comment.blogId}`} className="blog-link">
                    {comment.blogTitle}
                  </Link>
                </td>
                <td>{comment.name}</td>
                <td>
                  <span className={`status-badge ${comment.status}`}>
                    {comment.status}
                  </span>
                </td>
                <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    {comment.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateCommentStatus(comment._id, "approved")
                          }
                          className="btn btn-sm btn-outline-success"
                          title="Approve"
                        >
                          <i className="bi bi-check"></i>
                        </button>
                        <button
                          onClick={() =>
                            updateCommentStatus(comment._id, "rejected")
                          }
                          className="btn btn-sm btn-outline-warning"
                          title="Reject"
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </>
                    )}
                    {comment.status === "approved" && (
                      <button
                        onClick={() =>
                          updateCommentStatus(comment._id, "pending")
                        }
                        className="btn btn-sm btn-outline-secondary"
                        title="Mark as Pending"
                      >
                        <i className="bi bi-clock"></i>
                      </button>
                    )}
                    <button
                      onClick={() => deleteComment(comment._id)}
                      className="btn btn-sm btn-outline-danger"
                      title="Delete"
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

      {filteredComments.length === 0 && (
        <div className="no-data">
          <p>No comments found</p>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
