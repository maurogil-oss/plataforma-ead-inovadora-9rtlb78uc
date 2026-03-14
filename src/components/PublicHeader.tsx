import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { LogIn } from 'lucide-react'

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center transition-opacity hover:opacity-80 shrink-0">
          <Logo imgClassName="h-9 sm:h-10 md:h-11 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link to="/cursos" className="text-sm font-medium hover:text-primary transition-colors">
            Cursos
          </Link>
          <Link to="/sobre" className="text-sm font-medium hover:text-primary transition-colors">
            Sobre
          </Link>
          <Link to="/contato" className="text-sm font-medium hover:text-primary transition-colors">
            Contato
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
          <Button
            variant="ghost"
            asChild
            className="hidden sm:inline-flex h-10 md:h-11 px-4 sm:px-6 font-medium text-sm md:text-base transition-all"
          >
            <Link to="/login">Entrar</Link>
          </Button>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white h-9 sm:h-10 md:h-11 px-4 sm:px-6 md:px-8 rounded-md font-medium text-sm md:text-base shadow-sm transition-all"
          >
            <Link to="/app" className="flex items-center gap-2">
              <LogIn className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline-block">Área do Aluno</span>
              <span className="sm:hidden">Aluno</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
