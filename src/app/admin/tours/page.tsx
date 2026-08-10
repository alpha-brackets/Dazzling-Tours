"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  useGetTours,
  useCreateTour,
  useUpdateTour,
  useDeleteTour,
  useNotification,
  useGetCategories,
} from "@/lib/hooks";
import { CreateTourData } from "@/lib/types/tour";
import { useRouter } from "next/navigation";
import { TourStatus, TOUR_STATUS_OPTIONS } from "@/lib/enums";
import { formatCurrency } from "@/lib/utils/currencyConverter";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { TextInput, Select } from "@/app/Components/Form";
import Image from "next/image";
import {
  Stack,
  Page,
  Table,
  ConfirmModal,
  Title,
  Text,
} from "@/app/Components/Common";
import { Button } from "@/components/ui/button";
import { PlusCircle, MapPin, Star, Pencil, Trash, Image as ImageIcon } from "lucide-react";

const categoryColorMap = {
  primary: "bg-blue-50 text-blue-700 border-blue-200",
  secondary: "bg-gray-50 text-gray-700 border-gray-200",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  error: "bg-red-50 text-red-700 border-red-200",
  blue: "bg-sky-50 text-sky-700 border-sky-200",
};

const statusColorMap = {
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  error: "bg-red-50 text-red-700 border-red-200",
  gray: "bg-gray-50 text-gray-700 border-gray-200",
};

