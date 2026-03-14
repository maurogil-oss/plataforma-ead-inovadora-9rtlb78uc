import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/Logo'

export function PublicHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <Logo className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
        </Link>
        <nav className="hidden md:flex gap-8">
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
          <Link
            to="/sobre"
            className="text-sm font-bold text-brand hover:text-primary transition-colors uppercase tracking-wide"
          >
            Sobre
          </Link>
        </nav>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            asChild
            className="hidden sm:inline-flex text-brand font-bold hover:text-primary hover:bg-primary/10"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Início
            </Link>
          </Button>
          <Button className="font-bold shadow-sm" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
