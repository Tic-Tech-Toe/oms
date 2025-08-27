import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import PageSelection from "./PageSelection";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { OrderType } from "@/types/orderType";
import { PaginationType } from "../Table/TableArea";
import { Table } from "@tanstack/react-table";

const Pagination = ({
  table,
  pagination,
  setPagination,
}: {
  table: Table<OrderType>;
  pagination: PaginationType;
  setPagination: Dispatch<SetStateAction<PaginationType>>;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="w-full border-t bg-light-background dark:bg-zinc-900 px-3 py-2 flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Page selection dropdown */}
      <PageSelection pagination={pagination} setPagination={setPagination} />

      {/* Page info + controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="text-xs sm:text-sm text-gray-500">
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </span>

        <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 dark:bg-zinc-800 rounded-full p-1">
          {/* First page */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronFirst size={14} />
          </Button>

          {/* Previous */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={14} />
          </Button>

          {/* Next */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={14} />
          </Button>

          {/* Last */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronLast size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
