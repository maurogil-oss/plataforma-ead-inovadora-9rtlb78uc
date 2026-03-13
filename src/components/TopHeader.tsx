import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { LogOut, Menu } from 'lucide-react'
import logoUrl from '@/assets/logo-academy-2-82c76.png'

export function TopHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground/80"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoUrl}
              alt="Observatório Academy"
              className="h-9 w-auto object-contain mix-blend-screen invert opacity-95 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="hidden sm:inline-block font-bold text-foreground tracking-tight group-hover:text-[#176a7e] transition-colors">
              Observatório Academy
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 ml-6 border-l border-border pl-6">
            <Link
              to="/cursos"
              className="text-sm font-semibold text-foreground/80 hover:text-[#176a7e] transition-colors"
            >
              Cursos
            </Link>
            <Link
              to="/planos"
              className="text-sm font-semibold text-foreground/80 hover:text-[#176a7e] transition-colors"
            >
              Planos
            </Link>
            <Link
              to="/contato"
              className="text-sm font-semibold text-foreground/80 hover:text-[#176a7e] transition-colors"
            >
              Contato
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground hidden sm:inline-block">
                Olá, {user.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                title="Sair da conta"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="font-semibold text-foreground" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button className="bg-[#176a7e] hover:bg-[#115060] text-white font-semibold" asChild>
                <Link to="/login">Cadastrar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