const ToursList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: toursData, isLoading: loading } = useGetTours({
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

  const updateTourMutation = useUpdateTour();
  const deleteTourMutation = useDeleteTour();
  const { showSuccess } = useNotification();

  // Fetch categories for the filter dropdown
  const { data: categoriesData } = useGetCategories({ limit: 1000 });
  const categoryFilterOptions = React.useMemo(() => {
    const categories = categoriesData?.data || [];
    return [
      { value: "all", label: "All Categories" },
      ...categories.map((cat) => ({
        value: cat.name,
        label: cat.name,
      })),
    ];
  }, [categoriesData]);

  const tours = toursData?.data || [];
  const pagination = toursData?.pagination;

  const deleteTour = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTourMutation.mutate(deleteId, {
        onSuccess: () => {
          showSuccess("Tour deleted successfully!");
          setDeleteId(null);
        },
        onError: () => setDeleteId(null),
      });
    }
  };

  const toggleFeatured = (id: string, currentFeatured: boolean) => {
    updateTourMutation.mutate(
      {
        _id: id,
        featured: !currentFeatured,
      },
      {
        onSuccess: () => {
          showSuccess(
            `Tour ${!currentFeatured ? "featured" : "unfeatured"} successfully!`,
          );
        },
      },
    );
  };

  const toggleStatus = (id: string, currentStatus: TourStatus) => {
    updateTourMutation.mutate(
      {
        _id: id,
        status:
          currentStatus === TourStatus.ACTIVE
            ? TourStatus.INACTIVE
            : TourStatus.ACTIVE,
      },
      {
        onSuccess: () => {
          showSuccess(
            `Tour status updated to ${currentStatus === TourStatus.ACTIVE
              ? TourStatus.INACTIVE
              : TourStatus.ACTIVE
            }!`,
          );
        },
      },
    );
  };

  const getStatusBadgeColor = (
    status: TourStatus,
  ): "success" | "warning" | "error" | "gray" => {
    switch (status) {
      case TourStatus.ACTIVE:
        return "success";
      case TourStatus.DRAFT:
        return "warning";
      case TourStatus.INACTIVE:
        return "error";
      case TourStatus.ARCHIVED:
        return "gray";
      default:
        return "gray";
    }
  };

  const getCategoryBadgeColor = (
    category: string,
  ): "primary" | "secondary" | "success" | "warning" | "error" | "blue" => {
    const colors: (
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "error"
      | "blue"
    )[] = ["primary", "secondary", "success", "warning", "error", "blue"];
    const hash = (category || "").split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
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

  const router = useRouter();
  const createTourMutation = useCreateTour();

  const handleCreateTour = async () => {
    try {
      const result = await createTourMutation.mutateAsync({
        status: TourStatus.DRAFT,
        title: `New Tour Draft ${Date.now()}`,
        description: "Draft Description",
        shortDescription: "Draft Short Description",
        price: 0,
        duration: "Draft Duration",
        location: "Draft Location",
        category: "Draft Category",
        images: [],
      } as CreateTourData);

      // Successfully created draft, route to unified management page
      router.push(`/admin/tours/${result.data._id}`);
    } catch (err) {
      console.error("Failed to create tour draft:", err);
    }
  };

  return (
    <Page
      title="Tours Management"
      description="Manage your tour packages, view bookings, and update tour information"
      loading={loading}
      headerActions={
        <Button
          onClick={handleCreateTour}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" /> Add New Tour
        </Button>
      }
    >
      <Stack>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <TextInput
              placeholder="Search tours..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="w-full md:w-48">
            <Select
              value={filterStatus}
              onChange={handleStatusChange}
              data={[
                { value: "all", label: "All Status" },
                ...TOUR_STATUS_OPTIONS,
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

          <div className="w-full md:w-48">
            <Select
              value={filterFeatured}
              onChange={handleFeaturedChange}
              data={[
                { value: "all", label: "All Tours" },
                { value: "true", label: "Featured Only" },
                { value: "false", label: "Non-Featured Only" },
              ]}
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden overflow-x-auto bg-white">
          <Table verticalSpacing="sm" horizontalSpacing="md">
            <thead>
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Location</th>
                <th className="text-left p-3">Price</th>
                <th className="text-center p-3">Duration</th>
                <th className="text-center p-3">Category</th>
                <th className="text-center p-3">Status</th>
                <th className="text-center p-3">Featured</th>
                <th className="text-center p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <div className="flex gap-4 items-center">
                      {tour.images && tour.images[0] ? (
                        <div className="w-16 h-12 rounded-md overflow-hidden shrink-0 border border-gray-100 relative">
                          <Image
                            src={tour.images[0]}
                            alt={tour.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-12 rounded-md bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                          <ImageIcon className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                      <div className="flex flex-col gap-0.5">
                        <Title order={6} size="h6" className="font-bold text-gray-900">
                          {tour.title}
                        </Title>
                        <Text className="text-xs text-gray-400">
                          ID: {tour._id.substring(0, 8)}...
                        </Text>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 align-middle">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <Text className="text-sm">{tour.location}</Text>
                    </div>
                  </td>
                  <td className="p-3 align-middle">
                    <div className="flex flex-col">
                      <Text className="font-semibold text-gray-900">
                        {formatCurrency(tour.price)}
                      </Text>
                      <span className="text-xs text-gray-500">
                        {tour.priceType}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center align-middle">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {tour.duration}
                    </span>
                  </td>
                  <td className="p-3 text-center align-middle">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border uppercase ${categoryColorMap[getCategoryBadgeColor(tour.category)]}`}>
                      {tour.category}
                    </span>
                  </td>
                  <td className="p-3 text-center align-middle">
                    <div
                      onClick={() => toggleStatus(tour._id, tour.status)}
                      className="cursor-pointer"
                    >
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${statusColorMap[getStatusBadgeColor(tour.status)]}`}>
                        {tour.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center align-middle">
                    <button
                      onClick={() => toggleFeatured(tour._id, tour.featured)}
                      className="p-1 min-w-0 h-auto bg-transparent border-none cursor-pointer"
                    >
                      {tour.featured ? (
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ) : (
                        <Star className="h-5 w-5 text-gray-300" />
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-center align-middle">
                    <div className="flex gap-2 justify-center">
                      <Link href={`/admin/tours/${tour._id}`}>
                        <Button variant="outline" size="sm" className="p-2" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => deleteTour(tour._id)}
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

        {tours.length === 0 && !loading && (
          <div className="no-data">
            <Text>No tours found</Text>
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
      </Stack>

      <ConfirmModal
        opened={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Tour"
        confirmLabel="Delete"
        color="error"
        loading={deleteTourMutation.isPending}
      >
        Are you sure you want to delete this tour? This action cannot be undone.
      </ConfirmModal>
    </Page>
  );
};

export default ToursList;
