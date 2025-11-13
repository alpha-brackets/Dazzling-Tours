"use client";
import React from "react";
import Loading from "./Loading";

export interface PageProps {
  title: string;
  description?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  loadingVariant?: "spinner" | "dots" | "skeleton" | "pulse";
  loadingSize?: "xs" | "sm" | "md" | "lg" | "xl";
  loadingColor?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "gray";
}

const Page: React.FC<PageProps> = ({
  title,
  description,
  headerActions,
  children,
  className = "",
  loading = false,
  loadingVariant = "spinner",
  loadingSize = "xs",
  loadingColor = "primary",
}) => {
  return (
    <div className={`admin-page ${className}`}>
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title d-flex align-items-center gap-2">
              {title}
              {loading && (
                <Loading
                  variant={loadingVariant}
                  size={loadingSize}
                  color={loadingColor}
                  className="ms-2"
                />
              )}
            </h1>
            {description && <p className="page-description">{description}</p>}
          </div>
          {headerActions && (
            <div className="header-actions">{headerActions}</div>
          )}
        </div>
      </div>

      <div className="page-content">{children}</div>
    </div>
  );
};

export default Page;
