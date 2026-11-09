"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin)
gsap.defaults({ ease: "power3.out" })

/** Wrap motion in gsap.matchMedia().add(MOTION_OK, …) so reduced-motion users get static UI. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)"

export { gsap, ScrollTrigger, SplitText, useGSAP }
