import { useState } from "react"
import { BookText, ChevronDown, List, Settings, Home, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

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
import type { LucideIcon } from "lucide-react"

// Типы для элементов
type SidebarSubItem = {
  id: string
  title: string
  url: string
  isCreate?: boolean
}

type SidebarItem =
  | { type: "link"; title: string; url: string; icon: LucideIcon }
  | { type: "accordion"; title: string; icon: LucideIcon; subItems: SidebarSubItem[] }

// Type guard для аккордеонов
function isAccordion(item: SidebarItem): item is Extract<SidebarItem, { type: "accordion" }> {
  return item.type === "accordion"
}

// Статическое меню
const staticMenuItems: SidebarItem[] = [
  { title: "Home", url: "/", icon: Home, type: "link" },
  { title: "Settings", url: "/settings", icon: Settings, type: "link" },
]

export function AppSidebar() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const { business, loading, error } = useBusiness()
  const navigate = useNavigate()

  const handleAccordionClick = (title: string) => {
    setOpenAccordion(openAccordion === title ? null : title)
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/login")
    window.location.reload()
  }

  // Динамические элементы меню
  const dynamicItems: SidebarItem[] = []

  if (!loading && !error && business) {
    if (business.texts) {
      dynamicItems.push({
        title: "Texts",
        icon: BookText,
        type: "accordion",
        subItems: [
          { id: "add-new-text", title: "Add New Text", url: "/create-text", isCreate: true },
          ...business.texts.map(text => ({
            id: text.id,
            title: text.name,
            url: `/texts/${text.id}`,
          })),
        ],
      })
    }

    if (business.lists) {
      dynamicItems.push({
        title: "Lists",
        icon: List,
        type: "accordion",
        subItems: [
          { id: "add-new-list", title: "Add New List", url: "/create-list", isCreate: true },
          ...business.lists.map(list => ({
            id: list.id,
            title: list.name,
            url: `/lists/${list.id}`,
          })),
        ],
      })
    }
  }

  const allMenuItems: SidebarItem[] = [...staticMenuItems, ...dynamicItems]

  // Меню при загрузке
  if (loading) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Home />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSubButton>
                    <BookText />
                    <span>Loading Texts...</span>
                  </SidebarMenuSubButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSubButton>
                    <List />
                    <span>Loading Lists...</span>
                  </SidebarMenuSubButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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

  // Меню при ошибке
  if (error) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Home />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <p className="text-red-500 p-2">Error: {error}</p>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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

  // Основное меню
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allMenuItems.map(item => {
                if (isAccordion(item)) {
                  const accordionItem = item // TypeScript теперь знает, что это аккордеон
                  return (
                    <SidebarMenuItem key={accordionItem.title}>
                      <SidebarMenuButton
                        onClick={() => handleAccordionClick(accordionItem.title)}
                        data-state={openAccordion === accordionItem.title ? "open" : "closed"}
                        className="justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <accordionItem.icon />
                          <span>{accordionItem.title}</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform",
                            openAccordion === accordionItem.title && "rotate-180"
                          )}
                        />
                      </SidebarMenuButton>
                      {openAccordion === accordionItem.title && (
                        <SidebarMenuSub>
                          {accordionItem.subItems.map(subItem => (
                            <SidebarMenuSubItem key={subItem.id}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  to={subItem.url}
                                  className={cn(
                                    subItem.isCreate && "!text-green-600 hover:!text-green-700 font-medium"
                                  )}
                                >
                                  {subItem.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  )
                }

                // Обычная ссылка
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
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
