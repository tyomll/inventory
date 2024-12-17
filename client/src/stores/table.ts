import { Query } from "@/api/types";
import { createStore } from "zustand/vanilla";

export interface TableState {
  tableData: any[];
  filters: {};
}

export interface TableActions {
  setTableData: (tableData: any[]) => void;
  setFilters: (filters: Query) => void;
}

export type TableStore = TableState & TableActions;

export const initTableStore = (): TableState => {
  return { tableData: [], filters: {} };
};

export const defaultInitState: TableState = {
  tableData: [],
  filters: {},
};

export const createTableStore = (initState: TableState = defaultInitState) => {
  return createStore<TableStore>()((set) => ({
    ...initState,
    setTableData: (tableData) => set({ tableData }),
    setFilters: (filters) =>
      set((state) => ({ filters: { ...state.filters, ...filters } })),
  }));
};
