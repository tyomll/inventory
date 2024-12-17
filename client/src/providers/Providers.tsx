"use client";
import { PropsWithChildren } from "react";
import { TableStoreProvider } from "./TableStoreProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

export function Providers({ children }: PropsWithChildren) {
  return (
    <TableStoreProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </TableStoreProvider>
  );
}
