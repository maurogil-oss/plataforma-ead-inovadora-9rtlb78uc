import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { Menu, LogIn } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

export function TopHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center transition-opacity hover:opacity-80 shrink-0">
          <Logo className="h-9 sm:h-10 md:h-11" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Button
            variant="ghost"
            asChild
            className="h-10 md:h-11 px-6 font-medium text-sm md:text-base transition-all"
          >
            <Link to="/login">Entrar</Link>
          </Button>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white h-10 md:h-11 px-6 md:px-8 rounded-md font-medium text-sm md:text-base shadow-sm transition-all"
          >
            <Link to="/app" className="flex items-center gap-2">
              <LogIn className="w-4 h-4 md:w-5 md:h-5" />
              <span>Área do Aluno</span>
            </Link>
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2 sm:gap-3 shrink-0">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white h-9 sm:h-10 px-4 sm:px-6 rounded-md font-medium text-sm shadow-sm transition-all"
          >
            <Link to="/app" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline-block">Área do Aluno</span>
              <span className="sm:hidden">Aluno</span>
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                <Button variant="ghost" asChild className="w-full justify-start h-11 text-base">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full justify-start h-11 text-base"
                >
                  <Link to="/app">Área do Aluno</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
