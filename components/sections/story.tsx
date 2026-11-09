"use client"

import Image from "next/image"
import { useRef } from "react"
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap"
import { Kicker } from "@/components/cta"
import { cn } from "@/lib/utils"
import { beans } from "@/lib/sprites"

const stats = [
  { value: "12", label: "Single origins on rotation" },
  { value: "06:00", label: "First pour, every day" },
  { value: "40", label: "Steps to the water" },
]

// single beans framing the paragraph: n = sprite number, x/y in % of the pinned screen, w in vw.
// `edge` beans sit beside the text, so phones (where the text is full width) skip them.
const sideBeans = [
  { n: 4, x: -3, y: 9, w: 11, r: -25 },
  { n: 13, x: 2, y: 74, w: 12, r: 15 },
  { n: 5, x: 11, y: 28, w: 4, r: 40, edge: true },
  { n: 12, x: 15, y: 88, w: 3.5, r: -30 },
  { n: 1, x: 88, y: 6, w: 9, r: 20 },
  { n: 11, x: 87, y: 72, w: 13, r: -12 },
  { n: 8, x: 97, y: 44, w: 4, r: 30, edge: true },
  { n: 3, x: 80, y: 90, w: 3.5, r: -20 },
].map((b) => ({ ...b, sprite: beans.items[b.n - 1], side: b.x < 50 ? -1 : 1 }))

export function Story() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // beans pop in from both sides as the section arrives, then drift while it's pinned
        gsap.utils.toArray<HTMLElement>("[data-side-bean]").forEach((el) => {
          const side = Number(el.dataset.sideBean)
          gsap.from(el, {
            x: side * innerWidth * 0.35,
            rotation: side * gsap.utils.random(120, 220),
            scale: 0.4,
            opacity: 0,
            ease: "back.out(1.3)",
            scrollTrigger: { trigger: "[data-story-pin]", start: "top 85%", end: "top 10%", scrub: 0.8 },
          })
          gsap.to(el.querySelector("[data-bean-float]"), {
            y: gsap.utils.random(-12, 12),
            rotation: gsap.utils.random(-8, 8),
            duration: gsap.utils.random(2.5, 4),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          })
        })

        // aria "none": the split words stay plain readable text, no aria-label on the <p>
        const split = SplitText.create("[data-story-text]", { type: "words", aria: "none" })
        // start color still clears 3:1 on paper for large text, so it's readable before the scroll
        gsap.fromTo(
          split.words,
          { color: "#8c8176" },
          {
            color: "#17120e",
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: "[data-story-pin]", start: "top top", end: "+=140%", scrub: 0.6, pin: true },
          }
        )
        gsap.from("[data-stat]", {
          y: 24,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-stats]", start: "top 88%" },
        })
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} id="story" className="relative bg-paper">
      <div data-story-pin className="relative flex min-h-[100dvh] items-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {sideBeans.map((b) => (
            <div
              key={b.n}
              data-side-bean={b.side}
              className={cn("absolute", b.edge && "hidden md:block")}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `max(${b.w}vw, ${b.w * 5}px)`,
                aspectRatio: (b.sprite.w * beans.ratio) / b.sprite.h,
              }}
            >
              {/* resting tilt lives on its own wrapper: gsap resets the css `rotate` of anything it animates */}
              <div className="relative h-full w-full" style={{ rotate: `${b.r}deg` }}>
                <div data-bean-float className="relative h-full w-full">
                  <Image src={b.sprite.src} alt="" fill sizes="13vw" className="object-contain" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="relative mx-auto grid w-full max-w-[1600px] gap-10 px-5 py-24 md:grid-cols-12 md:px-10">
          <Kicker index="01" className="md:col-span-3 md:pt-4">
            Story
          </Kicker>
          <p
            data-story-text
            className="font-display text-[clamp(1.9rem,4vw,4rem)] leading-[1.08] font-light tracking-[-0.025em] md:col-span-9"
          >
            Mornings begin where the sand turns cool. We roast in small batches, pour slowly and serve every cup within
            earshot of the waves — because good coffee, like the tide, never rushes.
          </p>
        </div>
      </div>

      <div data-stats className="mx-auto grid max-w-[1600px] border-t border-ink/15 sm:grid-cols-3 md:mx-10">
        {stats.map((s, i) => (
          <div key={s.label} data-stat className={`px-5 py-10 md:px-0 ${i ? "border-t border-ink/15 sm:border-t-0 sm:border-l sm:pl-8" : ""}`}>
            <p className="font-sans text-6xl font-semibold tracking-[-0.05em] tabular-nums md:text-7xl">{s.value}</p>
            <p className="label-mono mt-3 text-ink/70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
