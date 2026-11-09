import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils"

const tones = {
  ink: "bg-ink text-paper hover:bg-coffee",
  line: "border border-current hover:bg-ink hover:text-paper hover:border-ink",
  paper: "bg-paper text-ink hover:bg-sand",
}

/** Square, mono-labelled CTA. The arrow slides on hover. */
export function Cta({
  tone = "ink",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { tone?: keyof typeof tones }) {
  return (
    <Link
      {...props}
      className={cn(
        "group label-mono inline-flex h-12 items-center gap-6 px-5 transition-colors duration-300 ease-sharp",
        tones[tone],
        className
      )}
    >
      {children}
      <Arrow />
    </Link>
  )
}

export function Arrow({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative block h-3 w-5 overflow-hidden", className)}>
      {[0, 1].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 12"
          className={cn(
            "absolute inset-0 h-3 w-5 transition-transform duration-500 ease-sharp",
            i === 0 ? "group-hover:translate-x-full" : "-translate-x-full group-hover:translate-x-0"
          )}
        >
          <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      ))}
    </span>
  )
}

/** Section kicker: "(01) — Story" */
export function Kicker({ index, children, className }: { index: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn("label-mono flex items-center gap-3", className)}>
      <span>({index})</span>
      <span aria-hidden className="h-px w-8 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  )
}
