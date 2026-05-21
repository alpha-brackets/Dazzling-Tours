"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useGetBlogs,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
  useNotification,
  useGetCategories,
  useAuth,
} from "@/lib/hooks";
import { useRouter } from "next/navigation";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { TextInput, Select } from "@/app/Components/Form";
import {
  Stack,
  Page,
  ConfirmModal,
  Table,
  Title,
  Text,
} from "@/app/Components/Common";
import { Button } from "@/components/ui/button";
import { UNCATEGORIZED_CATEGORY_NAME } from "@/lib/constants/categories";
import { BlogStatus } from "@/lib/enums/blog";
import { PlusCircle, FileText, CheckCircle, File, Star, ImageIcon, Pencil, Trash, Inbox } from "lucide-react";

const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  pink: { bg: "bg-pink-50", text: "text-pink-600" },
};

const statusColorMap = {
  [BlogStatus.PUBLISHED]: "text-green-600 border-green-600 hover:bg-green-50",
  [BlogStatus.DRAFT]: "text-amber-600 border-amber-600 hover:bg-amber-50",
};

const categoryColorMap = {
  primary: "bg-blue-50 text-blue-700 border-blue-200",
  secondary: "bg-gray-50 text-gray-700 border-gray-200",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  error: "bg-red-50 text-red-700 border-red-200",
  blue: "bg-sky-50 text-sky-700 border-sky-200",
};

const BlogsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const { data: blogsData, isLoading: loading } = useGetBlogs({
    page: currentPage,
    limit: pageSize,
    status: filterStatus === "all" ? undefined : filterStatus,
    category: filterCategory === "all" ? undefined : filterCategory,
    featured:
      filterFeatured === "all"
        ? undefined
        : filterFeatured === "true"
          ? true
          : false,
    search: searchTerm || undefined,
  });

  const updateBlogMutation = useUpdateBlog();
  const deleteBlogMutation = useDeleteBlog();
  const createBlogMutation = useCreateBlog();
  const { showSuccess, showError } = useNotification();

  const blogs = useMemo(() => blogsData?.data || [], [blogsData?.data]);
  const pagination = blogsData?.pagination;

  // Fetch categories for the filter dropdown
  const { data: categoriesData } = useGetCategories({ limit: 1000 });
  const categoryFilterOptions = useMemo(() => {
    const categories = categoriesData?.data || [];
    return [
      { value: "all", label: "All Categories" },
      ...categories.map((cat) => ({
        value: cat.name,
        label: cat.name,
      })),
    ];
  }, [categoriesData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const allBlogs = blogsData?.data || [];
    return {
      total: blogsData?.pagination?.total || 0,
      published: allBlogs.filter((b) => b.status === BlogStatus.PUBLISHED)
        .length,
      drafts: allBlogs.filter((b) => b.status === BlogStatus.DRAFT).length,
      featured: allBlogs.filter((b) => b.featured).length,
    };
  }, [blogsData]);

  const deleteBlog = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteBlogMutation.mutate(deleteId, {
        onSuccess: () => {
          showSuccess("Blog deleted successfully!");
          setDeleteId(null);
        },
        onError: (error) => {
          showError(error.message || "Failed to delete blog");
          setDeleteId(null);
        },
      });
    }
  };

  const toggleFeatured = (id: string, currentFeatured: boolean) => {
    const newFeaturedValue = !currentFeatured;
    updateBlogMutation.mutate(
      {
        _id: id,
        featured: newFeaturedValue,
      },
      {
        onSuccess: () => {
          showSuccess(
            `Blog ${newFeaturedValue ? "featured" : "unfeatured"} successfully!`,
          );
        },
        onError: (error) => {
          showError(error.message || "Failed to update blog");
        },
      },
    );
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    updateBlogMutation.mutate(
      {
        _id: id,
        status:
          currentStatus === BlogStatus.PUBLISHED
            ? BlogStatus.DRAFT
            : BlogStatus.PUBLISHED,
      },
      {
        onSuccess: () => {
          showSuccess(
            `Blog status updated to ${currentStatus === BlogStatus.PUBLISHED
              ? BlogStatus.DRAFT
              : BlogStatus.PUBLISHED
            }!`,
          );
        },
        onError: (error) => {
          showError(error.message || "Failed to update blog status");
        },
      },
    );
  };

  const handleCreateBlog = async () => {
    try {
      const result = await createBlogMutation.mutateAsync({
        title: "New Blog Draft",
        excerpt: "Draft excerpt. Write a brief overview here.",
        content: "<p>Start writing your blog content here...</p>",
        category: UNCATEGORIZED_CATEGORY_NAME,
        author: user ? `${user.firstName} ${user.lastName}` : "", // Provide default author from logged in user
        status: BlogStatus.DRAFT,
        featured: false,
        tags: [],
        seo: {
          metaTitle: "",
          metaDescription: "",
          slug: "",
          focusKeyword: "",
          ogImage: "",
        },
      });

      if (result.success && result.data._id) {
        showSuccess("Draft created! Redirecting to editor...");
        router.push(`/admin/blogs/edit/${result.data._id}`);
      }
    } catch (err) {
      console.error("[BlogsList] Failed to create draft:", err);
      showError("Failed to create blog draft");
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setFilterCategory(value);
    setCurrentPage(1);
  };

  const handleFeaturedChange = (value: string) => {
    setFilterFeatured(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCategoryBadgeColorHash = (category: string): keyof typeof categoryColorMap => {
    const colors: (keyof typeof categoryColorMap)[] = ["primary", "secondary", "success", "warning", "error", "blue"];
    const hash = (category || "").split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Page
      title="Blogs Management"
      description="Manage your blog posts, view statistics, and update blog information"
      loading={loading}
      headerActions={
        <Button
          onClick={handleCreateBlog}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" /> Add New Blog
        </Button>
      }
    >
      <Stack>
        {/* Statistics Cards */}
        <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="stat-card bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`stat-icon w-12 h-12 rounded-full flex items-center justify-center ${colorMap.blue.bg} ${colorMap.blue.text}`}>
              <FileText className="h-6 w-6" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5" className="text-gray-500 text-sm font-medium">
                Total Blogs
              </Title>
              <Text className="text-xl font-bold text-gray-900">
                {stats.total}
              </Text>
            </div>
          </div>
          <div className="stat-card bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`stat-icon w-12 h-12 rounded-full flex items-center justify-center ${colorMap.green.bg} ${colorMap.green.text}`}>
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5" className="text-gray-500 text-sm font-medium">
                Published
              </Title>
              <Text className="text-xl font-bold text-gray-900">
                {stats.published}
              </Text>
            </div>
          </div>
          <div className="stat-card bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`stat-icon w-12 h-12 rounded-full flex items-center justify-center ${colorMap.amber.bg} ${colorMap.amber.text}`}>
              <File className="h-6 w-6" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5" className="text-gray-500 text-sm font-medium">
                Drafts
              </Title>
              <Text className="text-xl font-bold text-gray-900">
                {stats.drafts}
              </Text>
            </div>
          </div>
          <div className="stat-card bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`stat-icon w-12 h-12 rounded-full flex items-center justify-center ${colorMap.pink.bg} ${colorMap.pink.text}`}>
              <Star className="h-6 w-6 fill-pink-600" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5" className="text-gray-500 text-sm font-medium">
                Featured
              </Title>
              <Text className="text-xl font-bold text-gray-900">
                {stats.featured}
              </Text>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full min-w-0 md:min-w-[300px]">
            <TextInput
              placeholder="Search by title, author, or category..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="w-full md:w-40">
            <Select
              value={filterStatus}
              onChange={handleStatusChange}
              data={[
                { value: "all", label: "All Status" },
                { value: BlogStatus.PUBLISHED, label: "Published" },
                { value: BlogStatus.DRAFT, label: "Draft" },
              ]}
            />
          </div>

          <div className="w-full md:w-48">
            <Select
              value={filterCategory}
              onChange={handleCategoryChange}
              data={categoryFilterOptions}
              searchable
            />
          </div>

          <div className="w-full md:w-44">
            <Select
              value={filterFeatured}
              onChange={handleFeaturedChange}
              data={[
                { value: "all", label: "All Blogs" },
                { value: "true", label: "Featured Only" },
                { value: "false", label: "Non-Featured Only" },
              ]}
            />
          </div>
        </div>

        {/* Blogs Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Table verticalSpacing="sm" horizontalSpacing="md">
            <thead>
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-center p-3">Author</th>
                <th className="text-center p-3">Category</th>
                <th className="text-center p-3">Status</th>
                <th className="text-center p-3">Featured</th>
                <th className="text-center p-3">Published</th>
                <th className="text-center p-3 w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <div className="flex gap-4 items-center">
                      {blog.featuredImage ? (
                        <div className="w-16 h-12 rounded-md overflow-hidden shrink-0 border border-gray-100 relative">
                          <Image
                            src={blog.featuredImage}
                            alt={blog.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-12 rounded-md bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                          <ImageIcon className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <Title order={6} size="h6" className="font-bold text-gray-900 truncate">
                          {blog.title}
                        </Title>
                        <Text className="text-xs text-gray-400 truncate max-w-[300px]">
                          {blog.excerpt?.substring(0, 80)}
                          {blog.excerpt && blog.excerpt.length > 80 && "..."}
                        </Text>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap mt-1">
                            {blog.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                            {blog.tags.length > 3 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
                                +{blog.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center align-middle">
                    <Text className="font-medium text-sm text-gray-700">
                      {(typeof blog.author === 'string' ? blog.author : blog.author?.name) || "N/A"}
                    </Text>
                  </td>
                  <td className="p-3 text-center align-middle">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border uppercase ${categoryColorMap[getCategoryBadgeColorHash((typeof blog.category === 'string' ? blog.category : blog.category?.name) || UNCATEGORIZED_CATEGORY_NAME)]}`}>
                      {(typeof blog.category === 'string' ? blog.category : blog.category?.name)}
                    </span>
                  </td>
                  <td className="p-3 text-center align-middle">
                    <Button
                      onClick={() => toggleStatus(blog._id, blog.status)}
                      variant="outline"
                      size="sm"
                      className={`h-7 px-2 text-xs font-semibold uppercase border ${statusColorMap[blog.status as BlogStatus] || "text-gray-600 border-gray-600"}`}
                    >
                      {blog.status}
                    </Button>
                  </td>
                  <td className="p-3 text-center align-middle">
                    <button
                      onClick={() =>
                        toggleFeatured(blog._id, blog.featured || false)
                      }
                      className="p-1 min-w-0 h-auto bg-transparent border-none cursor-pointer"
                      title={blog.featured ? "Unfeature this blog" : "Feature this blog"}
                    >
                      {blog.featured ? (
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ) : (
                        <Star className="h-5 w-5 text-gray-300" />
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-center align-middle">
                    <div className="text-xs text-gray-600">
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString()
                        : "Not published"}
                      <br />
                      <span className="text-gray-400">
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : "Draft"}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center align-middle">
                    <div className="flex gap-2 justify-center">
                      <Link href={`/admin/blogs/edit/${blog._id}`}>
                        <Button variant="outline" size="sm" className="p-2" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => deleteBlog(blog._id)}
                        variant="outline"
                        size="sm"
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {blogs.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <Text className="text-gray-500 font-medium text-lg">
              No blogs found
            </Text>
            <Button
              onClick={handleCreateBlog}
              className="mt-4 flex items-center gap-2 mx-auto"
            >
              <PlusCircle className="h-4 w-4" /> Create Your First Blog
            </Button>
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <PaginationComponent
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageSize={pageSize}
          />
        )}

        {/* Deletion Confirmation Modals */}
        <ConfirmModal
          opened={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title="Delete Blog"
          confirmLabel="Delete"
          color="error"
          loading={deleteBlogMutation.isPending}
        >
          Are you sure you want to delete this blog? This action cannot be
          undone.
        </ConfirmModal>
      </Stack>
    </Page>
  );
};

export default BlogsList;
