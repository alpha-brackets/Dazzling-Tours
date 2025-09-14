"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  status: string;
  publishedAt: string;
  createdAt: string;
}

const BlogsList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await fetch(`/api/blogs/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setBlogs(blogs.filter((blog) => blog._id !== id));
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || blog.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  return (
    <div className="blogs-list">
      <div className="page-header">
        <h1>Blogs Management</h1>
        <Link href="/admin/blogs/add" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Add New Blog
        </Link>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search blogs..."
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
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Blogs Table */}
      <div className="blogs-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr key={blog._id}>
                <td>
                  <div className="blog-title">
                    <strong>{blog.title}</strong>
                    <p className="excerpt">{blog.excerpt}</p>
                  </div>
                </td>
                <td>{blog.author}</td>
                <td>{blog.category}</td>
                <td>
                  <span className={`status-badge ${blog.status.toLowerCase()}`}>
                    {blog.status}
                  </span>
                </td>
                <td>{new Date(blog.publishedAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <Link
                      href={`/admin/blogs/edit/${blog._id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <Link
                      href={`/blogs/${blog._id}`}
                      className="btn btn-sm btn-outline-info"
                      target="_blank"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>
                    <button
                      onClick={() => deleteBlog(blog._id)}
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

      {filteredBlogs.length === 0 && (
        <div className="no-data">
          <p>No blogs found</p>
        </div>
      )}
    </div>
  );
};

export default BlogsList;
