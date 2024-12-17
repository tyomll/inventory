"use client";
import { Product } from "@/types/entities.types";
import React from "react";
import { DataTable } from "../DataTable/DataTable";
import { getProducts } from "@/api/api";
import { productsColumns } from "../DataTable/columns/Products";
import { DataTableFilter } from "@/types/dataTable.types";
import { stockStatuses } from "../DataTable/filters";
import { Layers } from "lucide-react";
import { useTableStore } from "@/providers/TableStoreProvider";

interface Props {
  products: Product[];
  rowsCount: number;
}

const FILTERS: DataTableFilter[] = [
  {
    columnId: "stock",
    title: "Stock",
    options: stockStatuses,
    icon: <Layers className="mr-2 h-4 w-4" />,
  },
];

const Products = ({ products, rowsCount }: Props) => {
  const { filters } = useTableStore((state) => state);
  return (
    <DataTable
      data={products}
      columns={productsColumns}
      onSearch={(val) => getProducts({ ...filters, search: val })}
      onFilter={(val) => getProducts({ ...filters, stockStatus: val })}
      filterBy="stockStatus"
      tableName="Products"
      rowsCount={rowsCount}
      filters={FILTERS}
      loadMoreFunc={(limit, page) => getProducts({ ...filters, limit, page })}
    />
  );
};

export default Products;
