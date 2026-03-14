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
    <Link
      to={linkTo}
      className={cn(
        'flex items-center gap-2 transition-all group z-50 focus-visible:outline-none',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center transition-all duration-500 group-hover:scale-[1.02]',
        )}
      >
        <img
          src={logoUrl}
          alt="Observatório Academy"
          className={cn(
            'object-contain transition-all duration-500 filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] dark:drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)]',
            collapsed ? 'h-10 w-10 object-cover object-left' : 'h-10 md:h-11 w-auto max-w-full',
            imgClassName,
          )}
        />
      </div>
    </Link>
  )
}
