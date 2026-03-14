import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'

export function TopHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 py-3 shadow-sm dark:bg-slate-950 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Logo collapsed />
        </div>
        <div className="hidden md:flex relative w-64 lg:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Buscar alunos, cursos ou relatórios..."
            className="w-full bg-slate-100 pl-9 border-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:bg-slate-900"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
        >
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-slate-950"></span>
        </Button>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
        <Button
          variant="ghost"
          className="rounded-full gap-2 pl-2 pr-4 hover:bg-slate-100 dark:hover:bg-slate-800 hidden sm:flex"
        >
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold dark:bg-blue-900 dark:text-blue-300">
            A
          </div>
          <span className="text-sm font-medium">Admin</span>
        </Button>
      </div>
    </header>
  )
}
