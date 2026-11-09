"use client"

import { useRef } from "react"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"

const captions = [
  { step: "01 — Origin", text: "Beans from volcanic hillsides, roasted every Tuesday at dawn." },
  { step: "02 — Patience", text: "A ninety-second bloom. A slow, steady pour. Nothing hurried." },
  { step: "03 — The cup", text: "Served with an ocean view and nowhere else to be." },
]

/**
 * Pinned full-bleed video whose playhead follows the scrollbar.
 * The MP4 is encoded with every frame as a keyframe (-g 1), so seeking is instant.
 */
export function ScrollVideo() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const v = video.current!
        // iOS only allows seeking after the video has been "played" once.
        const prime = () => v.play().then(() => v.pause()).catch(() => {})
        window.addEventListener("touchstart", prime, { once: true })

        const playhead = { t: 0 }
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: "[data-video-pin]", start: "top top", end: "+=320%", scrub: 0.5, pin: true },
        })

        tl.fromTo(
          "[data-video-frame]",
          { clipPath: "inset(12% 8% 12% 8%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.18 },
          0
        )
          .from("[data-video-media]", { scale: 1.25, duration: 0.18 }, 0)
          .to(
            playhead,
            {
              t: 1,
              duration: 1,
              onUpdate: () => {
                const target = playhead.t * ((v.duration || 15.3) - 0.05)
                if (Math.abs(v.currentTime - target) > 0.03) v.currentTime = target
              },
            },
            0
          )
          .fromTo("[data-video-progress]", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)

        const caps = gsap.utils.toArray<HTMLElement>("[data-caption]")
        caps.forEach((cap, i) => {
          const at = 0.12 + i * 0.3
          if (i > 0) tl.fromTo(cap, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" }, at)
          if (i < caps.length - 1) tl.to(cap, { opacity: 0, y: -50, duration: 0.1, ease: "power2.in" }, at + 0.22)
        })

        return () => window.removeEventListener("touchstart", prime)
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} aria-label="How we brew" className="relative bg-paper">
      <div data-video-pin className="relative h-[100dvh] overflow-hidden">
        <div data-video-frame className="absolute inset-0 overflow-hidden bg-ink">
          <video
            ref={video}
            data-video-media
            src="/video/pour.mp4"
            poster="/video/poster.webp"
            muted
            playsInline
            preload="auto"
            aria-hidden
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,18,14,0.85)_0%,rgba(23,18,14,0.35)_55%,rgba(23,18,14,0.1)_100%)]" />

          <div className="absolute inset-0 mx-auto grid max-w-7xl items-center px-6 md:px-12">
            {captions.map((c, i) => (
              <div
                key={c.step}
                data-caption
                className={`col-start-1 row-start-1 max-w-xl ${i > 0 ? "opacity-0" : ""}`}
              >
                <p className="label-mono text-paper/80">{c.step}</p>
                <p className="mt-5 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] font-light tracking-[-0.03em] text-paper">
                  {c.text}
                </p>
              </div>
            ))}
          </div>

          <div className="absolute inset-x-6 bottom-8 h-px bg-paper/25 md:inset-x-12">
            <div data-video-progress className="h-full origin-left bg-paper" />
          </div>
        </div>
      </div>
    </section>
  )
}
