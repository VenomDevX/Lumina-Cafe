"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap"

/** Lenis keeps native scrolling (so ScrollTrigger pins just work) and only smooths the wheel. */
export function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return

    const instance = new Lenis({ lerp: 0.09, anchors: { offset: -24 } })
    instance.on("scroll", ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    lenis.current = instance

    // A link click hands scrolling to Next.js: cancel any in-flight easing first,
    // otherwise Lenis drags the new page toward the old scroll target.
    const halt = (e: MouseEvent) => {
      if ((e.target as Element).closest("a[href]")) {
        instance.stop()
        instance.start()
      }
    }
    document.addEventListener("click", halt, true)

    return () => {
      document.removeEventListener("click", halt, true)
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis.current = null
    }
  }, [])

  // Same for back/forward navigation.
  useLayoutEffect(() => {
    lenis.current?.stop()
    lenis.current?.start()

    // Next.js jumps to "/#visit" before the sections' pin spacers exist, so the target
    // moves afterwards. Once the pins are mounted, re-measure and jump again.
    if (!location.hash) return
    const jump = () => {
      ScrollTrigger.refresh()
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 24)
    }
    const id = requestAnimationFrame(jump)
    // On a fresh load the browser re-applies its own fragment scroll at "load"; jump again after it.
    const onLoad = () => requestAnimationFrame(jump)
    if (document.readyState !== "complete") window.addEventListener("load", onLoad, { once: true })
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener("load", onLoad)
    }
  }, [pathname])

  return null
}
