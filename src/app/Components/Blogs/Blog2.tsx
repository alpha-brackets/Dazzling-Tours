"use client";
import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AppImage } from "@/app/Components/Common";
import { ImageVariant } from "@/lib/constants/imageDimensions";
import Link from "next/link";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useGetBlogs, useGetBlogCategories, useGetBlogTags } from "@/lib/hooks";
import { BlogStatus } from "@/lib/enums/blog";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { Loading, Section, Container, Grid } from "@/app/Components/Common";
import { Checkbox } from "@/app/Components/Form";
import { ArrowRight, BookX, Calendar, Folder, Search, SlidersHorizontal, Tag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Reusable filter section wrapper ─────────────────────────────────────────
const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
    <div className="mb-5 pb-4 border-b border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
        <span className="w-1.5 h-6 bg-[#EF7C00] rounded-full inline-block"></span>
        {title}
      </h3>
    </div>
    {children}
  </div>
);

// ─── Main Blog listing content ────────────────────────────────────────────────
const Blog2Content = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");
  const urlTags = searchParams.get("tags");
  const urlPage = searchParams.get("page");

  const pageLimit = 6;
  const [searchQuery, setSearchQuery] = useState(urlSearch || "");
  const [searchTerm, setSearchTerm] = useState(urlSearch || "");
  const [currentPage, setCurrentPage] = useState(urlPage ? parseInt(urlPage) : 1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    urlCategory ? urlCategory.split(",") : [],
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    urlTags ? urlTags.split(",") : [],
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Active filter count for badge
  const activeFilterCount =
    selectedCategories.length +
    selectedTags.length +
    (searchTerm ? 1 : 0);

  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      if (!Object.prototype.hasOwnProperty.call(updates, "page")) {
        params.delete("page");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  useEffect(() => {
    setSearchTerm(urlSearch || "");
    setSearchQuery(urlSearch || "");
    setSelectedCategories(urlCategory ? urlCategory.split(",") : []);
    setSelectedTags(urlTags ? urlTags.split(",") : []);
    setCurrentPage(urlPage ? parseInt(urlPage) : 1);
  }, [urlCategory, urlSearch, urlTags, urlPage]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isFilterOpen]);

  const { data: categoriesData } = useGetBlogCategories(BlogStatus.PUBLISHED);
  const categories = categoriesData?.data || [];

  const { data: tagsData } = useGetBlogTags(BlogStatus.PUBLISHED);
  const tags = tagsData?.data || [];

  const { data: blogsData, isLoading: loading, error } = useGetBlogs({
    status: BlogStatus.PUBLISHED,
    search: searchTerm || undefined,
    category: selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
    tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
    page: currentPage,
    limit: pageLimit,
  });

  const { data: recentBlogsData } = useGetBlogs({
    status: BlogStatus.PUBLISHED,
    limit: 3,
    page: 1,
  });
  const recentBlogs = recentBlogsData?.data || [];

  const blogs = blogsData?.data || [];
  const pagination = blogsData?.pagination;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, selectedTags]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchQuery.trim();
    setSearchTerm(query);
    updateUrl({ search: query });
  };

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchTerm("");
    updateUrl({ search: null });
  }, [updateUrl]);

  const handleClearAll = () => {
    setSearchQuery("");
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedTags([]);
    router.push(pathname, { scroll: false });
  };

  const handleCategoryChange = (categoryName: string, checked: boolean) => {
    setSelectedCategories((prev) => {
      const newCats = checked
        ? [...prev, categoryName]
        : prev.filter((c) => c !== categoryName);
      updateUrl({ category: newCats.length > 0 ? newCats.join(",") : null });
      return newCats;
    });
  };

  const handleTagChange = (tagName: string, checked: boolean) => {
    setSelectedTags((prev) => {
      const newTags = checked
        ? [...prev, tagName]
        : prev.filter((t) => t !== tagName);
      updateUrl({ tags: newTags.length > 0 ? newTags.join(",") : null });
      return newTags;
    });
  };

  const handlePageChange = (page: number) => {
    updateUrl({ page: page.toString() });
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      full: date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
    };
  };

  // ── Sidebar Filter Panels ──────────────────────────────────────────────────
  const CategoriesPanel = () => (
    <FilterSection title="Categories">
      <div className="flex flex-col gap-3.5">
        {categories.length > 0 ? (
          categories.map((cat, idx) => {
            const isChecked = selectedCategories.some(
              (c) => c.trim().toLowerCase() === cat.name.trim().toLowerCase(),
            );
            const catId = `cat-${idx}-${cat.name.replace(/\s+/g, "-")}`;
            return (
              <div key={cat.name} className="flex justify-between items-center group">
                <Checkbox
                  id={catId}
                  label={cat.name}
                  checked={isChecked}
                  onChange={(checked) => handleCategoryChange(cat.name, checked)}
                />
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full transition-colors group-hover:bg-[#EF7C00]/10 group-hover:text-[#EF7C00] min-w-[28px] text-center">{cat.count}</span>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm italic">No categories available</p>
        )}
      </div>
    </FilterSection>
  );

  const RecentPostsPanel = () => (
    <FilterSection title="Recent Posts">
      <div className="flex flex-col gap-4">
        {recentBlogs.length > 0 ? (
          recentBlogs.map((recent) => (
            <div className="flex gap-3 items-center" key={recent._id}>
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <AppImage
                  variant={ImageVariant.THUMBNAIL}
                  src={recent.featuredImage || `${IMAGEKIT_URL_ENDPOINT}/assets/img/blogs/BlogsPage.webp`}
                  alt={recent.title}
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-xs text-amber-500 font-semibold flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(recent.publishedAt || recent.createdAt).full}
                </span>
                <h6 className="text-sm font-bold text-gray-900 line-clamp-2">
                  <Link
                    href={`/blogs/${recent.seo?.slug || recent._id}`}
                    className="hover:text-[var(--theme)] transition-colors"
                  >
                    {recent.title}
                  </Link>
                </h6>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No recent posts</p>
        )}
      </div>
    </FilterSection>
  );

  const TagsPanel = () => (
    <FilterSection title="Tags">
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag, idx) => {
            const isChecked = selectedTags.some(
              (t) => t.trim().toLowerCase() === tag.trim().toLowerCase(),
            );
            const tagId = `tag-${idx}-${tag.replace(/\s+/g, "-")}`;
            return (
              <div key={tag}>
                <Checkbox
                  id={tagId}
                  label={tag}
                  checked={isChecked}
                  onChange={(checked) => handleTagChange(tag, checked)}
                />
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">No tags available</p>
        )}
      </div>
    </FilterSection>
  );

  if (error) {
    return (
      <Section padding="lg" className="news-section-2 fix">
        <Container>
          <div className="text-center py-12">
            <p className="text-lg text-gray-700">Unable to load blogs. Please try again later.</p>
            <p className="text-gray-500 mt-2">{error.message}</p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg" className="news-section-2 fix bg-gray-50">
      <Container>
        <div className="w-full">
          {/* Page heading */}
          <div className="mb-8 text-center lg:text-left">
            <span className="inline-block text-[#EF7C00] font-bold tracking-widest uppercase mb-3 text-sm md:text-base animate-in fade-in slide-in-from-bottom-4 duration-500">
              News &amp; Updates
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
              Our Latest News &amp; Articles
            </h2>
          </div>

          {/* ── Mobile Search + Filter Bar ── */}
          <div className="lg:hidden mb-6 flex gap-3 items-center">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search news, tags..."
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button type="button" onClick={handleClearSearch}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
              <button type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-amber-500 text-white p-1.5 rounded-lg hover:bg-amber-600 transition-colors">
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Filter button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="relative flex items-center gap-2 bg-white border border-gray-200 shadow-sm text-gray-700 font-semibold text-sm px-4 py-3.5 rounded-xl hover:border-amber-500 hover:text-amber-600 transition-all whitespace-nowrap"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#EF7C00] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active filter chips – mobile */}
          {activeFilterCount > 0 && (
            <div className="lg:hidden mb-5 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  &ldquo;{searchTerm}&rdquo;
                  <button onClick={handleClearSearch}><X className="h-3 w-3" /></button>
                </span>
              )}
              {selectedCategories.map((c) => (
                <span key={c} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <Folder className="h-3 w-3" />{c}
                  <button onClick={() => handleCategoryChange(c, false)}><X className="h-3 w-3" /></button>
                </span>
              ))}
              {selectedTags.map((t) => (
                <span key={t} className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <Tag className="h-3 w-3" />{t}
                  <button onClick={() => handleTagChange(t, false)}><X className="h-3 w-3" /></button>
                </span>
              ))}
              <button onClick={handleClearAll}
                className="text-xs text-gray-500 underline underline-offset-2 hover:text-gray-800 transition-colors">
                Clear all
              </button>
            </div>
          )}

          {/* ── Main Grid ── */}
          <Grid cols={12} gap="lg">
            {/* Blog Cards */}
            <div className="col-span-12 lg:col-span-8">
              {loading ? (
                <div className="flex justify-center items-center min-h-[600px]">
                  <Loading variant="spinner" size="lg" color="primary" text="Loading blogs..." />
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-16 px-8 bg-white rounded-xl shadow-sm">
                  <BookX className="h-16 w-16 text-gray-300 mx-auto" />
                  <h4 className="mt-4 text-xl font-semibold text-gray-900">No Blogs Found</h4>
                  <p className="text-gray-500 mt-2">
                    {activeFilterCount > 0
                      ? "Try adjusting your search or category filters."
                      : "We haven't published any blogs yet. Stay tuned!"}
                  </p>
                  {activeFilterCount > 0 && (
                    <button onClick={handleClearAll} className="mt-4 px-6 py-2.5 bg-[#EF7C00] text-white font-semibold rounded-full hover:bg-[#d66e00] transition-colors shadow-sm">
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <Grid cols={1} className="md:grid-cols-2" gap="md">
                    {blogs.map((blog) => {
                      const blogSlug = blog.seo?.slug || blog._id;
                      const blogUrl = `/blogs/${blogSlug}`;
                      return (
                        <div key={blog._id} className="wow fadeInUp" data-wow-delay=".2s">
                          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full border border-gray-100">
                            <AppImage
                              variant={ImageVariant.CARD}
                              src={blog.featuredImage || `${IMAGEKIT_URL_ENDPOINT}/assets/img/blogs/BlogsPage.webp`}
                              alt={blog.title}
                              imageClassName="transition-transform duration-500 hover:scale-105"
                            />
                            <div className="p-6 flex flex-col flex-1">
                              <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                                  {formatDate(blog.publishedAt || blog.createdAt).full}
                                </span>
                                <span className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5 text-amber-500" />
                                  {typeof blog.author === "string" ? blog.author : (blog.author?.name || "Admin")}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Folder className="h-3.5 w-3.5 text-amber-500" />
                                  {typeof blog.category === "string" ? blog.category : (blog.category?.name || "General")}
                                </span>
                              </div>

                              {blog.tags && blog.tags.length > 0 && (
                                <div className="flex items-center gap-1 mb-3 text-xs text-gray-400">
                                  <Tag className="h-3.5 w-3.5 text-amber-500" />
                                  <span className="truncate">{blog.tags.join(", ")}</span>
                                </div>
                              )}

                              <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                <Link href={blogUrl} className="hover:text-[var(--theme)] transition-colors">
                                  {blog.title}
                                </Link>
                              </h4>

                              {blog.excerpt && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                                  {blog.excerpt}
                                </p>
                              )}

                              <div className="pt-3 mt-auto border-t border-gray-100">
                                <Link
                                  href={blogUrl}
                                  className="text-sm font-bold text-[var(--header)] hover:text-[var(--theme)] transition-colors inline-flex items-center gap-2"
                                >
                                  Read More <ArrowRight className="h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Grid>

                  {pagination && pagination.pages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <PaginationComponent
                        pagination={pagination}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        pageSize={pageLimit}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Desktop Sidebar */}
            <div className="col-span-12 lg:col-span-4 hidden lg:flex flex-col">
              <div className="flex flex-col gap-5 sticky top-24">
                {/* Desktop Search */}
                <FilterSection title="Search Blogs">
                  <form onSubmit={handleSearch} className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#EF7C00] transition-colors" />
                    <input
                      type="text"
                      placeholder="Search news, tags..."
                      className="w-full pl-11 pr-12 py-3.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF7C00]/20 focus:border-[#EF7C00] focus:bg-white transition-all text-sm font-medium placeholder-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button type="button" onClick={handleClearSearch}
                        className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <button type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#EF7C00] text-white p-2 rounded-lg hover:bg-[#d66e00] transition-colors disabled:opacity-50 disabled:hover:bg-[#EF7C00]"
                      disabled={!searchQuery.trim() && !searchTerm}>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                </FilterSection>

                <CategoriesPanel />
                <RecentPostsPanel />
                <TagsPanel />
              </div>
            </div>
          </Grid>
        </div>
      </Container>

      {/* ── Mobile Filter Drawer ── */}
      {/* Backdrop */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsFilterOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-50 rounded-t-3xl shadow-2xl transition-transform duration-400 ease-out flex flex-col",
          "max-h-[88dvh]",
          isFilterOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-[#EF7C00]" />
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="bg-[#EF7C00] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {activeFilterCount > 0 && (
              <button onClick={handleClearAll}
                className="text-sm font-semibold text-[#EF7C00] hover:text-[#d66e00] transition-colors">
                Clear all
              </button>
            )}
            <button onClick={() => setIsFilterOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Drawer scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-5 flex flex-col gap-5">
          <CategoriesPanel />
          <RecentPostsPanel />
          <TagsPanel />
        </div>

        {/* Drawer footer */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full bg-[#EF7C00] hover:bg-[#d66e00] text-white font-bold py-4 rounded-xl transition-colors text-sm shadow-lg"
          >
            {loading ? "Loading..." : `Show ${blogsData?.pagination?.total ?? "All"} Articles`}
          </button>
        </div>
      </div>
    </Section>
  );
};

const Blog2 = () => {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <Loading variant="spinner" text="Loading..." />
        </div>
      }
    >
      <Blog2Content />
    </Suspense>
  );
};

export default Blog2;
