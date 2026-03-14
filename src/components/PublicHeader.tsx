import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur shadow-sm">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-12 w-auto filter drop-shadow-md" />
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link
            to="/cursos"
            className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wide"
          >
            Catálogo
          </Link>
          <Link
            to="/sobre"
            className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wide"
          >
            Sobre
          </Link>
          <Link
            to="/planos"
            className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wide"
          >
            Planos
          </Link>
          <Link
            to="/contato"
            className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wide"
          >
            Contato
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            asChild
            className="hidden sm:inline-flex text-white font-bold hover:text-white hover:bg-white/10"
          >
            <Link to="/login">Entrar</Link>
          </Button>
          <Button
            className="font-bold shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
            asChild
          >
            <Link to="/student/dashboard">Acessar Conta</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
