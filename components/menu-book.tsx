"use client"

import Image from "next/image"
import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { Nav } from "@/components/nav"
import { cn } from "@/lib/utils"
import { categories, menu, formatPrice, type Category } from "@/lib/menu"

const blurbs: Record<Category, string> = {
  coffee: "Beans roasted on Tuesdays, pulled all day. Oat, coconut and almond milk at no extra cost.",
  "cold-brew": "Steeped for eighteen hours, poured over ice.",
  tea: "Stone-ground matcha and slow-simmered chai.",
  smoothies: "Blended to order with fruit from the morning market.",
  pastries: "Baked at dawn. Usually gone by noon.",
}
const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"]

const chapters = categories.map((c, i) => {
  const items = menu.filter((m) => m.category === c.id)
  return { ...c, no: ROMAN[i].toUpperCase(), items, cover: items.find((m) => m.image)?.image, blurb: blurbs[c.id] }
})
type Chapter = (typeof chapters)[number]

// paper fibre, multiplied over the page colour
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .42 0 0 0 0 .3 0 0 0 0 .16 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const sepia = "sepia-[.35] saturate-[.75] contrast-[.95]"
const smallCaps = "font-display text-[10px] uppercase tracking-[0.32em] md:text-[11px]"

/** aged paper: warm centre, browned edges, darker towards the spine */
function Paper({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  return (
    <div className="relative h-full bg-[radial-gradient(ellipse_at_center,#f5ecd8_35%,#e6d3ae_100%)] text-[#3b2a1c]">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: NOISE }} />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          side === "right"
            ? "bg-[linear-gradient(to_right,rgba(59,42,28,.22),transparent_9%)]"
            : "bg-[linear-gradient(to_left,rgba(59,42,28,.22),transparent_9%)]"
        )}
      />
      <div aria-hidden className="pointer-events-none absolute inset-3 border-[3px] border-double border-[#3b2a1c]/30 md:inset-5" />
      <div className="relative flex h-full flex-col px-7 py-8 md:px-12 md:py-12">{children}</div>
    </div>
  )
}

function Flourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 12" aria-hidden className={cn("h-3 w-28 text-[#3b2a1c]/50", className)}>
      <path d="M0 6h48M72 6h48" stroke="currentColor" strokeWidth=".75" />
      <path d="M60 1l5 5-5 5-5-5z" fill="none" stroke="currentColor" strokeWidth=".75" />
      <circle cx="51" cy="6" r="1" fill="currentColor" />
      <circle cx="69" cy="6" r="1" fill="currentColor" />
    </svg>
  )
}

function Face({ side, children }: { side: "front" | "back"; children: React.ReactNode }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden backface-hidden", side === "back" && "[transform:rotateY(180deg)]")}>
      {children}
      <div data-shade={side} aria-hidden className="pointer-events-none absolute inset-0 bg-[#2a1c12] opacity-0" />
    </div>
  )
}

function Cover() {
  const gold = "text-[#d2b071] [text-shadow:0_1px_0_rgba(0,0,0,.45),0_-1px_0_rgba(255,236,190,.15)]"
  return (
    <div className="relative flex h-full flex-col items-center justify-between bg-[radial-gradient(ellipse_at_30%_20%,#6e4127,#3a2114_75%)] px-8 py-12 text-center md:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply" style={{ backgroundImage: NOISE }} />
      <div aria-hidden className="absolute inset-y-0 left-0 w-6 bg-[linear-gradient(to_right,rgba(0,0,0,.45),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute inset-4 border border-[#d2b071]/60 md:inset-6" />
      <div aria-hidden className="pointer-events-none absolute inset-6 border border-[#d2b071]/30 md:inset-8" />

      <p className={cn("relative font-display text-xs uppercase tracking-[0.5em]", gold)}>Lumina Café</p>
      <div className="relative">
        <div className={cn("mx-auto grid size-16 place-items-center rounded-full border border-current font-display text-3xl italic", gold)}>L</div>
        <h1 className={cn("mt-8 font-display text-6xl font-light italic md:text-7xl", gold)}>Bill of Fare</h1>
        <Flourish className="mx-auto mt-6 text-[#d2b071]/70" />
      </div>
      <p className={cn("relative font-display text-[11px] uppercase tracking-[0.4em]", gold)}>Palm Cove · MMXXVI</p>
    </div>
  )
}

function Intro({ c }: { c: Chapter }) {
  return (
    <Paper side="left">
      <p className={cn(smallCaps, "text-center opacity-70")}>Chapter {c.no}</p>
      <h2 className="mt-3 text-center font-display text-4xl leading-none font-light italic md:text-6xl">{c.label}</h2>
      <Flourish className="mx-auto mt-5" />
      {c.cover && (
        <div className="relative mx-auto mt-6 min-h-0 w-full max-w-[78%] flex-1 rounded-t-full border border-[#3b2a1c]/30 p-1.5 md:mt-8">
          <div className="relative h-full overflow-hidden rounded-t-full">
            <Image src={c.cover} alt="" fill sizes="(min-width: 768px) 30vw, 70vw" className={cn("object-cover", sepia)} />
          </div>
        </div>
      )}
      <p className="mx-auto mt-6 max-w-xs text-center font-display text-sm leading-relaxed italic opacity-80">{c.blurb}</p>
    </Paper>
  )
}

