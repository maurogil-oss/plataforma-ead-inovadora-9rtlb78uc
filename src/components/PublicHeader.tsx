import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95 dark:border-slate-800">
      <div className="container mx-auto flex min-h-[160px] md:min-h-[220px] items-center justify-between px-4 md:px-6 py-6">
        <div className="flex items-center h-full max-w-[50%] md:max-w-[40%]">
          <Logo imgClassName="h-32 sm:h-48 md:h-60 max-h-[180px] md:max-h-[200px] w-auto object-contain" />
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/courses"
            className="text-lg font-semibold text-slate-700 hover:text-brand dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
          >
            Cursos
          </Link>
          <Link
            to="/about"
            className="text-lg font-semibold text-slate-700 hover:text-brand dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
          >
            Sobre Nós
          </Link>
          <div className="flex items-center gap-4 ml-6 border-l border-slate-200 dark:border-slate-800 pl-6">
            <Link to="/login">
              <Button variant="ghost" size="lg" className="text-lg font-bold h-12 px-6">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold px-8 h-12 shadow-md"
              >
                Criar Conta
              </Button>
            </Link>
          </div>
        </nav>
        <div className="md:hidden flex items-center gap-4 shrink-0">
          <Link to="/login">
            <Button
              size="default"
              className="bg-brand hover:bg-brand/90 text-white font-bold h-11 px-5"
            >
              Login
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 text-slate-700 border-slate-200"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}
