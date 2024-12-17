import { ReactNode } from "react";

export interface DataTableFilter {
  columnId: string;
  title: string;
  icon: ReactNode;
  options: {
    value: string;
    label: string;
  }[];
}
