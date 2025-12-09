import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset> {/* Use SidebarInset for the main content area */}
        <div className="relative h-full w-full flex flex-col items-center justify-center"> {/* Container for centering content */}
          <div className="absolute top-2 left-2 z-50"> {/* Position the trigger */}
            <SidebarTrigger />
          </div>
          <div className="flex-grow flex items-center justify-center w-full"> {/* Inner container for actual content centering */}
             {children} {/* The actual page content */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}