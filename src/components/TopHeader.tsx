import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function TopHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-20 md:h-28 w-full items-center justify-between border-b bg-white px-4 md:px-8 py-3 shadow-sm dark:bg-slate-950 dark:border-slate-800">
      <div className="flex items-center gap-4 h-full">
        <div className="md:hidden flex items-center gap-3 h-full">
          <SidebarTrigger className="h-10 w-10 shrink-0 border border-slate-200" />
          <Logo collapsed={false} imgClassName="h-12 sm:h-14 w-auto max-h-full object-contain" />
        </div>
        <div className="hidden md:flex relative w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="search"
            placeholder="Buscar alunos, cursos ou relatórios..."
            className="w-full bg-slate-100/80 pl-10 h-11 border-none focus-visible:ring-2 focus-visible:ring-brand dark:bg-slate-900 rounded-full text-base"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-5">
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full h-10 w-10"
        >
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          <span className="absolute right-2 top-2 flex h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white dark:ring-slate-950"></span>
        </Button>
        <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
        <Button
          variant="ghost"
          className="rounded-full gap-3 pl-2 pr-5 hover:bg-slate-100 dark:hover:bg-slate-800 hidden sm:flex h-11"
        >
          <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white font-bold dark:bg-blue-900 dark:text-blue-300 shadow-sm">
            A
          </div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Admin</span>
        </Button>
      </div>
    </header>
  )
}
