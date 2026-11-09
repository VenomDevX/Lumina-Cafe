"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { Arrow } from "@/components/cta"
import { submitForm } from "@/lib/forms"

export function Footer() {
  const [pending, setPending] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    await submitForm(e.currentTarget, "/api/newsletter", "You're on the list. See you at sunrise.")
    setPending(false)
  }

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] border-t border-paper/20 px-5 pt-16 pb-8 md:mx-10 md:px-0">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="label-mono text-paper/70">Newsletter</p>
            <p className="mt-4 max-w-md font-display text-3xl leading-tight font-light">New roasts and tasting dates. Once a month.</p>
            <form onSubmit={onSubmit} className="mt-8 flex max-w-md border-b border-paper/30 focus-within:border-paper">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="h-12 min-w-0 flex-1 bg-transparent text-paper outline-none placeholder:text-paper/50"
              />
              <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              <button type="submit" disabled={pending} className="group label-mono flex items-center gap-3 pl-4 disabled:opacity-60">
                Subscribe <Arrow />
              </button>
            </form>
          </div>

          <nav aria-label="Footer" className="label-mono grid content-start gap-3 md:col-span-2 md:col-start-8">
            <p className="mb-2 text-paper/60">Index</p>
            <Link href="/menu" className="hover:text-leaf">Menu</Link>
            <Link href="/#story" className="hover:text-leaf">Story</Link>
            <Link href="/#experience" className="hover:text-leaf">Experience</Link>
            <Link href="/#visit" className="hover:text-leaf">Reservations</Link>
          </nav>

          <div className="label-mono grid content-start gap-3 md:col-span-3">
            <p className="mb-2 text-paper/60">Contact</p>
            <p>1 Driftwood Lane, Palm Cove</p>
            <p>Daily from 06:00</p>
            <a href="mailto:hello@lumina.cafe" className="hover:text-leaf">hello@lumina.cafe</a>
          </div>
        </div>

        {/* decorative watermark: SVG so it isn't treated as low-contrast body text */}
        <svg aria-hidden viewBox="0 0 1000 170" className="mt-20 w-full fill-paper">
          <text x="-6" y="150" fontSize="212" fontWeight="700" letterSpacing="-14" className="font-sans">
            LUMINA
          </text>
        </svg>

        <div className="label-mono mt-6 flex flex-wrap justify-between gap-4 text-paper/65">
          <p>© 2026 Lumina Café</p>
          <p>Video: Mixkit · Photos: Unsplash, WP Photo Directory</p>
        </div>
      </div>
    </footer>
  )
}
