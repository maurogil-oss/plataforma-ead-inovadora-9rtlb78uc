import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95 dark:border-slate-800">
      <div className="container mx-auto flex h-24 md:h-28 items-center justify-between px-4 md:px-6">
        <div className="flex items-center h-full py-4">
          <Logo imgClassName="h-16 sm:h-20 md:h-24 max-h-full w-auto" />
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/courses"
            className="text-base font-semibold text-slate-700 hover:text-brand dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
          >
            Cursos
          </Link>
          <Link
            to="/about"
            className="text-base font-semibold text-slate-700 hover:text-brand dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
          >
            Sobre Nós
          </Link>
          <div className="flex items-center gap-4 ml-6 border-l border-slate-200 dark:border-slate-800 pl-6">
            <Link to="/login">
              <Button variant="ghost" size="lg" className="text-base font-bold">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white text-base font-bold px-8 shadow-md"
              >
                Criar Conta
              </Button>
            </Link>
          </div>
        </nav>
        <div className="md:hidden flex items-center gap-3">
          <Link to="/login">
            <Button size="sm" className="bg-brand hover:bg-brand/90 text-white font-bold">
              Login
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="text-slate-700 border-slate-200">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
