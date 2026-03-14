import { cn } from '@/lib/utils'
import logoUrl from '../assets/image-883ff.png'

interface LogoProps {
  className?: string
  imgClassName?: string
}

export function Logo({ className, imgClassName }: LogoProps) {
  return (
    <div className={cn('flex items-center justify-center shrink-0', className)}>
      <img
        src={logoUrl}
        alt="Observatório Academy"
        className={cn(
          'object-contain transition-all duration-300',
          'mix-blend-multiply dark:invert dark:hue-rotate-180 dark:brightness-110 dark:mix-blend-screen',
          imgClassName || 'h-full w-auto',
        )}
      />
    </div>
  )
}
