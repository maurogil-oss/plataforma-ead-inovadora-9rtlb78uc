import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={showText ? '0 0 350 80' : '0 0 80 80'}
      className={cn('w-auto h-full', className)}
      fill="none"
      role="img"
      aria-label="Observatório Academy"
    >
      <g transform="translate(10, 15)">
        {/* Hat Top */}
        <path d="M30 0 L60 15 L30 30 L0 15 Z" fill="#1e3a8a" />
        {/* Hat Bottom */}
        <path d="M10 20 L10 40 C10 50 50 50 50 40 L50 20 L30 30 Z" fill="#1e3a8a" opacity="0.85" />
        {/* Tassel */}
        <path d="M30 15 L55 35" stroke="#1e3a8a" strokeWidth="2" />
        <circle cx="55" cy="38" r="4" fill="#1e3a8a" />
      </g>
      {showText && (
        <g>
          <text
            x="85"
            y="45"
            fill="currentColor"
            fontFamily="system-ui, sans-serif"
            fontSize="34"
            fontWeight="800"
            letterSpacing="-0.02em"
          >
            Observatório
          </text>
          <text
            x="85"
            y="68"
            fill="#176a7e"
            fontFamily="system-ui, sans-serif"
            fontSize="18"
            fontWeight="700"
            letterSpacing="0.15em"
          >
            ACADEMY
          </text>
        </g>
      )}
    </svg>
  )
}
