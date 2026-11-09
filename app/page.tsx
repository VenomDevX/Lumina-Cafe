import { Hero } from "@/components/sections/hero"
import { Story } from "@/components/sections/story"
import { ScrollVideo } from "@/components/sections/scroll-video"
import { Signature } from "@/components/sections/signature"
import { Experience } from "@/components/sections/experience"
import { Testimonials } from "@/components/sections/testimonials"
import { Visit } from "@/components/sections/visit"

export default function Home() {
  return (
    <>
      <Hero />
      <Story />
      <ScrollVideo />
      <Signature />
      <Experience />
      <Testimonials />
      <Visit />
    </>
  )
}
