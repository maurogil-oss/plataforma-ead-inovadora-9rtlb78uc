import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  PlaySquare,
  BookOpen,
  Users,
  BarChart,
  CreditCard,
  Database,
  BellRing,
  CheckCircle,
  Webhook,
  Handshake,
  Percent,
  Wallet,
} from 'lucide-react'
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

  const studentNav = [
    { title: 'Área do Aluno', icon: PlaySquare, url: '/student' },
    { title: 'Programa de Parceiros', icon: Handshake, url: '/student/partner' },
  ]

  const managerNav = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/manager' },
    { title: 'Gestão de Cursos', icon: BookOpen, url: '/manager/courses' },
    { title: 'Gestão de Alunos', icon: Users, url: '/manager/enrollments' },
    { title: 'Banco de Questões', icon: Database, url: '/manager/questions' },
    { title: 'Relatórios', icon: BarChart, url: '/manager/reports' },
    { title: 'Taxas & Comissões', icon: Percent, url: '/manager/settings/commissions' },
    { title: 'Relatório Financeiro', icon: Wallet, url: '/manager/settings/financial' },
    { title: 'Programa de Parceiros', icon: Handshake, url: '/manager/partner' },
    { title: 'Integração Pagamentos', icon: CreditCard, url: '/manager/settings/payments' },
    { title: 'Avisos Automáticos', icon: BellRing, url: '/manager/settings/notifications' },
    { title: 'Webhooks (Integrações)', icon: Webhook, url: '/manager/settings/integrations' },
  ]

  const instructorNav = [
    { title: 'Meu Painel', icon: LayoutDashboard, url: '/instructor' },
    { title: 'Meus Cursos', icon: BookOpen, url: '/instructor/courses' },
    { title: 'Meus Alunos', icon: Users, url: '/instructor/enrollments' },
    { title: 'Corrigir Provas', icon: CheckCircle, url: '/instructor/grading' },
    { title: 'Banco de Questões', icon: Database, url: '/instructor/questions' },
    { title: 'Minhas Receitas', icon: Wallet, url: '/instructor/revenue' },
    { title: 'Programa de Parceiros', icon: Handshake, url: '/instructor/partner' },
  ]

  const navItems =
    user?.role === 'manager' ? managerNav : user?.role === 'instructor' ? instructorNav : studentNav

  const getBaseRoute = (url: string) => {
    if (url === '/manager' || url === '/instructor' || url === '/student') return url
    return url.split('/').slice(0, 3).join('/')
  }

  return (
    <Sidebar variant="inset" className="border-r bg-muted/10">
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="bg-primary p-1.5 rounded-md text-primary-foreground shadow-sm">
            <BookOpen className="size-5" />
          </div>
          <span className="font-bold text-sm tracking-tight leading-tight">
            Observatório Academy (DEMO)
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 mt-6">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.url ||
              (item.url !== '/manager' &&
                item.url !== '/instructor' &&
                item.url !== '/student' &&
                location.pathname.startsWith(getBaseRoute(item.url)))
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
