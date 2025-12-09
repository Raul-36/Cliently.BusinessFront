import { useState } from "react"
import { BookText, ChevronDown, List, Settings, Home, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useBusiness } from "@/contexts/BusinessContext" // Import useBusiness

// Static menu items. Dynamic items will be inserted based on business data.
const staticMenuItems = [
  {
    title: "Home",
    url: "/", // Corrected URL to navigate to the home page
    icon: Home,
    type: "link"
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    type: "link"
  },
]

export function AppSidebar() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const { business, loading, error } = useBusiness(); // Use the business context
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAccordionClick = (title: string) => {
    setOpenAccordion(openAccordion === title ? null : title)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
    window.location.reload(); // Force a full reload to clear all state
  };

  // Combine static and dynamic menu items
  const allMenuItems = [...staticMenuItems];

  const dynamicItems: any[] = [];

  // Changed conditions to only check for existence of business object and its properties
  if (!loading && !error && business) {
    if (business.texts) { // Only check if 'texts' array exists
      dynamicItems.push({
        title: "Texts",
        icon: BookText,
        type: "accordion",
        subItems: [
          { title: "Add New Text", url: "#" }, // Moved to the beginning
          ...business.texts.map(text => ({ title: text.title, url: `#` }))
        ],
      });
    }

    if (business.lists) { // Only check if 'lists' array exists
      dynamicItems.push({
        title: "Lists",
        icon: List,
        type: "accordion",
        subItems: [
          { title: "Add New List", url: "#" }, // Moved to the beginning
          ...business.lists.map(list => ({ title: list.name, url: `#` }))
        ],
      });
    }
  }

  // Find index of 'Home' in staticMenuItems
  const homeIndex = allMenuItems.findIndex(item => item.title === "Home");
  if (homeIndex !== -1) {
    allMenuItems.splice(homeIndex + 1, 0, ...dynamicItems);
  } else {
    allMenuItems.unshift(...dynamicItems); // If no home, add dynamic items at the beginning
  }


  if (loading) {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem><SidebarMenuButton><Home/><span>Home</span></SidebarMenuButton></SidebarMenuItem>
                            <SidebarMenuItem><SidebarMenuSubButton><BookText/><span>Loading Texts...</span></SidebarMenuSubButton></SidebarMenuItem>
                            <SidebarMenuItem><SidebarMenuSubButton><List/><span>Loading Lists...</span></SidebarMenuSubButton></SidebarMenuItem>
                            <SidebarMenuItem><SidebarMenuButton><Settings/><span>Settings</span></SidebarMenuButton></SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
  }

  if (error) {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem><SidebarMenuButton><Home/><span>Home</span></SidebarMenuButton></SidebarMenuItem>
                            <SidebarMenuItem><p className="text-red-500 p-2">Error: {error}</p></SidebarMenuItem>
                            <SidebarMenuItem><SidebarMenuButton><Settings/><span>Settings</span></SidebarMenuButton></SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allMenuItems.map((item) =>
                item.type === "accordion" ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => handleAccordionClick(item.title)}
                      data-state={
                        openAccordion === item.title ? "open" : "closed"
                      }
                      className="justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform",
                          openAccordion === item.title && "rotate-180"
                        )}
                      />
                    </SidebarMenuButton>
                    {openAccordion === item.title && (
                      <SidebarMenuSub>
                        {item.subItems.map((subItem: {title: string; url: string}) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}