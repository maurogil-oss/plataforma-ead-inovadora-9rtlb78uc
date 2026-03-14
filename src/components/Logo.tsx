import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import logoUrl from '@/assets/logomarca-observatorio-academy-nova-86843.png'

interface LogoProps {
  className?: string
  imgClassName?: string
  collapsed?: boolean
  linkTo?: string
  showText?: boolean
}

export function Logo({ className, imgClassName, collapsed, linkTo = '/' }: LogoProps) {
  return (
    <Link to={linkTo} className={cn('flex items-center gap-2 transition-all', className)}>
      <img
        src={logoUrl}
        alt="Observatório Academy"
        className={cn(
          'object-contain transition-all duration-500',
          collapsed
            ? 'h-24 w-24 object-cover object-left'
            : 'h-64 md:h-80 w-auto max-w-full drop-shadow-md',
          imgClassName,
        )}
      />
    </Link>
  )
}
