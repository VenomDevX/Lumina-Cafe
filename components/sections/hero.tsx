"use client"

import Image from "next/image"
import { useRef } from "react"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"
import { Nav } from "@/components/nav"
import { cn } from "@/lib/utils"
import { leaves, LEAVES_RATIO } from "@/lib/leaves"
import { ice } from "@/lib/sprites"

const drinks = [
  {
    word: "Coffee",
    no: "N°01",
    name: "Iced latte",
    notes: "Cold-brewed espresso, cold milk, poured over ice.",
    price: "$5.75",
    image: "/images/cup-iced-coffee-v2.webp",
    alt: "Iced latte splashing in a tall glass",
    ink: "text-coffee",
  },
  {
    word: "Matcha",
    no: "N°02",
    name: "Iced matcha latte",
    notes: "Stone-ground Uji matcha, oat milk, poured over ice.",
    price: "$6.00",
    image: "/images/cup-matcha-iced.webp",
    alt: "Iced matcha latte in a clear cup",
    ink: "text-matcha",
  },
]

const BG = ["#ede3d3", "#e1e6d0"]

type Sprite = { src: string; x: number; y: number; w: number; h: number }

/** sprites cut from one photo, placed where they sat in it; nested wrappers so burst, scatter and float never fight */
function Scatter({
  name,
  items,
  ratio,
  className,
  size = 1,
}: {
  name: string
  items: Sprite[]
  ratio: number
  className: string
  /** sprite scale vs. the frame: < 1 spreads them apart without growing them */
  size?: number
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", className)}>
      {items.map((s) => (
        <div
          key={s.src}
          data-sprite={name}
          className="absolute opacity-0"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w * size}%`, aspectRatio: (s.w * ratio) / s.h }}
        >
          <div data-scatter className="relative h-full w-full">
            <div data-float className="relative h-full w-full">
              <Image src={s.src} alt="" fill sizes="25vw" className="object-contain" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// distance from a sprite to the middle of its frame (layout offsets, so transforms don't skew it)
const toMiddle = (axis: "x" | "y", k = 1) => (_: number, el: HTMLElement) => {
  const sprite = el.closest<HTMLElement>("[data-sprite]")!
  const frame = sprite.parentElement!
  return axis === "x"
    ? k * ((frame.offsetWidth - sprite.offsetWidth) / 2 - sprite.offsetLeft)
    : k * ((frame.offsetHeight - sprite.offsetHeight) / 2 - sprite.offsetTop)
}

/**
 * Pinned hero: the iced latte sits in front of a giant word with ice cubes bursting out from behind it.
 * Scrolling blows the ice away, rolls COFFEE → MATCHA, lifts the latte out and the iced matcha in with
 * leaves popping out from behind it, and tints the page.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // load-in: ice flies out from behind the latte
        gsap.fromTo(
          q("[data-sprite='ice']"),
          { x: toMiddle("x"), y: toMiddle("y"), scale: 0.3, rotation: () => gsap.utils.random(-90, 90), opacity: 0 },
          { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, duration: 1.5, ease: "expo.out", stagger: 0.08, delay: 0.35 }
        )
        gsap.from(q("[data-word='0'] [data-char]"), { yPercent: 105, duration: 1.1, stagger: 0.05, ease: "expo.out", delay: 0.1 })
        gsap.from(q("[data-cup='0']"), { yPercent: 18, rotation: -8, opacity: 0, duration: 1.6, ease: "expo.out" })
        gsap.from(q("[data-fade]"), { opacity: 0, y: 12, duration: 0.9, stagger: 0.06, ease: "power3.out", delay: 0.5 })

        // idle: ice and leaves drift, the circular type turns
        gsap.to(q("[data-ring-text]"), { rotation: -360, duration: 120, ease: "none", repeat: -1, svgOrigin: "100 100" })
        q("[data-float]").forEach((el) =>
          gsap.to(el, {
            y: gsap.utils.random(-14, 14),
            rotation: gsap.utils.random(-10, 10),
            duration: gsap.utils.random(2.5, 4.5),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          })
        )
      })
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-sprite='ice']"), { opacity: 1 })
      })

      // scroll sequence runs even with reduced motion: it only moves when the user scrolls,
      // and without it the matcha state would never be reachable
      gsap
        .timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=160%", scrub: 0.8, pin: true, invalidateOnRefresh: true },
        })
        // ice blows outward and away before the latte lifts
        .to(
          q("[data-sprite='ice'] [data-scatter]"),
          { x: toMiddle("x", -1.2), y: toMiddle("y", -1.2), rotation: 60, scale: 1.2, opacity: 0, duration: 0.2, ease: "power2.in" },
          0.02
        )
        .to(q("[data-word='0'] [data-char]"), { yPercent: -105, stagger: 0.025, duration: 0.3 }, 0.12)
        .fromTo(q("[data-word='1'] [data-char]"), { y: 0, yPercent: 105 }, { yPercent: 0, stagger: 0.025, duration: 0.3 }, 0.38)
        // cups travel just over a viewport so the swap stays on screen at every size
        .to(q("[data-cup='0']"), { y: () => -innerHeight * 0.9, rotation: -18, scale: 0.8, duration: 0.5 }, 0.06)
        .fromTo(q("[data-cup='1']"), { yPercent: 0, y: () => innerHeight * 0.9, rotation: 18, scale: 0.8 }, { y: 0, rotation: 0, scale: 1, duration: 0.5 }, 0.14)
        // leaves burst out from behind the matcha
        .fromTo(
          q("[data-sprite='leaf']"),
          { x: toMiddle("x"), y: toMiddle("y"), scale: 0.2, rotation: () => gsap.utils.random(-120, 120), opacity: 0 },
          { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.4, ease: "back.out(1.4)", stagger: { each: 0.012, from: "random" } },
          0.42
        )
        .to(q("[data-bg]"), { backgroundColor: BG[1], duration: 0.5 }, 0.2)
        .to(q("[data-meta='0']"), { yPercent: -110, duration: 0.25 }, 0.15)
        .fromTo(q("[data-meta='1']"), { y: 0, yPercent: 110 }, { yPercent: 0, duration: 0.25 }, 0.5)
        .fromTo(q("[data-ring]"), { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", duration: 1 }, 0)
        .fromTo(q("[data-progress]"), { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0)
    },
    { scope: root }
  )

  // GSAP wraps the pinned section in a spacer div; this wrapper keeps the spacer out of the page's
  // child list, otherwise client navigation away from the page crashes (insertBefore NotFoundError)
  return (
    <div>
      <section ref={root} aria-label="Coffee and matcha" className="relative h-[100dvh] min-h-[560px] overflow-hidden text-ink">
        <div data-bg aria-hidden className="absolute inset-0" style={{ backgroundColor: BG[0] }} />

        <Nav />

        <h1 className="sr-only">Lumina Café — coffee and matcha, slow as the tide</h1>

        {/* giant words, behind the cup */}
        <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
          {drinks.map((d, i) => (
            <p
              key={d.word}
              data-word={i}
              className={cn(
                "col-start-1 row-start-1 flex overflow-hidden font-sans text-[22vw] leading-[0.8] font-bold tracking-[-0.07em] uppercase md:text-[20vw]",
                d.ink
              )}
            >
              {d.word.split("").map((c, j) => (
                <span key={j} data-char className={cn("inline-block pb-[0.04em]", i === 1 && "[transform:translateY(105%)]")}>
                  {c}
                </span>
              ))}
            </p>
          ))}
        </div>

        {/* cup stage */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="relative aspect-square w-[min(66vw,62vh)]">
            <svg viewBox="0 0 200 200" aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
              <circle cx="100" cy="100" r="99" fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth=".4" />
              <circle data-ring cx="100" cy="100" r="99" fill="none" stroke="currentColor" strokeWidth=".6" transform="rotate(-90 100 100)" />
              <g data-ring-text>
                <path id="ring-path" d="M100 100m-91 0a91 91 0 1 1 182 0a91 91 0 1 1-182 0" fill="none" />
                <text className="fill-current font-mono" fontSize="5" letterSpacing="2.4">
                  <textPath href="#ring-path">LUMINA CAFÉ — SLOW COFFEE — CEREMONIAL MATCHA — PALM COVE — EST. 2026 —</textPath>
                </text>
              </g>
            </svg>

            {/* ice and leaves sit behind the cups, in front of the giant word */}
            <Scatter name="ice" items={ice.items} ratio={ice.ratio} size={0.5} className="h-[110%] w-[135%]" />
            <Scatter name="leaf" items={leaves} ratio={LEAVES_RATIO} className="h-[220%] w-[104%] md:h-[135%] md:w-[155%]" />

            {/* 125% tall keeps the whole splash on screen, glass on the matcha cup's baseline */}
            <div data-cup={0} className="absolute inset-x-[3%] -bottom-[9.5%] h-[125%]">
              <div aria-hidden className="absolute inset-x-[38%] bottom-[2.5%] h-[3%] rounded-[50%] bg-ink/30 blur-xl" />
              <Image src={drinks[0].image} alt={drinks[0].alt} fill priority sizes="(min-width: 768px) 95vh, 100vw" className="object-contain" />
            </div>
            <div data-cup={1} className="absolute inset-x-[10%] -inset-y-[4%] [transform:translateY(260%)]">
              <div aria-hidden className="absolute inset-x-[30%] bottom-[-2%] h-[6%] rounded-[50%] bg-ink/30 blur-xl" />
              <Image src={drinks[1].image} alt={drinks[1].alt} fill sizes="(min-width: 768px) 45vh, 60vw" className="object-contain" />
            </div>
          </div>
        </div>

        {/* meta */}
        <div className="absolute inset-x-0 bottom-0 mx-auto grid max-w-[1600px] grid-cols-2 items-end gap-6 px-5 pb-6 md:grid-cols-3 md:px-10 md:pb-10">
          <div data-fade className="grid overflow-hidden">
            {drinks.map((d, i) => (
              <div key={d.no} data-meta={i} className={cn("col-start-1 row-start-1", i === 1 && "[transform:translateY(110%)]")}>
                <p className="label-mono">
                  {d.no} <span className="mx-1.5 opacity-40">/</span> {d.price}
                </p>
                <p className="mt-2 font-display text-2xl tracking-tight md:text-3xl">{d.name}</p>
                <p className="mt-1 hidden max-w-xs text-sm text-ink/70 md:block">{d.notes}</p>
              </div>
            ))}
          </div>
          <p data-fade className="label-mono hidden text-center md:block">Palm Cove — Est. 2026</p>
          <div data-fade className="justify-self-end">
            <p className="label-mono text-right">Scroll</p>
            <div className="mt-2 h-px w-24 bg-ink/20 md:w-40">
              <div data-progress className="h-full origin-left scale-x-0 bg-ink" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
