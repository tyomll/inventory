"use client";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { AxiosPromise } from "axios";
import { useTableStore } from "@/providers/TableStoreProvider";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  loadMoreFunc?: (limit: number, page: number) => AxiosPromise;
}

export const TABLE_DATA_LIMIT = 10;
export function DataTablePagination<TData>({
  table,
  loadMoreFunc,
}: DataTablePaginationProps<TData>) {
  const { setTableData } = useTableStore((state: any) => state);

  const loadData = async (pageIndex: number) => {
    const response = await loadMoreFunc?.(TABLE_DATA_LIMIT, pageIndex);
    const newTableData = response?.data.data;

    if (newTableData) {
      setTableData(newTableData);
    }
  };

  const handleNextPage = async () => {
    const nextPageIndex = table.getState().pagination.pageIndex + 1;
    await loadData(nextPageIndex);
    table.setPageIndex(nextPageIndex);
  };

  const handlePreviousPage = async () => {
    const prevPageIndex = table.getState().pagination.pageIndex - 1;
    await loadData(prevPageIndex);
    table.setPageIndex(prevPageIndex);
  };

  const handleGoToFirstPage = async () => {
    await loadData(0);
    table.setPageIndex(0);
  };

  const handleGoToLastPage = async () => {
    const lastPageIndex = table.getPageCount() - 1;
    await loadData(lastPageIndex);
    table.setPageIndex(lastPageIndex);
  };

  return (
    <div className="flex flex-col items-center justify-between space-y-4 px-2 lg:flex-row lg:space-y-0">
      <div className="flex w-full justify-between items-center space-x-2">
        <div className="flex items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleGoToFirstPage}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handlePreviousPage}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleNextPage}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleGoToLastPage}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
