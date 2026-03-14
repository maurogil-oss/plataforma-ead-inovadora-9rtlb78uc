import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import logoUrl from '@/assets/logomarca-observatorio-academy-nova-86843.png'

interface LogoProps {
  className?: string
  collapsed?: boolean
  linkTo?: string
}

export function Logo({ className, collapsed, linkTo = '/' }: LogoProps) {
  return (
    <Link to={linkTo} className={cn('flex items-center gap-2 transition-all', className)}>
      <img
        src={logoUrl}
        alt="Observatório Academy"
        className={cn(
          'object-contain transition-all duration-300',
          collapsed ? 'h-8 w-8 object-cover object-left' : 'h-12 w-auto',
        )}
      />
    </Link>
  )
}
