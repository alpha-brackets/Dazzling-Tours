"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  useGetBlogs,
  useUpdateBlog,
  useDeleteBlog,
  useBulkUpdateBlogs,
} from "@/lib/hooks";

const BlogsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);

  const { data: blogsData, isLoading: loading } = useGetBlogs();
  const updateBlogMutation = useUpdateBlog();
  const deleteBlogMutation = useDeleteBlog();
  const bulkUpdateBlogsMutation = useBulkUpdateBlogs();

  const blogs = blogsData?.data || [];

  const deleteBlog = (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      deleteBlogMutation.mutate(id);
    }
  };

  const toggleFeatured = (id: string, currentFeatured: boolean) => {
    updateBlogMutation.mutate({
      _id: id,
      featured: !currentFeatured,
    });
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    updateBlogMutation.mutate({
      _id: id,
      status: currentStatus === "Published" ? "Draft" : "Published",
    });
  };

  const bulkUpdateStatus = (status: string) => {
    if (selectedBlogs.length === 0) {
      alert("Please select blogs to update");
      return;
    }

    bulkUpdateBlogsMutation.mutate(
      {
        ids: selectedBlogs,
        action: "bulkUpdate",
        data: { status },
      },
      {
        onSuccess: () => {
          setSelectedBlogs([]);
        },
      }
    );
  };

  const bulkDelete = () => {
    if (selectedBlogs.length === 0) {
      alert("Please select blogs to delete");
      return;
    }

    if (
      confirm(`Are you sure you want to delete ${selectedBlogs.length} blogs?`)
    ) {
      bulkUpdateBlogsMutation.mutate(
        {
          ids: selectedBlogs,
          action: "bulkDelete",
        },
        {
          onSuccess: () => {
            setSelectedBlogs([]);
          },
        }
      );
    }
  };

  const toggleBlogSelection = (id: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(id) ? prev.filter((blogId) => blogId !== id) : [...prev, id]
    );
  };

  const selectAllBlogs = () => {
    const filteredBlogIds = filteredBlogs.map((blog) => blog._id);
    setSelectedBlogs(
      selectedBlogs.length === filteredBlogIds.length ? [] : filteredBlogIds
    );
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || blog.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || blog.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Published":
        return "status-badge success";
      case "Draft":
        return "status-badge warning";
      case "Archived":
        return "status-badge secondary";
      default:
        return "status-badge secondary";
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    const colors = [
      "badge-primary",
      "badge-secondary",
      "badge-success",
      "badge-danger",
      "badge-warning",
      "badge-info",
    ];
    const hash = category.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

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

      {/* Bulk Actions */}
      {selectedBlogs.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-info">
            <span>{selectedBlogs.length} blog(s) selected</span>
          </div>
          <div className="bulk-buttons">
            <button
              onClick={() => bulkUpdateStatus("Published")}
              className="btn btn-sm btn-success"
            >
              <i className="bi bi-check-circle"></i> Publish Selected
            </button>
            <button
              onClick={() => bulkUpdateStatus("Draft")}
              className="btn btn-sm btn-warning"
            >
              <i className="bi bi-file-text"></i> Set as Draft
            </button>
            <button
              onClick={() => bulkUpdateStatus("Archived")}
              className="btn btn-sm btn-secondary"
            >
              <i className="bi bi-archive"></i> Archive Selected
            </button>
            <button onClick={bulkDelete} className="btn btn-sm btn-danger">
              <i className="bi bi-trash"></i> Delete Selected
            </button>
          </div>
        </div>
      )}

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
          <option value="Archived">Archived</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {Array.from(new Set(blogs.map((blog) => blog.category))).map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>
      </div>

      {/* Blogs Table */}
      <div className="blogs-table">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedBlogs.length === filteredBlogs.length &&
                    filteredBlogs.length > 0
                  }
                  onChange={selectAllBlogs}
                />
              </th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr key={blog._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedBlogs.includes(blog._id)}
                    onChange={() => toggleBlogSelection(blog._id)}
                  />
                </td>
                <td>
                  <div className="blog-title">
                    <h4>{blog.title}</h4>
                    <p className="excerpt">{blog.excerpt}</p>
                    <div className="tags">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="tag-more">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="author-info">
                    <strong>{blog.author}</strong>
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${getCategoryBadgeClass(blog.category)}`}
                  >
                    {blog.category}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(blog._id, blog.status)}
                    className={`status-badge ${getStatusBadgeClass(
                      blog.status
                    )} clickable`}
                  >
                    {blog.status}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => toggleFeatured(blog._id, blog.featured)}
                    className="btn btn-sm btn-link p-0"
                  >
                    {blog.featured ? (
                      <i className="bi bi-star-fill text-warning"></i>
                    ) : (
                      <i className="bi bi-star text-muted"></i>
                    )}
                  </button>
                </td>
                <td>
                  <div className="date-info">
                    {blog.publishedAt
                      ? new Date(blog.publishedAt).toLocaleDateString()
                      : "Not published"}
                    <br />
                    <small>
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleTimeString()
                        : "Draft"}
                    </small>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link
                      href={`/admin/blogs/edit/${blog._id}`}
                      className="btn btn-sm btn-outline-primary"
                      title="Edit"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button
                      onClick={() => deleteBlog(blog._id)}
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

      {filteredBlogs.length === 0 && (
        <div className="no-data">
          <p>No blogs found</p>
        </div>
      )}

      {/* Statistics */}
      <div className="blogs-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Blogs</h4>
            <p>{blogs.length}</p>
          </div>
          <div className="stat-card">
            <h4>Published</h4>
            <p>{blogs.filter((b) => b.status === "Published").length}</p>
          </div>
          <div className="stat-card">
            <h4>Drafts</h4>
            <p>{blogs.filter((b) => b.status === "Draft").length}</p>
          </div>
          <div className="stat-card">
            <h4>Featured</h4>
            <p>{blogs.filter((b) => b.featured).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsList;
