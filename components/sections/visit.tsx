"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { Reveal } from "@/components/reveal"
import { Arrow, Kicker } from "@/components/cta"
import { submitForm } from "@/lib/forms"

const hours = [
  ["Mon – Thu", "06:00 – 18:00"],
  ["Fri", "06:00 – 21:00"],
  ["Sat – Sun", "07:00 – 20:00"],
]

const field =
  "h-12 w-full border-0 border-b border-paper/30 bg-transparent px-0 text-base text-paper placeholder:text-paper/50 outline-none transition-colors focus:border-paper [color-scheme:dark]"

function Field({ id, label, className, children }: { id: string; label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label-mono text-paper/70">
        {label}
      </label>
      {children}
    </div>
  )
}

export function Visit() {
  const [pending, setPending] = useState(false)
  const date = useRef<HTMLInputElement>(null)

  // set on mount so prerendered HTML never bakes in a stale "today"
  useEffect(() => {
    if (date.current) date.current.min = new Date().toLocaleDateString("en-CA")
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    await submitForm(e.currentTarget, "/api/reserve", "Table requested. We'll confirm by email within the hour.")
    setPending(false)
  }

  return (
    <section id="visit" className="bg-ink text-paper">
      <Reveal className="mx-auto grid max-w-[1600px] gap-16 px-5 py-28 md:grid-cols-12 md:px-10 md:py-40">
        <div className="md:col-span-5">
          <Kicker index="05" className="text-paper/70">
            Visit
          </Kicker>
          <h2 data-reveal className="mt-8 font-display text-[clamp(2.6rem,5.5vw,5.5rem)] leading-[0.95] font-light tracking-[-0.035em]">
            Save a seat by the sea.
          </h2>

          <dl data-reveal className="mt-14 border-t border-paper/20">
            <div className="flex justify-between gap-4 border-b border-paper/20 py-4">
              <dt className="label-mono text-paper/70">Address</dt>
              <dd className="text-right text-sm">1 Driftwood Lane, Palm Cove</dd>
            </div>
            {hours.map(([d, h]) => (
              <div key={d} className="flex justify-between gap-4 border-b border-paper/20 py-4">
                <dt className="label-mono text-paper/70">{d}</dt>
                <dd className="text-sm tabular-nums">{h}</dd>
              </div>
            ))}
          </dl>
          <div data-reveal className="mt-8 flex flex-wrap gap-8">
            <a href="tel:+15550142026" className="group label-mono inline-flex items-center gap-3">
              +1 555 014 2026
            </a>
            <a href="https://maps.google.com/?q=Palm+Cove+beach" target="_blank" rel="noreferrer" className="group label-mono inline-flex items-center gap-3">
              Directions <Arrow />
            </a>
          </div>
        </div>

        <form data-reveal onSubmit={onSubmit} className="grid content-start gap-x-8 gap-y-8 sm:grid-cols-2 md:col-span-6 md:col-start-7">
          <p className="label-mono text-paper/70 sm:col-span-2">Reservation</p>
          <Field id="name" label="Name" className="sm:col-span-2">
            <input id="name" name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Your name" className={field} />
          </Field>
          <Field id="email" label="Email" className="sm:col-span-2">
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} />
          </Field>
          <Field id="date" label="Date">
            <input ref={date} id="date" name="date" type="date" required className={field} />
          </Field>
          <Field id="time" label="Time">
            <input id="time" name="time" type="time" required min="06:00" max="20:30" step={900} className={field} />
          </Field>
          <Field id="guests" label="Guests">
            <select id="guests" name="guests" defaultValue="2" className={field}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1} className="bg-ink">
                  {i + 1}
                </option>
              ))}
            </select>
          </Field>
          <Field id="notes" label="Notes (optional)">
            <input id="notes" name="notes" maxLength={500} placeholder="Terrace, high chair…" className={field} />
          </Field>
          {/* honeypot: hidden from people, filled by bots */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

          <button
            type="submit"
            disabled={pending}
            className="group label-mono mt-4 inline-flex h-14 items-center justify-between bg-paper px-6 text-ink transition-colors duration-300 ease-sharp hover:bg-leaf disabled:opacity-60 sm:col-span-2"
          >
            {pending ? "Sending…" : "Request table"}
            <Arrow />
          </button>
        </form>
      </Reveal>
    </section>
  )
}
