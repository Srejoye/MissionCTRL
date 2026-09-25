import type { ReactNode } from 'react'

import { RadioTicker } from './RadioTicker'

interface PageShellProps {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-void text-bone">
      <RadioTicker />
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </div>
    </div>
  )
}
