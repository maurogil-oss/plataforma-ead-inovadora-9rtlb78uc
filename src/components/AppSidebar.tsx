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
  LibraryBig,
  Store,
  Film,
  Compass,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'

const getNavigation = (role?: string) => {
  switch (role) {
    case 'admin':
    case 'manager':
      return [
        { name: 'Dashboard', href: '/manager/dashboard', icon: LayoutDashboard },
        { name: 'Acervo Técnico', href: '/store', icon: LibraryBig },
        { name: 'Gestão Comercial', href: '/manager/commercial', icon: Store },
        { name: 'Cursos', href: '/manager/courses', icon: BookOpen },
        { name: 'Aulas ao Vivo', href: '/manager/live-classes', icon: Video },
        { name: 'Fórum Institucional', href: '/forum', icon: MessageSquare },
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
        { name: 'Acervo Técnico', href: '/store', icon: LibraryBig },
        { name: 'Gestão Comercial', href: '/instructor/commercial', icon: Store },
        { name: 'Aulas ao Vivo', href: '/instructor/live-classes', icon: Video },
        { name: 'Fórum Institucional', href: '/forum', icon: MessageSquare },
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
        { name: 'Início', href: '/student/dashboard', icon: Film },
        { name: 'Meu Aprendizado', href: '/student/courses', icon: BookOpen },
        { name: 'Descobrir Especializações', href: '/store', icon: Compass },
        { name: 'Fórum Institucional', href: '/forum', icon: MessageSquare },
        { name: 'Programa de Parceiros', href: '/student/partner', icon: Handshake },
      ]
  }
}

export function AppSidebar() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigation = getNavigation(user?.role)

  return (
    <div className="flex h-full w-72 lg:w-80 flex-col bg-slate-950 text-slate-300 shadow-2xl z-20 relative border-r border-slate-800 transition-all duration-300">
      <div className="flex min-h-[200px] md:min-h-[240px] items-center px-4 md:px-6 py-8 shrink-0 justify-center z-30">
        <Logo className="w-full justify-center relative z-10" imgClassName="h-12 md:h-14 w-auto" />
      </div>

      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar px-3">
        <div className="px-4 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Menu Principal
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href || location.pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-4 rounded-lg px-4 py-3.5 text-[15px] font-bold transition-all duration-300',
                  isActive
                    ? 'bg-slate-800 text-white shadow-md border-l-4 border-primary'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100 hover:translate-x-1 border-l-4 border-transparent',
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-slate-500',
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-4 mt-12 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Institucional
        </div>
        <nav className="space-y-1">
          <Link
            to="/planos"
            className="flex items-center gap-4 rounded-lg px-4 py-3.5 text-[15px] font-bold transition-all duration-300 text-slate-400 hover:bg-slate-900 hover:text-slate-100 hover:translate-x-1 border-l-4 border-transparent"
          >
            <CreditCard className="h-5 w-5 shrink-0 text-slate-500" strokeWidth={2} />
            <span className="truncate">Planos de Investimento</span>
          </Link>
          <Link
            to="/contato"
            className="flex items-center gap-4 rounded-lg px-4 py-3.5 text-[15px] font-bold transition-all duration-300 text-slate-400 hover:bg-slate-900 hover:text-slate-100 hover:translate-x-1 border-l-4 border-transparent"
          >
            <Phone className="h-5 w-5 shrink-0 text-slate-500" strokeWidth={2} />
            <span className="truncate">Central de Contato</span>
          </Link>
          <Link
            to="/sobre"
            className="flex items-center gap-4 rounded-lg px-4 py-3.5 text-[15px] font-bold transition-all duration-300 text-slate-400 hover:bg-slate-900 hover:text-slate-100 hover:translate-x-1 border-l-4 border-transparent"
          >
            <Users className="h-5 w-5 shrink-0 text-slate-500" strokeWidth={2} />
            <span className="truncate">Sobre a Plataforma</span>
          </Link>
        </nav>
      </div>

      <div className="p-5 bg-slate-900/50 shrink-0 border-t border-slate-800/50">
        <div className="flex items-center gap-4 mb-5 px-2">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-lg font-black shadow-inner shrink-0 border border-primary/30">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-extrabold text-white truncate">
              {user?.name || 'Usuário'}
            </span>
            <span className="text-xs text-slate-400 truncate uppercase tracking-widest font-bold mt-0.5">
              {user?.role || 'student'}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-slate-300 border-slate-700 bg-transparent hover:bg-slate-800 hover:text-white hover:border-slate-600 h-12 transition-all duration-300"
          onClick={() => logout()}
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="font-extrabold">Sair da Conta</span>
        </Button>
      </div>
    </div>
  )
}
