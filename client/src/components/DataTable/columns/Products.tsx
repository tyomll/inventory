import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { Products } from "../schema";
import { truncate } from "lodash";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const productsColumns: ColumnDef<Products, unknown>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="text-black-100 w-[40px] text-xs">
        {row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-black-100 w-[100px]">{row.getValue("name")}</div>
      );
    },
  },
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-black-100 w-[100px]">{row.getValue("sku")}</div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="text-black-100 w-[90px]">
        {truncate(row.getValue("description"), { length: 20 })}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <div className="text-black-100 w-[70px]">
        {truncate(row.getValue("category"), { length: 20 })}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-black-100 w-[50px]">{row.getValue("price")}</div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const isLowStock = (row.getValue("stock") as number) < 10;
      return (
        <div
          className={`text-black-100 w-[50px] ${isLowStock && "text-red-500"}`}
        >
          {row.getValue("stock")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link href={`/dashboard/products/${row.getValue("id")}`}>
        <ExternalLink width={16} height={16} />
      </Link>
    ),
  },
];
