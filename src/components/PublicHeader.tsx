import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export function PublicHeader() {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 min-h-[90px] flex items-center justify-between">
        <Logo
          className="flex shrink-0 focus-visible:outline-none"
          imgClassName="h-10 md:h-11 w-auto"
        />
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 mr-6">
            <Link
              to="/cursos"
              className="text-sm font-bold text-slate-300 hover:text-white uppercase tracking-wide transition-colors"
            >
              Catálogo
            </Link>
            <Link
              to="/forum"
              className="text-sm font-bold text-slate-300 hover:text-white uppercase tracking-wide transition-colors"
            >
              Fórum
            </Link>
            <Link
              to="/planos"
              className="text-sm font-bold text-slate-300 hover:text-white uppercase tracking-wide transition-colors"
            >
              Planos
            </Link>
            <Link
              to="/sobre"
              className="text-sm font-bold text-slate-300 hover:text-white uppercase tracking-wide transition-colors"
            >
              Sobre
            </Link>
          </nav>
          {user ? (
            <Button
              className="font-bold shadow-lg h-10 md:h-11 px-4 md:px-6 bg-primary hover:bg-primary/90"
              asChild
            >
              <Link to="/student/dashboard">Área do Aluno</Link>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="text-white font-bold hover:bg-white/10 hover:text-white hidden sm:flex h-10 md:h-11"
              >
                <Link to="/">
                  <ArrowLeft className="mr-2 size-4" /> Início
                </Link>
              </Button>
              <Button
                className="font-bold shadow-lg h-10 md:h-11 px-4 md:px-6 bg-primary hover:bg-primary/90"
                asChild
              >
                <Link to="/login">Entrar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
