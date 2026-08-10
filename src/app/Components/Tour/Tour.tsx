"use client";
import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import { AppImage, ActionIcon, Loading, Section, Container, Grid } from "@/app/Components/Common";
import { ImageVariant } from "@/lib/constants/imageDimensions";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import {
  useGetTours,
  useGetTourLocations,
  useGetTourCategories,
  useTourFavorites,
} from "@/lib/hooks";
import { TourStatus } from "@/lib/enums";
import { StarRating, Checkbox } from "@/app/Components/Form";
import { formatCurrency } from "@/lib/utils/currencyConverter";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { cn } from "@/lib/utils";
import { ArrowRight, Clock, Heart, Inbox, MapPin, Search, SlidersHorizontal, User, X } from "lucide-react";

// ─── Sidebar filter content extracted so it can be reused in desktop + drawer ─
interface FilterPanelProps {
  categories: { name: string; count: number }[];
  locations: { name: string; count: number }[];
  selectedCategories: string[];
  selectedLocations: string[];
  onCategoryChange: (name: string, checked: boolean) => void;
  onLocationChange: (name: string, checked: boolean) => void;
}

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

const FilterPanel: React.FC<FilterPanelProps> = ({
  categories, locations,
  selectedCategories, selectedLocations,
  onCategoryChange, onLocationChange,
}) => (
  <div className="flex flex-col gap-6">
    {/* Categories */}
    <FilterSection title="Categories">
      <div className="flex flex-col gap-3.5">
        {categories.length > 0 ? categories.map((cat) => (
          <div key={cat.name} className="flex justify-between items-center group">
            <Checkbox
              id={`cat-${cat.name}`}
              label={cat.name}
              checked={selectedCategories.includes(cat.name)}
              onChange={(checked) => onCategoryChange(cat.name, checked)}
            />
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full transition-colors group-hover:bg-[#EF7C00]/10 group-hover:text-[#EF7C00] min-w-[28px] text-center">{cat.count}</span>
          </div>
        )) : <p className="text-gray-400 text-sm italic">No categories available</p>}
      </div>
    </FilterSection>

    {/* Destinations */}
    <FilterSection title="Destinations">
      <div className="flex flex-col gap-3.5">
        {locations.length > 0 ? locations.map((loc) => (
          <div key={loc.name} className="flex justify-between items-center group">
            <Checkbox
              id={`loc-${loc.name}`}
              label={loc.name}
              checked={selectedLocations.includes(loc.name)}
              onChange={(checked) => onLocationChange(loc.name, checked)}
            />
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full transition-colors group-hover:bg-[#EF7C00]/10 group-hover:text-[#EF7C00] min-w-[28px] text-center">{loc.count}</span>
          </div>
        )) : <p className="text-gray-400 text-sm italic">No destinations available</p>}
      </div>
    </FilterSection>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const Tour = () => {
  const pageLimit = 9;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // Backed by localStorage through useSyncExternalStore — see useTourFavorites.
  const { toggleFavorite: toggleFavoriteId, isFavorite } = useTourFavorites();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Computed active filter count for badge
  const activeFilterCount =
    selectedLocations.length +
    selectedCategories.length +
    (searchTerm ? 1 : 0);

  // Data fetching
  const { data: locationsData } = useGetTourLocations(TourStatus.ACTIVE);
  const locations = locationsData?.data || [];
  const { data: categoriesData } = useGetTourCategories(TourStatus.ACTIVE);
  const categories = categoriesData?.data || [];

  const { data: toursData, isLoading: loading, error } = useGetTours({
    status: TourStatus.ACTIVE,
    search: searchTerm || undefined,
    location: selectedLocations.length > 0 ? selectedLocations.join(",") : undefined,
    category: selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
    page: currentPage,
    limit: pageLimit,
  });

  const tours = React.useMemo(() => toursData?.data || [], [toursData?.data]);
  const pagination = toursData?.pagination;

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isFilterOpen]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setSearchTerm(trimmed);
    setCurrentPage(1);
  };

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = (tourId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteId(tourId);
  };

  const handleLocationChange = (name: string, checked: boolean) => {
    setSelectedLocations((prev) => checked ? [...prev, name] : prev.filter((n) => n !== name));
    setCurrentPage(1);
  };
  const handleCategoryChange = (name: string, checked: boolean) => {
    setSelectedCategories((prev) => checked ? [...prev, name] : prev.filter((n) => n !== name));
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSelectedLocations([]);
    setSelectedCategories([]);
    setSearchQuery("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const filterPanelProps: FilterPanelProps = {
    categories, locations,
    selectedCategories, selectedLocations,
    onCategoryChange: handleCategoryChange,
    onLocationChange: handleLocationChange,
  };

  if (error) {
    return (
      <Section padding="lg" className="tour-section fix">
        <Container>
          <div className="text-center py-12">
            <p className="text-red-500">Unable to load tours. Please try again later.</p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg" className="tour-section fix bg-gray-50">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <span className="inline-block text-[#EF7C00] font-bold tracking-widest uppercase mb-3 text-sm md:text-base animate-in fade-in slide-in-from-bottom-4 duration-500">
            Our Tours
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
            Discover Your Perfect Adventure
          </h2>
          <p className="text-gray-600 text-base md:text-lg mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both max-w-2xl">
            Explore our handpicked collection of extraordinary journeys. From breathtaking landscapes to cultural treasures, find the tour that speaks to your wanderlust.
          </p>
        </div>

        {/* ── Mobile Search + Filter Bar ── */}
        <div className="lg:hidden mb-6 flex gap-3 items-center">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tours, destinations..."
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

          {/* Filter Button */}
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

        {/* Active filters chips – mobile */}
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
                {c}<button onClick={() => handleCategoryChange(c, false)}><X className="h-3 w-3" /></button>
              </span>
            ))}
            {selectedLocations.map((l) => (
              <span key={l} className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                {l}<button onClick={() => handleLocationChange(l, false)}><X className="h-3 w-3" /></button>
              </span>
            ))}
            <button onClick={handleClearAllFilters}
              className="text-xs text-gray-500 underline underline-offset-2 hover:text-gray-800 transition-colors">
              Clear all
            </button>
          </div>
        )}

        {/* ── Main Grid ── */}
        <div className="w-full">
          <Grid cols={12} gap="lg">
            {/* Tours Grid */}
            <div className="col-span-12 lg:col-span-8">
              {loading ? (
                <div className="flex justify-center items-center min-h-[500px] w-full">
                  <Loading variant="spinner" size="lg" color="primary" text="Loading tours..." />
                </div>
              ) : tours.length === 0 ? (
                <div className="flex flex-col justify-center items-center min-h-[400px] w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <Inbox className="h-16 w-16 text-gray-300 mb-4" />
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">No Tours Found</h4>
                  <p className="text-gray-500 text-center max-w-md">
                    {activeFilterCount > 0
                      ? "Try adjusting your search or filters to find more tours."
                      : "We couldn't find any tours at the moment. Please check back later."}
                  </p>
                  {activeFilterCount > 0 && (
                    <button onClick={handleClearAllFilters}
                      className="mt-4 px-6 py-2.5 bg-[#EF7C00] text-white font-semibold rounded-full hover:bg-[#d66e00] transition-colors shadow-sm">
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                <Grid cols={1} className="md:grid-cols-2 lg:grid-cols-3" gap="md">
                  {tours.map((tour) => (
                    <div key={tour._id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full border border-gray-100 relative">
                        <AppImage
                          variant={ImageVariant.CARD}
                          src={tour.images?.[0] || `${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero2.webp`}
                          alt={tour.title}
                          imageClassName="transition-transform duration-500 hover:scale-105"
                          priority
                        >
                          <ActionIcon
                            variant={isFavorite(tour._id) ? "filled" : "light"}
                            color="primary"
                            size="md"
                            radius="round"
                            onClick={(e) => toggleFavorite(tour._id, e)}
                            className="absolute top-2.5 right-2.5 z-10 bg-white/80 hover:bg-white"
                            aria-label={isFavorite(tour._id) ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Heart className={cn("h-4 w-4", isFavorite(tour._id) && "fill-current")} />
                          </ActionIcon>
                        </AppImage>
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-amber-500" />
                              {tour.location}
                            </span>
                            <div className="flex items-center gap-1">
                              <StarRating
                                rating={typeof tour.rating === "number" ? tour.rating : 0}
                                readonly={true}
                                size="sm"
                                className="tour-rating-stars"
                              />
                              <span className="font-semibold text-gray-700">
                                {(typeof tour.rating === "number" ? tour.rating : 0).toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <h5 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            <Link href={`/tours/${tour.seo?.slug || tour._id}`} className="hover:text-[var(--theme)] transition-colors">
                              {tour.title}
                            </Link>
                          </h5>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4 mt-auto">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-amber-500" />
                              {tour.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5 text-amber-500" />
                              {tour.reviews} reviews
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div>
                              <span className="text-lg font-bold text-[var(--theme)]">{formatCurrency(tour.price)}</span>
                              <span className="text-xs text-gray-400 block">/{tour.priceType}</span>
                            </div>
                            <Link
                              href={`/tours/${tour.seo?.slug || tour._id}`}
                              className="text-sm font-bold text-[var(--header)] hover:text-[var(--theme)] transition-colors inline-flex items-center gap-2"
                            >
                              Book Now <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Grid>
              )}
              {!loading && pagination && pagination.pages > 1 && (
                <div className="mt-8 flex justify-center">
                  <PaginationComponent
                    pagination={pagination}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    pageSize={pageLimit}
                  />
                </div>
              )}
            </div>

            {/* Desktop Sidebar */}
            <div className="col-span-12 lg:col-span-4 hidden lg:flex flex-col">
              <div className="flex flex-col gap-5 sticky top-24">
                {/* Desktop Search */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                  <div className="mb-5 pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
                      <span className="w-1.5 h-6 bg-[#EF7C00] rounded-full inline-block"></span>
                      Search Tours
                    </h3>
                  </div>
                  <form onSubmit={handleSearch} className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#EF7C00] transition-colors" />
                    <input
                      type="text"
                      placeholder="Search tours, destinations..."
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
                </div>

                <FilterPanel {...filterPanelProps} />
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
        {/* Drawer Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Drawer Header */}
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
              <button onClick={handleClearAllFilters}
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

        {/* Drawer Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-5 py-5">
          <FilterPanel {...filterPanelProps} />
        </div>

        {/* Drawer Footer */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-gray-200 bg-white rounded-b-3xl">
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full bg-[#EF7C00] hover:bg-[#d66e00] text-white font-bold py-4 rounded-xl transition-colors text-sm shadow-lg"
          >
            {loading ? "Loading..." : `Show ${toursData?.pagination?.total ?? "All"} Tours`}
          </button>
        </div>
      </div>
    </Section>
  );
};

export default Tour;
