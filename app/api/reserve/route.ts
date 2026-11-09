import { z } from "zod"

const Reservation = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.email("Please enter a valid email."),
  date: z.iso.date("Please pick a date."),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Please pick a time."),
  guests: z.coerce.number().int().min(1).max(12, "For groups over 12, please call us."),
  notes: z.string().trim().max(500).optional(),
  company: z.string().optional(), // honeypot
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const result = Reservation.safeParse(body)
  if (!result.success) {
    return Response.json({ ok: false, errors: z.flattenError(result.error).fieldErrors }, { status: 400 })
  }

  const { company, ...reservation } = result.data
  // Bots fill the hidden field; pretend success so they don't retry.
  if (company) return Response.json({ ok: true })

  // one day of slack: the server runs on UTC, the guest picks a date in their own timezone
  const earliest = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
  if (reservation.date < earliest) {
    return Response.json({ ok: false, errors: { date: ["Please choose a date from today onward."] } }, { status: 400 })
  }

  // ponytail: logs only, no persistence. Add a DB / email (Vercel Marketplace) when real bookings are needed.
  // no name/email/notes in logs: they are personal data
  console.log("[reservation]", { date: reservation.date, time: reservation.time, guests: reservation.guests })
  return Response.json({ ok: true })
}
