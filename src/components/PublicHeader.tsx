import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95 dark:border-slate-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/courses"
            className="text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
          >
            Cursos
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
          >
            Sobre Nós
          </Link>
          <div className="flex items-center gap-4 ml-4">
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Criar Conta</Button>
            </Link>
          </div>
        </nav>
        <div className="md:hidden flex items-center">
          <Link to="/login">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
