"use client";
import React from "react";
import "./PaginationComponent.css";
import { Pagination as PaginationType } from "@/lib/types/common";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  pagination: PaginationType;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  className?: string;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  pagination,
  currentPage,
  onPageChange,
  pageSize = 10,
  className = "",
}) => {
  if (!pagination || pagination.pages <= 1 || pagination.total <= pageSize) {
    return null;
  }

  const getVisiblePages = () => {
    const pages: number[] = [];
    const totalPages = pagination.pages;

    // Always show first page
    pages.push(1);

    // Show pages around current page
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Always show last page if it's not already included
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages.sort((a, b) => a - b);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 py-4 ${className}`}>
      <div className="text-sm text-gray-500">
        Showing {(currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, pagination.total)} of{" "}
        {pagination.total} items
      </div>

      <Pagination className="w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              className={`cursor-pointer ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
            />
          </PaginationItem>

          {visiblePages.map((page, index) => {
            const showEllipsis =
              index > 0 && page - visiblePages[index - 1] > 1;

            return (
              <React.Fragment key={page}>
                {showEllipsis && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              </React.Fragment>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={`cursor-pointer ${currentPage >= pagination.pages ? "pointer-events-none opacity-50" : ""}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
