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
import { useBusiness } from "@/contexts/BusinessContext"

const staticMenuItems = [
  {
    title: "Home",
    url: "/",
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
  const { business, loading, error } = useBusiness();
  const navigate = useNavigate();

  const handleAccordionClick = (title: string) => {
    setOpenAccordion(openAccordion === title ? null : title)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
    window.location.reload();
  };
  const allMenuItems = [...staticMenuItems];
  const dynamicItems: any[] = [];
  if (!loading && !error && business) {
    if (business.texts) {
      dynamicItems.push({
        title: "Texts",
        icon: BookText,
        type: "accordion",
        subItems: [
          {
            id: "add-new-text",
            title: "Add New Text",
            url: "/create-text",
            isCreate: true,
          },
          ...business.texts.map(text => ({
            id: text.id,
            title: text.name,
            url: `/texts/${text.id}`,
          })),
        ],

      });
    }

    if (business.lists) {
      dynamicItems.push({
        title: "Lists",
        icon: List,
        type: "accordion",
        subItems: [
          { id: "add-new-list", title: "Add New List", url: "/create-list", isCreate: true },
          ...business.lists.map(list => ({ id: list.id, title: list.name, url: `/lists/${list.id}` }))
        ],
      });
    }
  }


  const homeIndex = allMenuItems.findIndex(item => item.title === "Home");
  if (homeIndex !== -1) {
    allMenuItems.splice(homeIndex + 1, 0, ...dynamicItems);
  } else {
    allMenuItems.unshift(...dynamicItems);
  }


  if (loading) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem><SidebarMenuButton><Home /><span>Home</span></SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuSubButton><BookText /><span>Loading Texts...</span></SidebarMenuSubButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuSubButton><List /><span>Loading Lists...</span></SidebarMenuSubButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton><Settings /><span>Settings</span></SidebarMenuButton></SidebarMenuItem>
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
                <SidebarMenuItem><SidebarMenuButton><Home /><span>Home</span></SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><p className="text-red-500 p-2">Error: {error}</p></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton><Settings /><span>Settings</span></SidebarMenuButton></SidebarMenuItem>
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
                        {item.subItems.map((subItem: { id: string; title: string; url: string }) => (
                          <SidebarMenuSubItem key={subItem.id}>
                            <SidebarMenuSubButton asChild>
                              <a
                                href={subItem.url}
                                className={cn(
                                  subItem.isCreate &&
                                  "text-green-600 hover:text-green-700 font-medium"
                                )}
                              >
                                {subItem.title}
                              </a>
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