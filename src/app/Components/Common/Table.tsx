"use client";
import React from "react";
import {
  Table as ShadcnTable,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  highlightOnHover?: boolean;
  verticalSpacing?: "xs" | "sm" | "md" | "lg" | "xl";
  horizontalSpacing?: "xs" | "sm" | "md" | "lg" | "xl";
  fixedHeader?: boolean;
}

const Table: React.FC<TableProps> = ({
  striped = false,
  highlightOnHover = true, // eslint-disable-line @typescript-eslint/no-unused-vars
  verticalSpacing = "sm", // eslint-disable-line @typescript-eslint/no-unused-vars
  horizontalSpacing = "md", // eslint-disable-line @typescript-eslint/no-unused-vars
  fixedHeader = false, // eslint-disable-line @typescript-eslint/no-unused-vars
  className = "",
  children,
  ...rest
}) => {
  return (
    <ShadcnTable
      className={cn(
        striped && "[&_tbody_tr:nth-child(even)]:bg-muted/50",
        className
      )}
      {...rest}
    >
      {children}
    </ShadcnTable>
  );
};

export default Table;
