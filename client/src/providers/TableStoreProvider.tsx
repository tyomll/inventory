"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type TableStore,
  createTableStore,
  initTableStore,
} from "@/stores/table";

export type TableStoreApi = ReturnType<typeof createTableStore>;

export const TableStoreContext = createContext<TableStoreApi | undefined>(
  undefined
);

export interface TableStoreProviderProps {
  children: ReactNode;
}

export const TableStoreProvider = ({ children }: TableStoreProviderProps) => {
  const storeRef = useRef<TableStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createTableStore(initTableStore());
  }

  return (
    <TableStoreContext.Provider value={storeRef.current}>
      {children}
    </TableStoreContext.Provider>
  );
};

export const useTableStore = <T,>(selector: (store: TableStore) => T): T => {
  const tableStoreContext = useContext(TableStoreContext);

  if (!tableStoreContext) {
    throw new Error(`useTableStore must be used within TableStoreProvider`);
  }

  return useStore(tableStoreContext, selector);
};
