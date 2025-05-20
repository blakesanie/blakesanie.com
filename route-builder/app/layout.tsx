import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <title>Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full h-screen overflow-hidden flex flex-col">
            <SidebarTrigger className="-ml-1" />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
