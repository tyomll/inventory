import * as React from "react";
import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { useTableStore } from "@/providers/TableStoreProvider";
import { AxiosPromise } from "axios";
import { useState } from "react";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  icon: React.ReactNode;
  options: {
    label: string;
    value: string;
  }[];
  filterBy?: string;
  onFilter?: (val: string) => AxiosPromise | undefined;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  icon,
  options,
  filterBy,
  onFilter,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const [selectedValue, setSelectedValue] = useState("");
  const { setTableData, setFilters } = useTableStore((state) => state);

  const setFilter = async (value: string) => {
    if (!filterBy) return;

    const response = await onFilter?.(value);
    setFilters({ [filterBy]: value });
    setTableData(response?.data.data);
  };

  if (!onFilter) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          {icon}
          {title}
          {selectedValue && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="hidden space-x-1 lg:flex">
                {options
                  .filter((option) => option.value === selectedValue)
                  .map((option) => {
                    return (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    );
                  })}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        {/* Getting typescript warning because of React 19 */}
        {/* Remove ts-ignore after fix */}

        {/* @ts-expect-error */}
        <Command>
          {/* @ts-expect-error */}
          <CommandInput placeholder={title} />
          {/* @ts-expect-error */}
          <CommandList>
            {/* @ts-expect-error */}

            <CommandEmpty>Nothing found.</CommandEmpty>
            {/* @ts-expect-error */}

            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                  // @ts-expect-error
                  <CommandItem
                    key={String(option.value)}
                    onSelect={() => {
                      if (isSelected) {
                        setSelectedValue("");
                        setFilter("");
                      } else {
                        setSelectedValue(option.value);
                        setFilter(option.value);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValue && (
              <>
                <CommandSeparator />
                {/* @ts-expect-error */}
                <CommandGroup>
                  {/* @ts-expect-error */}
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Reset Filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
