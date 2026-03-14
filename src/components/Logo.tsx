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
      className={cn('flex items-center gap-2 transition-all group z-50', className)}
    >
      {/* High-contrast container to ensure brand visibility on dark backgrounds */}
      <div
        className={cn(
          'bg-white rounded-2xl shadow-xl ring-1 ring-black/5 flex items-center justify-center transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.02]',
          collapsed ? 'p-1.5 sm:p-2' : 'p-3 sm:p-4 md:p-5',
        )}
      >
        <img
          src={logoUrl}
          alt="Observatório Academy"
          className={cn(
            'object-contain transition-all duration-500',
            collapsed
              ? 'h-10 w-10 sm:h-12 sm:w-12 object-cover object-left'
              : 'h-16 sm:h-20 md:h-24 w-auto max-w-full drop-shadow-sm',
            imgClassName,
          )}
        />
      </div>
    </Link>
  )
}
