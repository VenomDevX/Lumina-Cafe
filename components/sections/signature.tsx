"use client"

import Image from "next/image"
import { useRef } from "react"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"
import { signature, formatPrice } from "@/lib/menu"
import { Cta, Kicker } from "@/components/cta"

export function Signature() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      // Desktop: vertical scroll drives a horizontal track.
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth
        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: "[data-sig-pin]",
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
      })
      mm.add(MOTION_OK, () => {
        gsap.from("[data-sig-card]", {
          y: 48,
          opacity: 0,
          stagger: 0.07,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        })
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} id="signature" className="relative bg-ink text-paper">
      <div data-sig-pin className="flex min-h-[100dvh] flex-col justify-center gap-12 overflow-hidden py-20">
        <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-5 md:grid-cols-12 md:px-10">
          <Kicker index="02" className="text-paper/70 md:col-span-3 md:pt-3">
            Signature
          </Kicker>
          <h2 className="font-display text-[clamp(2.6rem,5.5vw,5.5rem)] leading-[0.95] font-light tracking-[-0.035em] md:col-span-6">
            Six cups worth the walk.
          </h2>
          <p className="max-w-xs self-end text-sm text-paper/70 md:col-span-3 md:justify-self-end">
            Built around one idea: what tastes best with salt air.
          </p>
        </div>

        <div
          ref={track}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:w-max md:snap-none md:overflow-visible md:px-10"
        >
          {signature.map((item, i) => (
            <article key={item.name} data-sig-card className="group w-[78vw] shrink-0 snap-center sm:w-[320px]">
              <div className="relative aspect-[4/5] overflow-hidden bg-paper/5 md:aspect-square">
                <Image
                  src={item.image!}
                  alt={item.name}
                  fill
                  sizes="(min-width: 640px) 320px, 78vw"
                  className="object-cover grayscale-[15%] transition-transform duration-1000 ease-sharp group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-paper/20 pt-4">
                <h3 className="font-display text-2xl font-light tracking-tight">
                  <span className="label-mono mr-3 align-middle text-paper/60">{String(i + 1).padStart(2, "0")}</span>
                  {item.name}
                </h3>
                <span className="label-mono">{formatPrice(item.price)}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-paper/65">{item.description}</p>
              <p className="label-mono mt-3 text-paper/60">
                {item.tags?.filter((t) => t !== "signature").join(" / ")}
              </p>
            </article>
          ))}
          <div data-sig-card className="flex w-[78vw] shrink-0 snap-center flex-col justify-between border border-paper/20 p-6 sm:w-[320px]">
            <p className="label-mono text-paper/60">+16 more</p>
            <div>
              <p className="font-display text-3xl leading-tight font-light">Coffee, cold brew, matcha, smoothies, pastry.</p>
              <Cta href="/menu" tone="paper" className="mt-8">
                Full menu
              </Cta>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
