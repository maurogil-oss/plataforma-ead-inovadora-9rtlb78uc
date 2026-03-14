import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { LogOut, Menu } from 'lucide-react'
import { Logo } from '@/components/Logo'

export function TopHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-brand hover:bg-slate-100"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-3 group">
            <Logo className="h-9 w-auto transition-transform duration-300 group-hover:scale-105" />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 ml-6 border-l border-slate-200 pl-6">
            <Link
              to="/cursos"
              className="text-sm font-bold text-brand hover:text-primary transition-colors uppercase tracking-wide"
            >
              Cursos
            </Link>
            <Link
              to="/store"
              className="text-sm font-bold text-brand hover:text-primary transition-colors uppercase tracking-wide"
            >
              Loja
            </Link>
            <Link
              to="/planos"
              className="text-sm font-bold text-brand hover:text-primary transition-colors uppercase tracking-wide"
            >
              Planos
            </Link>
            <Link
              to="/contato"
              className="text-sm font-bold text-brand hover:text-primary transition-colors uppercase tracking-wide"
            >
              Contato
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-brand hidden sm:inline-block">
                Olá, {user.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sair da conta"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="font-bold text-brand hover:text-primary hover:bg-primary/10"
                asChild
              >
                <Link to="/login">Entrar</Link>
              </Button>
              <Button className="font-bold shadow-sm" asChild>
                <Link to="/login">Cadastrar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
