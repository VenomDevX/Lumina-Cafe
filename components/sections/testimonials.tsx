"use client"

import { useRef } from "react"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"
import { Kicker } from "@/components/cta"

const quotes = [
  { quote: "The Tide Latte ruined every other latte for me.", name: "Maya R.", note: "Regular since day one" },
  { quote: "I came for the coffee and stayed for three sunsets.", name: "Jonas K.", note: "Visiting from Berlin" },
  { quote: "A beach house where someone cares about extraction.", name: "Priya S.", note: "Home barista" },
  { quote: "The Friday cold brew flight is the best hour of my week.", name: "Leo M.", note: "Sunset tastings" },
  { quote: "Quiet, warm, unhurried. Croissants gone by ten.", name: "Ana P.", note: "Early riser" },
  { quote: "Terrace, cortado, sea breeze. That's the review.", name: "Sam T.", note: "Local surfer" },
]

export function Testimonials() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const row = root.current!.querySelector<HTMLElement>("[data-marquee]")!
        const loop = gsap.fromTo(row, { xPercent: 0 }, { xPercent: -50, duration: 60, ease: "none", repeat: -1 })
        row.addEventListener("pointerenter", () => gsap.to(loop, { timeScale: 0, duration: 0.5 }))
        row.addEventListener("pointerleave", () => gsap.to(loop, { timeScale: 1, duration: 0.5 }))
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} aria-labelledby="loved-title" className="overflow-hidden border-t border-ink/15 bg-paper py-28 md:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-8 px-5 md:grid-cols-12 md:px-10">
        <Kicker index="04" className="md:col-span-3 md:pt-3">
          Notes
        </Kicker>
        <h2 id="loved-title" className="font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] font-light tracking-[-0.035em] md:col-span-9">
          Words left on napkins.
        </h2>
      </div>

      <div className="mt-16 border-y border-ink/15">
        {/* repeated: the -50% loop needs two identical halves, each wider than the viewport */}
        <div data-marquee className="flex w-max">
          {[...quotes, ...quotes].map((q, i) => (
            <figure key={i} aria-hidden={i >= quotes.length} className="flex w-[300px] shrink-0 flex-col justify-between gap-10 border-r border-ink/15 p-8 md:w-[400px]">
              <blockquote className="font-display text-xl leading-snug font-light md:text-2xl">“{q.quote}”</blockquote>
              <figcaption className="label-mono flex justify-between gap-4">
                <span>{q.name}</span>
                <span className="text-ink/70">{q.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
