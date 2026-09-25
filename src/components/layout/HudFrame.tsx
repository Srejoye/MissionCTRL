import type { HTMLAttributes, ReactNode } from 'react'

interface HudFrameProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function HudFrame({ children, className = '', ...rest }: HudFrameProps) {
  return (
    <div
      className={`relative border border-dusk-blue/30 bg-ink/60 p-6 ${className}`}
      {...rest}
    >
      <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-signal-pink" />
      <span className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-signal-pink" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-signal-pink" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-signal-pink" />
      {children}
    </div>
  )
}