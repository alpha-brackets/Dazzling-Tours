"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  status: string;
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const EditBlog = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    author: "",
    category: "",
    tags: [] as string[],
    featuredImage: "",
    status: "Draft",
    featured: false,
  });

  const fetchBlog = useCallback(async () => {
    try {
      const response = await fetch(`/api/blogs/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setBlog(data.data);
        setFormData({
          title: data.data.title,
          slug: data.data.slug,
          content: data.data.content,
          excerpt: data.data.excerpt,
          author: data.data.author,
          category: data.data.category,
          tags: data.data.tags || [],
          featuredImage: data.data.featuredImage || "",
          status: data.data.status,
          featured: data.data.featured,
        });
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/blogs");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  const addTag = (value: string) => {
    if (value.trim() && !formData.tags.includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, value.trim()],
      }));
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  if (loading) {
    return <div className="loading">Loading blog...</div>;
  }

  if (!blog) {
    return <div className="error">Blog not found</div>;
  }

  return (
    <div className="edit-blog">
      <div className="page-header">
        <h1>Edit Blog</h1>
        <button
          onClick={() => router.back()}
          className="btn btn-outline-secondary"
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-grid">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Author *</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, author: e.target.value }))
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                required
              >
                <option value="">Select Category</option>
                <option value="Travel">Travel</option>
                <option value="Adventure">Adventure</option>
                <option value="Culture">Culture</option>
                <option value="Food">Food</option>
                <option value="Photography">Photography</option>
                <option value="Tips">Tips</option>
                <option value="News">News</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="form-section">
            <h3>Content</h3>
            <div className="form-group">
              <label>Excerpt *</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                rows={3}
                placeholder="Brief description of the blog post..."
                required
              />
            </div>
            <div className="form-group">
              <label>Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={12}
                placeholder="Write your blog content here..."
                required
              />
            </div>
          </div>

          {/* Tags */}
          <div className="form-section">
            <h3>Tags</h3>
            <div className="form-group">
              <label>Add Tags</label>
              <div className="tag-input">
                <input
                  type="text"
                  placeholder="Add a tag and press Enter"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    addTag(input.value);
                    input.value = "";
                  }}
                  className="btn btn-sm btn-outline-primary"
                >
                  Add
                </button>
              </div>
              <div className="tags-list">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="tag-item">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Media & Settings */}
          <div className="form-section">
            <h3>Media & Settings</h3>
            <div className="form-group">
              <label>Featured Image URL</label>
              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    featuredImage: e.target.value,
                  }))
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        featured: e.target.checked,
                      }))
                    }
                  />
                  Featured Blog
                </label>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-outline-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
