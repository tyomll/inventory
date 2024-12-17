import { Query } from "@/api/types";
import { findIndex } from "lodash";
import { createStore } from "zustand/vanilla";

export interface TableState {
  tableData: any[];
  editingData: any;
  filters: {};
}

export interface TableActions {
  setTableData: (tableData: any[]) => void;
  setEditingData: (editingData: any) => void;
  saveEditedData: (fieldKey: string) => void;
  filterTableDataById: (id: number, filterField: string) => void;
  filterTableDataByIds: (ids: number[], deletionRowName?: string) => void;
  setFilters: (filters: Query) => void;
}

export type TableStore = TableState & TableActions;

export const initTableStore = (): TableState => {
  return { tableData: [], editingData: {}, filters: {} };
};

export const defaultInitState: TableState = {
  tableData: [],
  editingData: {},
  filters: {},
};

export const createTableStore = (initState: TableState = defaultInitState) => {
  return createStore<TableStore>()((set) => ({
    ...initState,
    setTableData: (tableData) => set({ tableData }),
    setEditingData: (editingData) => set({ editingData }),
    saveEditedData: (key: string) => {
      const fieldKey = key || "serial_id";
      set((state) => {
        const index = findIndex(state.tableData, {
          [fieldKey]: state.editingData[fieldKey],
        });

        const updatedTableData = [...state.tableData];
        updatedTableData.splice(index, 1, state.editingData);

        return { tableData: updatedTableData, editingData: {} };
      });
    },
    filterTableDataById: (id, filterField) => {
      set((state) => ({
        tableData: state.tableData.filter((r) => r[filterField] !== id),
      }));
    },
    filterTableDataByIds: (ids, deletionRowName) => {
      set((state) => ({
        tableData: state.tableData.filter(
          (r) => !ids.includes(deletionRowName ? r[deletionRowName] : r.id)
        ),
      }));
    },
    setFilters: (filters) =>
      set((state) => ({ filters: { ...state.filters, ...filters } })),
  }));
};
