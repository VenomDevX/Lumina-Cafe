"use client"

import Link from "next/link"
import { useState } from "react"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Arrow } from "@/components/cta"

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/#story", label: "Story" },
  { href: "/#experience", label: "Experience" },
  { href: "/#visit", label: "Visit" },
]

/** Sits on top of the first section, transparent, and scrolls away with the page. */
export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <nav aria-label="Main" className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto] items-center px-5 md:grid-cols-3 md:h-20 md:px-10">
        <Link href="/" className="font-sans text-[15px] font-semibold tracking-[0.32em] uppercase">
          Lumina
        </Link>

        <ul className="hidden justify-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="label-mono relative py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-sharp hover:after:origin-left hover:after:scale-x-100"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/#visit" className="group label-mono hidden items-center justify-end gap-3 md:flex">
          Book a table <Arrow />
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="label-mono h-11 justify-self-end md:hidden">Menu</SheetTrigger>
          <SheetContent side="top" showCloseButton={false} className="justify-between border-0 bg-paper px-5 pt-0 pb-10 shadow-none data-[side=top]:h-dvh">
            <div className="flex h-16 items-center justify-between border-b border-ink/15">
              <SheetTitle className="font-sans text-[15px] font-semibold tracking-[0.32em] uppercase">Lumina</SheetTitle>
              <SheetClose className="label-mono h-11">Close</SheetClose>
            </div>
            <ul>
              {links.map((l, i) => (
                <li
                  key={l.href}
                  className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both border-b border-ink/15 duration-500"
                  style={{ animationDelay: `${80 + i * 50}ms` }}
                >
                  <Link href={l.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-4 font-display text-5xl tracking-tight">
                    {l.label}
                    <span className="label-mono text-ink/60">0{i + 1}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="label-mono text-ink/70">1 Driftwood Lane, Palm Cove · Daily from 06:00</p>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
