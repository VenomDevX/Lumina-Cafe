import { toast } from "sonner"

/** POST a form as JSON; toasts the outcome and resets the form on success. */
export async function submitForm(form: HTMLFormElement, url: string, success: string) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const first = Object.values<string[]>(data.errors ?? {})[0]?.[0]
      toast.error(first ?? "Something went wrong. Please try again.")
      return false
    }
    toast.success(success)
    form.reset()
    return true
  } catch {
    toast.error("Network error. Check your connection and try again.")
    return false
  }
}
