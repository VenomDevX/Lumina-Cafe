import type { Metadata } from "next"
import { MenuBook } from "@/components/menu-book"
import { Cta } from "@/components/cta"

export const metadata: Metadata = {
  title: "Menu",
  description: "Coffee, cold brew, matcha, smoothies and pastries at Lumina Café, the beach café on Palm Cove.",
}

export default function MenuPage() {
  return (
    <>
      <MenuBook />

      <section className="bg-paper pt-16 pb-28 md:pb-40">
        <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-8 border-t border-ink/15 px-5 pt-10 md:flex-row md:items-end md:px-10">
          <p className="max-w-xl font-display text-3xl leading-tight font-light md:text-4xl">Taste it with the sea in view.</p>
          <Cta href="/#visit">Reserve a table</Cta>
        </div>
      </section>
    </>
  )
}
