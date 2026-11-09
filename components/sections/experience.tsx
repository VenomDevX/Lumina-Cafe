import Image from "next/image"
import { Reveal } from "@/components/reveal"
import { Kicker } from "@/components/cta"
import { cn } from "@/lib/utils"

const moments = [
  {
    title: "Sunrise espresso bar",
    body: "Doors open at six. The first shots are pulled while the fishermen come in.",
    time: "06:00",
    image: "/images/espresso-bar.jpg",
    alt: "Warm café bar with pendant lights and an espresso machine",
    grid: "md:col-span-7 md:row-span-2",
    shape: "aspect-[4/5] md:aspect-auto",
  },
  {
    title: "Barefoot terrace",
    body: "Thirty seats on the dune, shaded by palms.",
    time: "All day",
    image: "/images/palm-beach.jpg",
    alt: "Palm tree on a white sand beach beside turquoise water",
    grid: "md:col-span-5",
    shape: "aspect-[4/3]",
  },
  {
    title: "Small-batch roastery",
    body: "Watch Tuesday's roast through the glass, taste it Wednesday.",
    time: "Tue",
    image: "/images/roastery.jpg",
    alt: "Espresso portafilters with ground coffee and whole beans",
    grid: "md:col-span-5",
    shape: "aspect-[4/3]",
  },
]

export function Experience() {
  return (
    <section id="experience" className="bg-paper py-28 md:py-40">
      <Reveal className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-12">
          <Kicker index="03" className="md:col-span-3 md:pt-3">
            Experience
          </Kicker>
          <h2 data-reveal className="font-display text-[clamp(2.6rem,5.5vw,5.5rem)] leading-[0.95] font-light tracking-[-0.035em] md:col-span-9">
            A café you feel before you taste.
          </h2>
        </div>

        <div className="mt-16 grid gap-x-6 gap-y-12 md:mt-24 md:grid-cols-12">
          {moments.map((m) => (
            <article key={m.title} className={cn("group flex flex-col", m.grid)}>
              <div data-reveal="img" className={cn("relative w-full flex-1 overflow-hidden bg-sand", m.shape)}>
                <Image
                  src={m.image}
                  alt={m.alt}
                  fill
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover transition-transform duration-1000 ease-sharp group-hover:scale-[1.03]"
                />
              </div>
              <div data-reveal className="mt-4 grid grid-cols-[1fr_auto] gap-x-6 border-t border-ink/15 pt-4">
                <h3 className="font-display text-2xl font-light tracking-tight md:text-3xl">{m.title}</h3>
                <span className="label-mono pt-2">{m.time}</span>
                <p className="mt-1 max-w-md text-sm text-ink/70">{m.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
