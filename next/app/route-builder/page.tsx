"use client";

import Map from "./map";
import { useOverpass } from "./useOverpass";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Page() {
  const { fetchCycleways, fetchOneways } = useOverpass();
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* <SidebarInset> */}
      <main className="w-full h-screen overflow-hidden flex flex-col">
        <Map fetchCycleways={fetchCycleways} fetchOneways={fetchOneways} />
      </main>
      {/* </SidebarInset> */}
    </SidebarProvider>
  );
}
