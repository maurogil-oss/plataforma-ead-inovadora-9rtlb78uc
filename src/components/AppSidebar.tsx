import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  PlaySquare,
  Route,
  Users,
  Award,
  HelpCircle,
  Settings,
  ShieldAlert,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
  { title: 'Meus Cursos', icon: PlaySquare, url: '/course/c1' },
  { title: 'Trilhas', icon: Route, url: '#' },
  { title: 'Comunidade', icon: Users, url: '/community' },
  { title: 'Conquistas', icon: Award, url: '/profile' },
]

const bottomNavItems = [
  { title: 'Ajuda', icon: HelpCircle, url: '#' },
  { title: 'Configurações', icon: Settings, url: '#' },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar variant="inset" className="border-r border-white/5 bg-background/50 backdrop-blur-xl">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg text-primary-foreground group-hover:animate-pulse-glow transition-all">
            <ShieldAlert className="size-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            ONSV <span className="text-primary font-normal">Evolution</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 mt-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.url ||
              (item.url !== '/' && location.pathname.startsWith(item.url))
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link
                    to={item.url}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 relative overflow-hidden',
                      isActive
                        ? 'text-primary bg-primary/10 font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full" />
                    )}
                    <item.icon className="size-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link to={item.url} className="text-muted-foreground hover:text-foreground">
                  <item.icon className="size-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
