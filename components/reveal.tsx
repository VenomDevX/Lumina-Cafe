"use client"

import { useRef, type ReactNode } from "react"
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap"

/**
 * Lifts every [data-reveal] descendant into place as it enters the viewport.
 * [data-reveal="img"] gets a hard-edged clip wipe instead.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const q = (sel: string) => Array.from(root.current!.querySelectorAll(sel))
        ScrollTrigger.batch(q("[data-reveal]:not([data-reveal='img'])"), {
          start: "top 90%",
          once: true,
          onEnter: (els) =>
            gsap.fromTo(els, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }),
        })
        ScrollTrigger.batch(q("[data-reveal='img']"), {
          start: "top 92%",
          once: true,
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { opacity: 1, clipPath: "inset(0% 0% 100% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, stagger: 0.1, ease: "expo.inOut" }
            ),
        })
      })
    },
    { scope: root }
  )

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  )
}
