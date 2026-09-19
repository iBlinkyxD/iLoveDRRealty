/**
 * Scheduling-page providers a realtor/owner can connect. Both are just a public booking URL stored in
 * `calendly_url` (the column predates Google support), so the provider is inferred from the host.
 */
export type SchedulingProvider = 'calendly' | 'google'

export const SCHEDULING_PROVIDERS: SchedulingProvider[] = ['calendly', 'google']

export const SCHEDULING_LABEL: Record<SchedulingProvider, string> = {
  calendly: 'Calendly',
  google: 'Google Calendar',
}

export const SCHEDULING_COLOR: Record<SchedulingProvider, string> = {
  calendly: '#006BFF',
  google: '#1a73e8',
}

export const SCHEDULING_PLACEHOLDER: Record<SchedulingProvider, string> = {
  calendly: 'https://calendly.com/your-link',
  google: 'https://calendar.google.com/calendar/appointments/schedules/…',
}

function parse(raw: string): URL | null {
  try {
    const u = new URL(raw.trim())
    return u.protocol === 'https:' ? u : null
  } catch {
    return null
  }
}

function isGoogleHost(u: URL): boolean {
  if (u.hostname === 'calendar.app.google') return u.pathname.length > 1
  return u.hostname === 'calendar.google.com' && u.pathname.includes('/appointments/')
}

/** Which provider a stored URL belongs to. Anything that isn't a Google booking page is treated as Calendly (the legacy default). */
export function schedulingProvider(url: string): SchedulingProvider {
  const u = parse(url)
  return u && isGoogleHost(u) ? 'google' : 'calendly'
}

/** Strict check for a URL the user is connecting now. Returns the trimmed URL, or null when it isn't a `provider` booking page. */
export function validateSchedulingUrl(raw: string, provider: SchedulingProvider): string | null {
  const u = parse(raw)
  if (!u) return null
  if (provider === 'google') return isGoogleHost(u) ? raw.trim() : null
  return u.hostname === 'calendly.com' && u.pathname.length > 1 ? raw.trim() : null
}

/**
 * URL to load in an inline iframe, or null when the page can't be framed.
 * Google's `calendar.app.google` short links send X-Frame-Options: SAMEORIGIN, so only the long
 * `calendar.google.com/calendar/appointments/schedules/…` form (Google's own "embed" URL) can be inlined.
 */
export function schedulingEmbedUrl(url: string): string | null {
  const u = parse(url)
  if (!u) return null
  if (u.hostname === 'calendar.google.com' && u.pathname.includes('/appointments/')) {
    u.searchParams.set('gv', 'true')
    return u.toString()
  }
  if (u.hostname === 'calendly.com' || u.hostname === 'www.calendly.com') {
    u.searchParams.set('hide_gdpr_banner', '1')
    u.searchParams.set('embed_type', 'inline')
    return u.toString()
  }
  return null
}
