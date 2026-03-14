import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function TopHeader() {
  return (
    <header className="sticky top-0 z-30 flex min-h-[100px] md:min-h-[120px] w-full items-center justify-between border-b bg-white/95 backdrop-blur px-4 md:px-8 py-4 shadow-sm dark:bg-slate-950/95 dark:border-slate-800 transition-all duration-300">
      <div className="flex items-center gap-4 h-full w-full max-w-[70%]">
        <div className="md:hidden flex items-center gap-4 h-full w-full">
          <SidebarTrigger className="h-10 w-10 shrink-0 border border-slate-200" />
          <Logo
            collapsed={false}
            imgClassName="h-20 sm:h-28 w-auto max-h-[90px] object-contain drop-shadow-sm transition-transform hover:scale-105"
          />
        </div>
        <div className="hidden md:flex relative w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="search"
            placeholder="Buscar títulos, categorias..."
            className="w-full bg-slate-100/80 pl-10 h-11 border-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-slate-900 rounded-full text-base font-medium shadow-inner"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full h-11 w-11 transition-colors"
        >
          <Bell className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          <span className="absolute right-2.5 top-2.5 flex h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950 animate-pulse"></span>
        </Button>
        <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
        <Button
          variant="ghost"
          className="rounded-full gap-3 pl-2 pr-5 hover:bg-slate-100 dark:hover:bg-slate-800 hidden sm:flex h-12 transition-colors"
        >
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm border border-primary/20">
            A
          </div>
          <span className="text-base font-bold text-slate-700 dark:text-slate-200">Aluno</span>
        </Button>
      </div>
    </header>
  )
}