function Items({ c, page }: { c: Chapter; page: number }) {
  return (
    <Paper side="right">
      <p className={cn(smallCaps, "flex justify-between opacity-70")}>
        <span>{c.label}</span>
        <span>{c.no}</span>
      </p>
      <ul className="flex flex-1 flex-col justify-center gap-3 md:gap-4">
        {c.items.map((item) => (
          <li key={item.name} className="flex items-center gap-3 md:gap-4">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-full border border-[#3b2a1c]/30 md:size-14">
              {item.image ? (
                <Image src={item.image} alt="" fill sizes="56px" className={cn("object-cover", sepia)} />
              ) : (
                <span className="grid h-full place-items-center font-display text-lg italic opacity-50">{item.name[0]}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <h3 className="font-display text-lg leading-tight italic md:text-xl">{item.name}</h3>
                <span aria-hidden className="flex-1 border-b border-dotted border-[#3b2a1c]/40" />
                <span className="font-display text-sm tabular-nums md:text-base">{formatPrice(item.price)}</span>
              </div>
              <p className="mt-0.5 text-[12px] leading-snug opacity-75 md:text-[13px]">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className={cn(smallCaps, "text-center opacity-50")}>— {ROMAN[page - 1]} —</p>
    </Paper>
  )
}

/**
 * Pinned menu book: scrolling opens the cover, then turns one leaf per category.
 * Leaf i: front = right-hand page, back = next spread's left-hand page.
 */
export function MenuBook() {
  const root = useRef<HTMLElement>(null)
  const tl = useRef<gsap.core.Timeline>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const leaves = q("[data-leaf]")
      const labels = q("[data-label]")
      const t = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: "[data-book-pin]", start: "top top", end: "+=450%", scrub: 0.8, pin: true, invalidateOnRefresh: true },
      })
      // closed, the cover sits centred; open, the spread is centred (phones stay on the right-hand page)
      t.fromTo(
        q("[data-book]"),
        { xPercent: -25, scale: 0.9 },
        { xPercent: () => (matchMedia("(min-width: 768px)").matches ? 0 : -25), scale: 1, duration: 0.85, ease: "power2.inOut" },
        0
      )
        .to(q("[data-hint]"), { opacity: 0, duration: 0.2 }, 0)
        .fromTo(q("[data-left-shadow]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.4)
      leaves.forEach((leaf, i) => {
        t.to(leaf, { rotationY: -180, duration: 0.85, ease: "power1.inOut" }, i)
          .set(leaf, { zIndex: 20 + i }, i + 0.42) // past 90°: now on top of the left-hand stack
          .fromTo(leaf.querySelector("[data-shade='front']"), { opacity: 0 }, { opacity: 0.3, duration: 0.42 }, i)
          .fromTo(leaf.querySelector("[data-shade='back']"), { opacity: 0.3 }, { opacity: 0, duration: 0.43 }, i + 0.42)
          .to(labels, { opacity: 0.4, duration: 0.1 }, i + 0.75)
          .to(labels[i], { opacity: 1, duration: 0.1 }, i + 0.75)
      })
      t.to({}, { duration: 0.4 }) // rest on the last spread before unpinning
      tl.current = t
    },
    { scope: root }
  )

  const jump = (i: number) => {
    const st = tl.current?.scrollTrigger
    if (!st || !tl.current) return
    window.scrollTo({ top: st.start + ((st.end - st.start) * (i + 0.9)) / tl.current.duration() })
  }

  return (
    <section ref={root} aria-label="Menu" className="relative bg-paper">
      <div
        data-book-pin
        className="relative flex h-[100dvh] min-h-[560px] flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(59,42,28,.12))] pt-12"
      >
        <Nav />
        <div
          data-book
          className="relative h-(--h) w-[calc(var(--w)*2)] perspective-[2600px] [--h:min(72dvh,calc(var(--w)*1.6))] [--w:86vw] md:[--h:min(76dvh,760px)] md:[--w:min(40vw,calc(var(--h)*0.74))]"
        >
          <div data-left-shadow aria-hidden className="absolute inset-y-0 left-0 w-1/2 shadow-[0_40px_70px_-30px_rgba(42,28,18,.6)]" />
          <div aria-hidden className="absolute inset-y-0 right-0 w-1/2 shadow-[0_40px_70px_-30px_rgba(42,28,18,.6)]" />

          {/* last right-hand page, under every leaf */}
          <div className="absolute inset-y-0 right-0 w-1/2">
            <Items c={chapters[4]} page={10} />
          </div>

          {chapters.map((c, i) => (
            <div key={c.id} data-leaf className="absolute inset-y-0 right-0 w-1/2 origin-left transform-3d" style={{ zIndex: 10 - i }}>
              <Face side="front">{i === 0 ? <Cover /> : <Items c={chapters[i - 1]} page={i * 2} />}</Face>
              <Face side="back">
                <Intro c={c} />
              </Face>
            </div>
          ))}
        </div>

        <p data-hint className="mt-6 font-display text-sm italic opacity-70">
          Scroll to open
        </p>
        <ol className="absolute inset-x-0 bottom-4 flex justify-center gap-5 md:bottom-7 md:gap-9">
          {chapters.map((c, i) => (
            <li key={c.id}>
              <button type="button" data-label onClick={() => jump(i)} className={cn(smallCaps, "h-11 opacity-40 hover:opacity-100")}>
                {c.no}
                <span className="hidden md:inline"> · {c.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
