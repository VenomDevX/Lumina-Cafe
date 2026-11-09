import { z } from "zod"

const Signup = z.object({
  email: z.email("Please enter a valid email."),
  company: z.string().optional(), // honeypot
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const result = Signup.safeParse(body)
  if (!result.success) {
    return Response.json({ ok: false, errors: z.flattenError(result.error).fieldErrors }, { status: 400 })
  }
  if (result.data.company) return Response.json({ ok: true })

  // ponytail: logs only. Wire to an email provider (Vercel Marketplace) when the list goes live.
  console.log("[newsletter] signup") // no address in logs: it is personal data
  return Response.json({ ok: true })
}
