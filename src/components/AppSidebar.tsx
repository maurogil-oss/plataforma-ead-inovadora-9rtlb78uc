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
    <div className="flex h-full w-72 lg:w-80 flex-col border-r border-brand/20 bg-brand text-brand-foreground shadow-xl z-20 relative">
      <div className="flex h-24 md:h-28 items-center px-6 border-b border-white/10 bg-brand py-4 shrink-0">
        <Link to="/" className="flex items-center gap-3 w-full group justify-start overflow-hidden">
          <Logo
            imgClassName="h-16 md:h-20 w-auto max-w-[240px] object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
            className="text-white"
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        <div className="px-5 mb-3 text-[11px] font-extrabold text-white/50 uppercase tracking-widest">
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
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md translate-x-1'
                    : 'text-brand-foreground/80 hover:bg-white/10 hover:text-white hover:translate-x-1',
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    isActive ? 'text-primary-foreground' : 'text-brand-foreground/60',
                  )}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-5 mt-10 mb-3 text-[11px] font-extrabold text-white/50 uppercase tracking-widest">
          Institucional
        </div>
        <nav className="space-y-1.5 px-3">
          <Link
            to="/cursos"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-semibold transition-all duration-200 text-brand-foreground/80 hover:bg-white/10 hover:text-white hover:translate-x-1"
          >
            <BookOpen className="h-5 w-5 shrink-0 text-brand-foreground/60" />
            <span className="truncate">Catálogo de Cursos</span>
          </Link>
          <Link
            to="/planos"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-semibold transition-all duration-200 text-brand-foreground/80 hover:bg-white/10 hover:text-white hover:translate-x-1"
          >
            <CreditCard className="h-5 w-5 shrink-0 text-brand-foreground/60" />
            <span className="truncate">Planos de Assinatura</span>
          </Link>
          <Link
            to="/contato"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-semibold transition-all duration-200 text-brand-foreground/80 hover:bg-white/10 hover:text-white hover:translate-x-1"
          >
            <Phone className="h-5 w-5 shrink-0 text-brand-foreground/60" />
            <span className="truncate">Central de Contato</span>
          </Link>
          <Link
            to="/sobre"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-semibold transition-all duration-200 text-brand-foreground/80 hover:bg-white/10 hover:text-white hover:translate-x-1"
          >
            <Users className="h-5 w-5 shrink-0 text-brand-foreground/60" />
            <span className="truncate">Sobre o Observatório</span>
          </Link>
        </nav>
      </div>

      <div className="border-t border-white/10 p-5 bg-brand/95 shrink-0">
        <div className="flex items-center gap-4 mb-5 px-1">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold shadow-inner shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-base font-bold text-white truncate">
              {user?.name || 'Usuário'}
            </span>
            <span className="text-sm text-brand-foreground/60 truncate capitalize font-medium">
              {user?.role || 'student'}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-brand-foreground/80 border-white/20 bg-transparent hover:bg-white/10 hover:text-white hover:border-white/30 h-11"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span className="font-bold">Sair do Sistema</span>
        </Button>
      </div>
    </div>
  )
}
