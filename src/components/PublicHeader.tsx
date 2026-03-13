import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import logoUrl from '@/assets/logo-academy-2-82c76.png'

export function PublicHeader() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logoUrl}
            alt="Observatório Academy"
            className="h-10 w-auto object-contain mix-blend-screen invert hue-rotate-180 opacity-95 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <nav className="hidden md:flex gap-8">
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
          <Link
            to="/sobre"
            className="text-sm font-semibold text-foreground/80 hover:text-[#176a7e] transition-colors"
          >
            Sobre
          </Link>
        </nav>
        <div className="flex gap-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex text-foreground">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Início
            </Link>
          </Button>
          <Button className="bg-[#176a7e] hover:bg-[#115060] text-white" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
