import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  LayoutDashboard,
  Settings,
  Users,
  CreditCard,
  PieChart,
  Bell,
  CheckCircle,
  LogOut,
  Wallet,
  ShieldAlert,
  Handshake,
  Phone,
  Video,
  Bot,
  Activity,
  ShoppingCart,
  Store,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'

const getNavigation = (role?: string) => {
  switch (role) {
    case 'admin':
    case 'manager':
      return [
        { name: 'Dashboard', href: '/manager/dashboard', icon: LayoutDashboard },
        { name: 'Loja / Marketplace', href: '/store', icon: ShoppingCart },
        { name: 'Gestão Comercial', href: '/manager/commercial', icon: Store },
        { name: 'Cursos', href: '/manager/courses', icon: BookOpen },
        { name: 'Aulas ao Vivo', href: '/manager/live-classes', icon: Video },
        { name: 'Matrículas', href: '/manager/enrollments', icon: Users },
        { name: 'Relatórios', href: '/manager/reports', icon: PieChart },
        { name: 'Financeiro', href: '/manager/finance', icon: CreditCard },
        { name: 'Gerador de Aulas AI', href: '/manager/lesson-generator', icon: Bot },
        { name: 'Comunicações', href: '/manager/notifications', icon: Bell },
        { name: 'Configurações', href: '/manager/integrations', icon: Settings },
        { name: 'Parceiros', href: '/partner/dashboard', icon: Handshake },
      ]
    case 'instructor':
      return [
        { name: 'Dashboard', href: '/instructor/dashboard', icon: LayoutDashboard },
        { name: 'Loja / Marketplace', href: '/store', icon: ShoppingCart },
        { name: 'Gestão Comercial', href: '/instructor/commercial', icon: Store },
        { name: 'Aulas ao Vivo', href: '/instructor/live-classes', icon: Video },
        { name: 'Engajamento', href: '/instructor/engagement', icon: Activity },
        { name: 'Avaliar Provas', href: '/instructor/grade-exams', icon: CheckCircle },
        { name: 'Gerador de Aulas AI', href: '/instructor/lesson-generator', icon: Bot },
        { name: 'Banco de Questões', href: '/instructor/questions', icon: ShieldAlert },
        { name: 'Minha Receita', href: '/instructor/revenue', icon: Wallet },
        { name: 'Área de Parceiros', href: '/instructor/partner', icon: Handshake },
      ]
    case 'student':
    default:
      return [
        { name: 'Meu Aprendizado', href: '/student/dashboard', icon: BookOpen },
        { name: 'Loja / Marketplace', href: '/store', icon: ShoppingCart },
        { name: 'Programa de Parceiros', href: '/student/partner', icon: Handshake },
      ]
  }
}

export function AppSidebar() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigation = getNavigation(user?.role)

  return (
    <div className="flex h-full w-72 flex-col border-r border-brand/20 bg-brand text-brand-foreground shadow-xl">
      <div className="flex h-20 items-center px-6 border-b border-white/10 bg-brand">
        <Link to="/" className="flex items-center gap-3 w-full group">
          <Logo className="h-10 w-auto transition-transform duration-300 group-hover:scale-105 text-white" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        <div className="px-4 mb-2 text-xs font-bold text-white/50 uppercase tracking-wider">
          Menu Principal
        </div>
        <nav className="space-y-1.5 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-brand-foreground/80 hover:bg-white/10 hover:text-white',
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    isActive ? 'text-primary-foreground' : 'text-brand-foreground/60',
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 mt-8 mb-2 text-xs font-bold text-white/50 uppercase tracking-wider">
          Institucional
        </div>
        <nav className="space-y-1.5 px-3">
          <Link
            to="/cursos"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 text-brand-foreground/80 hover:bg-white/10 hover:text-white"
          >
            <BookOpen className="h-5 w-5 text-brand-foreground/60" />
            Catálogo de Cursos
          </Link>
          <Link
            to="/planos"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 text-brand-foreground/80 hover:bg-white/10 hover:text-white"
          >
            <CreditCard className="h-5 w-5 text-brand-foreground/60" />
            Planos de Assinatura
          </Link>
          <Link
            to="/contato"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 text-brand-foreground/80 hover:bg-white/10 hover:text-white"
          >
            <Phone className="h-5 w-5 text-brand-foreground/60" />
            Central de Contato
          </Link>
          <Link
            to="/sobre"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 text-brand-foreground/80 hover:bg-white/10 hover:text-white"
          >
            <Users className="h-5 w-5 text-brand-foreground/60" />
            Sobre o Observatório
          </Link>
        </nav>
      </div>

      <div className="border-t border-white/10 p-4 bg-brand/90">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-inner">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-white truncate">{user?.name || 'Usuário'}</span>
            <span className="text-xs text-brand-foreground/60 truncate capitalize font-medium">
              {user?.role || 'student'}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-brand-foreground/80 border-white/20 bg-transparent hover:bg-white/10 hover:text-white"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair do Sistema
        </Button>
      </div>
    </div>
  )
}
