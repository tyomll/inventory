"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, ChevronDown, LogOut, PackagePlus } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { deleteCookie } from "cookies-next";

const links = [
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Boxes,
  },
  {
    title: "Create Product",
    url: "/dashboard/create-product",
    icon: PackagePlus,
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    deleteCookie("token");
    router.push("/auth/login");
  };

  if (pathname.includes("login") || pathname.includes("register")) return null;

  return (
    <Sidebar>
      <SidebarHeader>
        <span className="mx-2 font-semibold text-gray-600">
          Inventory Dashboard
        </span>
      </SidebarHeader>
      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel className="flex justify-between items-center">
              Products
              <CollapsibleTrigger>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {links.map((link) => (
                    <SidebarMenuItem key={link.title}>
                      <SidebarMenuButton asChild>
                        <a href={link.url}>
                          <link.icon />
                          <span>{link.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={logout}>
            <LogOut />
            <span>Log out</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
