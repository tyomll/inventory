"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination, TABLE_DATA_LIMIT } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";
import { AxiosPromise } from "axios";
import { useTableStore } from "@/providers/TableStoreProvider";
import { DataTableFilter } from "@/types/dataTable.types";
import { exportExcel } from "@/utils/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableName: string;
  filters?: DataTableFilter[];
  onSearch?: (val: string) => AxiosPromise;
  filterBy?: string;
  onFilter?: (val: string) => AxiosPromise;
  deleteFunc?: (ids: number[] | string) => Promise<any>;
  deletionRowName?: string;
  rowsCount: number;
  loadMoreFunc?: (
    limit: number,
    page: number
  ) => AxiosPromise<{ data: TData[] }>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tableName,
  filters,
  onSearch,
  filterBy,
  onFilter,
  deleteFunc,
  deletionRowName,
  rowsCount,
  loadMoreFunc,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [pageSize, setPageSize] = React.useState(TABLE_DATA_LIMIT);
  const [pageIndex, setPageIndex] = React.useState(0);

  const { tableData, setTableData } = useTableStore((state: any) => state);

  const table = useReactTable({
    data: tableData,
    columns: columns as any,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: { pageSize, pageIndex },
    },
    enableRowSelection: true,
    manualPagination: true,
    rowCount: rowsCount,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const state = updater({ pageSize, pageIndex });
        setPageSize(state.pageSize);
        setPageIndex(state.pageIndex);
      } else {
        setPageSize(updater.pageSize);
        setPageIndex(updater.pageIndex);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handleExport = () => {
    exportExcel(table.getFilteredRowModel().rows);
  };

  React.useEffect(() => {
    setTableData(data || []);
  }, [data]);

  return (
    <div className="flex flex-col mt-4 space-y-4">
      <DataTableToolbar
        table={table}
        filters={filters}
        onSearch={onSearch}
        filterBy={filterBy}
        onFilter={onFilter}
        deleteFunc={deleteFunc}
        deletionRowName={deletionRowName}
      />

      <div className="space-y-4 overflow-y-auto rounded-xl bg-sidebar border border-sidebar-border p-5">
        <p className="text-h4 text-black-100">{tableName}</p>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell key={cell.id} tabIndex={i}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Button onClick={handleExport} className="self-end">
        <Download />
        Export CSV
      </Button>
      <DataTablePagination table={table} loadMoreFunc={loadMoreFunc} />
    </div>
  );
}
