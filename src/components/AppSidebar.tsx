import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, PlaySquare, BookOpen, Users } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  const studentNav = [{ title: 'Área do Aluno', icon: PlaySquare, url: '/student' }]

  const managerNav = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/manager' },
    { title: 'Gestão de Cursos', icon: BookOpen, url: '/manager/courses' },
    { title: 'Gestão de Alunos', icon: Users, url: '/manager/enrollments' },
  ]

  const navItems = user?.role === 'manager' ? managerNav : studentNav

  return (
    <Sidebar variant="inset" className="border-r bg-muted/10">
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="bg-primary p-1.5 rounded-md text-primary-foreground">
            <BookOpen className="size-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Olimpo EAD</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 mt-6">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.url ||
              (item.url !== '/manager' &&
                item.url !== '/student' &&
                location.pathname.startsWith(item.url))

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link
                    to={item.url}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200',
                      isActive
                        ? 'text-primary bg-primary/10 font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                    )}
                  >
                    <item.icon className="size-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
