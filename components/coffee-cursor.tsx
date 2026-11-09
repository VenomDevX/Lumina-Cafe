"use client"

import { useEffect, useRef } from "react"
import { MOTION_OK } from "@/lib/gsap"

type Ripple = { x: number; y: number; t: number; size: number }

const CREMA = "176, 122, 79" // --color-crema
const LIFE = 1100 // ms
const STEP = 46 // px of pointer travel between drops

/** Desktop only: the pointer leaves crema ripples, like drops landing in a cup. Click for a bigger splash. */
export function CoffeeCursor() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!matchMedia(`(pointer: fine) and ${MOTION_OK}`).matches) return
    const el = canvas.current!
    const ctx = el.getContext("2d")!
    const ripples: Ripple[] = []
    let last = { x: -1e4, y: -1e4 }
    let frame = 0

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2)
      el.width = innerWidth * dpr
      el.height = innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // only animates while ripples are alive
    const draw = (now: number) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        const p = Math.max(0, now - r.t) / LIFE // the frame time can precede a drop made this frame
        if (p >= 1) {
          ripples.splice(i, 1)
          continue
        }
        const ease = 1 - (1 - p) ** 3
        // two rings, the inner one trailing, like a drop on liquid
        for (const [k, a] of [[1, 0.55], [0.55, 0.35]] as const) {
          ctx.beginPath()
          ctx.arc(r.x, r.y, r.size * k * ease, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${CREMA}, ${a * (1 - p)})`
          ctx.lineWidth = 1.25
          ctx.stroke()
        }
      }
      frame = ripples.length ? requestAnimationFrame(draw) : 0
    }

    const drop = (x: number, y: number, size: number) => {
      ripples.push({ x, y, t: performance.now(), size })
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || Math.hypot(e.clientX - last.x, e.clientY - last.y) < STEP) return
      last = { x: e.clientX, y: e.clientY }
      drop(e.clientX, e.clientY, 22 + Math.random() * 12)
    }
    const click = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      drop(e.clientX, e.clientY, 70)
      setTimeout(() => drop(e.clientX, e.clientY, 44), 120)
    }

    resize()
    addEventListener("resize", resize)
    addEventListener("pointermove", move, { passive: true })
    addEventListener("pointerdown", click, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener("resize", resize)
      removeEventListener("pointermove", move)
      removeEventListener("pointerdown", click)
    }
  }, [])

  return <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-30 h-full w-full" />
}
