"use client";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { RotateCcw, TrashIcon } from "lucide-react";
import { debounce } from "lodash";
import { AxiosPromise } from "axios";
import { useTableStore } from "@/providers/TableStoreProvider";
import { DataTableFilter } from "@/types/dataTable.types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters?: DataTableFilter[];
  onSearch?: (val: string) => AxiosPromise;
  filterBy?: string;
  onFilter?: (val: string) => AxiosPromise;
  deleteFunc?: (userIds: number[]) => Promise<any>;
  deletionRowName?: string;
}

export function DataTableToolbar<TData>({
  table,
  filters,
  onSearch,
  filterBy,
  onFilter,
  deleteFunc,
  deletionRowName = "system_id",
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { setFilters, setTableData } = useTableStore((state: any) => state);

  const debouncedSearch = debounce(async (val: string) => {
    if (onSearch !== undefined) {
      const response = await onSearch(val);
      const searchedData = response.data.data;
      setTableData(searchedData);
    }
  }, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e?.target?.value;
    setFilters({ search: val });
    debouncedSearch(val);
  };

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {onSearch && (
          <div>
            <Input
              placeholder="Search..."
              onChange={handleSearch}
              className="h-8 w-[150px] outline-none lg:w-[250px]"
            />
          </div>
        )}
        {filters &&
          filters?.map((filter, i: number) => (
            <DataTableFacetedFilter
              key={i}
              column={table.getColumn(filter.columnId)}
              filterBy={filterBy}
              onFilter={(value) => onFilter?.(value)}
              icon={filter.icon}
              title={filter.title}
              options={filter.options}
            />
          ))}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <RotateCcw className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Button
            variant="outline"
            size="sm"
            className="!h-8"
            onClick={async () => {
              const rows = table.getFilteredSelectedRowModel().rows;
              const ids: number[] = rows.map((r) =>
                r.getValue(deletionRowName)
              );

              await deleteFunc?.(ids);
              table.resetRowSelection();
            }}
          >
            <TrashIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
