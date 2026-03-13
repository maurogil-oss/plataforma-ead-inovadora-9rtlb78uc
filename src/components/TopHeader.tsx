import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { LogOut, Menu } from 'lucide-react'
import logoUrl from '@/assets/logo-academy-2-82c76.png'

export function TopHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-600"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-3">
            <img src={logoUrl} alt="Observatório Academy (DEMO)" className="h-9 w-auto" />
            <span className="hidden sm:inline-block font-bold text-slate-900 tracking-tight">
              Observatório Academy (DEMO)
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline-block">
                Olá, {user.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                title="Sair da conta"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="font-semibold text-slate-700" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button className="bg-[#176a7e] hover:bg-[#115060] font-semibold" asChild>
                <Link to="/register">Cadastrar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
