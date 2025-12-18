import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset> 
        <div className="relative flex flex-col h-full"> 
          <div className="absolute top-2 left-2 z-50"> 
            <SidebarTrigger />
          </div>
          <div className="flex-grow flex w-full"> 
             {children} 
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}