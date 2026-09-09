// Preserves ad click/source identifiers across the visit so they can be
// attached to a lead whenever one is submitted, even if the visitor lands on
// one page (e.g. the Spanish campaign page) and converts on another (e.g. /contact).
// See Website-Developer-Only-Instructions.md item 5.

const TRACKED_KEYS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

const STORAGE_KEY = 'ildr_ad_tracking'

type TrackingParams = Partial<Record<(typeof TRACKED_KEYS)[number], string>>

// Reads tracking params from the current URL and merges them into storage.
// Existing stored values are kept if the current URL doesn't carry a param,
// so a later pageview (e.g. navigating to /contact) doesn't erase the
// original ad click's attribution.
export function captureTrackingParams(): void {
  if (typeof window === 'undefined') return
  try {
    const params = new URLSearchParams(window.location.search)
    const found: TrackingParams = {}
    for (const key of TRACKED_KEYS) {
      const value = params.get(key)
      if (value) found[key] = value
    }
    if (Object.keys(found).length === 0) return
    const existing = getTrackingParams()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...found }))
  } catch {
    // Storage unavailable (private mode, etc.) — attribution is best-effort.
  }
}

export function getTrackingParams(): TrackingParams {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as TrackingParams) : {}
  } catch {
    return {}
  }
}

// A human-readable line to append to a lead's message, since the lead schema
// has no dedicated ad-tracking columns — "save them with the submitted lead
// whenever possible" per the instructions.
export function getTrackingReferenceLine(): string | null {
  const params = getTrackingParams()
  const entries = Object.entries(params).filter(([, v]) => v)
  if (entries.length === 0) return null
  return `Referencia: ${entries.map(([k, v]) => `${k}=${v}`).join(' | ')}`
}
