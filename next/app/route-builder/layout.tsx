import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen overflow-hidden flex flex-col">
        <SidebarTrigger className="-ml-1" />
        {children}
      </main>
    </SidebarProvider>
  );
}
