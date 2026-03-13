import { Bell, Search, Menu } from 'lucide-react'
import { MOCK_USER } from '@/data/mock'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSidebar } from '@/components/ui/sidebar'
import { Link } from 'react-router-dom'

export function TopHeader() {
  const { toggleSidebar, isMobile } = useSidebar()

  // Calculate percentage for the level ring
  const progressPercent = (MOCK_USER.xp / MOCK_USER.xpNext) * 100

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-white/5 bg-background/80 px-4 backdrop-blur-md">
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
          <Menu className="size-5" />
        </Button>
      )}

      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar cursos, aulas ou tópicos..."
            className="w-full bg-black/20 border-white/10 pl-9 focus-visible:ring-primary rounded-full h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 bg-accent rounded-full border-2 border-background animate-pulse" />
        </Button>

        <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none text-foreground">{MOCK_USER.name}</p>
            <p className="text-xs text-muted-foreground">Nível {MOCK_USER.level}</p>
          </div>

          <div className="relative">
            {/* Level Progress Ring */}
            <svg className="absolute -inset-1 size-12 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-muted"
                strokeWidth="2"
                strokeDasharray="100 100"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-primary transition-all duration-1000 ease-out"
                strokeWidth="2"
                strokeDasharray={`${progressPercent} 100`}
                strokeLinecap="round"
              />
            </svg>
            <Avatar className="size-10 border-2 border-background relative z-10">
              <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} />
              <AvatarFallback className="bg-primary/20 text-primary">CS</AvatarFallback>
            </Avatar>
          </div>
        </Link>
      </div>
    </header>
  )
}
