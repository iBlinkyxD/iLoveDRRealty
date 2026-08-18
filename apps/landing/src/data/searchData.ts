import { c } from '../design'

export interface RegionDef {
  key: string; x: number; y: number; lx: number; ly: number; tone: string
  lat: number; lng: number
}

export const DR_REGIONS: RegionDef[] = [
  { key: 'Puerto Plata',  x: 165, y:  66, lx: 110, ly:  36, tone: c.green, lat: 19.7947, lng: -70.6870 },
  { key: 'Sosúa',         x: 195, y:  62, lx: 195, ly:  32, tone: c.sea,   lat: 19.7517, lng: -70.5168 },
  { key: 'Cabarete',      x: 222, y:  64, lx: 262, ly:  36, tone: c.coral, lat: 19.7669, lng: -70.4101 },
  { key: 'Samaná',        x: 410, y:  90, lx: 470, ly:  72, tone: c.gold,  lat: 19.2063, lng: -69.3362 },
  { key: 'Las Terrenas',  x: 388, y:  70, lx: 388, ly:  38, tone: c.green, lat: 19.3086, lng: -69.5433 },
  { key: 'Santiago',      x: 195, y: 112, lx: 110, ly: 120, tone: c.sea,   lat: 19.4505, lng: -70.6918 },
  { key: 'Jarabacoa',     x: 220, y: 148, lx: 110, ly: 158, tone: c.green, lat: 19.1199, lng: -70.6400 },
  { key: 'Santo Domingo', x: 290, y: 188, lx: 280, ly: 222, tone: c.sea,   lat: 18.4861, lng: -69.9312 },
  { key: 'Punta Cana',    x: 478, y: 142, lx: 488, ly: 112, tone: c.coral, lat: 18.5601, lng: -68.3725 },
  { key: 'Cap Cana',      x: 482, y: 164, lx: 488, ly: 198, tone: c.gold,  lat: 18.4667, lng: -68.3633 },
]

/**
 * Region options for the search filter. Kept in sync with the dashboard's
 * listing form (apps/dashboard/src/data/regions.ts) — a realtor can pick any of
 * these, so search has to be able to filter by any of them.
 */
export const POPULAR_AREAS = [
  'Punta Cana', 'Santo Domingo', 'Cap Cana', 'Las Terrenas', 'Samaná',
  'Jarabacoa', 'Santiago', 'Puerto Plata', 'Sosúa', 'Cabarete',
]

/** The 31 provinces plus the Distrito Nacional. */
export const DR_PROVINCES = [
  'Azua', 'Bahoruco', 'Barahona', 'Dajabón', 'Distrito Nacional', 'Duarte',
  'El Seibo', 'Elías Piña', 'Espaillat', 'Hato Mayor', 'Hermanas Mirabal',
  'Independencia', 'La Altagracia', 'La Romana', 'La Vega',
  'María Trinidad Sánchez', 'Monseñor Nouel', 'Monte Cristi', 'Monte Plata',
  'Pedernales', 'Peravia', 'Puerto Plata', 'Samaná', 'San Cristóbal',
  'San José de Ocoa', 'San Juan', 'San Pedro de Macorís', 'Sánchez Ramírez',
  'Santiago', 'Santiago Rodríguez', 'Santo Domingo', 'Valverde',
]

/** Provinces not already shown as a popular area, so no region appears twice. */
export const OTHER_PROVINCES = DR_PROVINCES.filter(p => !POPULAR_AREAS.includes(p))

/**
 * Top of the price slider. A max at or above this means "and up" — it must not
 * be applied as a hard ceiling, or listings priced above it disappear.
 */
export const PRICE_MAX = 3_000_000

/**
 * Provincial capitals — where a listing pins when it has no explicit lat/lng.
 * Capitals rather than geometric centroids, since that is where inventory
 * actually concentrates. The 10 popular areas are not here; their finer-grained
 * coordinates come from DR_REGIONS above.
 */
const PROVINCE_COORDS: Record<string, { lat: number; lng: number }> = {
  'Azua':                   { lat: 18.4531, lng: -70.7350 },
  'Bahoruco':               { lat: 18.4833, lng: -71.4167 },
  'Barahona':               { lat: 18.2085, lng: -71.1008 },
  'Dajabón':                { lat: 19.5500, lng: -71.7083 },
  'Distrito Nacional':      { lat: 18.4861, lng: -69.9312 },
  'Duarte':                 { lat: 19.3000, lng: -70.2500 },
  'El Seibo':               { lat: 18.7667, lng: -69.0389 },
  'Elías Piña':             { lat: 18.8783, lng: -71.7000 },
  'Espaillat':              { lat: 19.3939, lng: -70.5261 },
  'Hato Mayor':             { lat: 18.7625, lng: -69.2564 },
  'Hermanas Mirabal':       { lat: 19.3806, lng: -70.4183 },
  'Independencia':          { lat: 18.4922, lng: -71.8508 },
  'La Altagracia':          { lat: 18.6157, lng: -68.7080 },
  'La Romana':              { lat: 18.4273, lng: -68.9728 },
  'La Vega':                { lat: 19.2214, lng: -70.5292 },
  'María Trinidad Sánchez': { lat: 19.3831, lng: -69.8475 },
  'Monseñor Nouel':         { lat: 18.9367, lng: -70.4092 },
  'Monte Cristi':           { lat: 19.8500, lng: -71.6500 },
  'Monte Plata':            { lat: 18.8069, lng: -69.7847 },
  'Pedernales':             { lat: 18.0383, lng: -71.7442 },
  'Peravia':                { lat: 18.2797, lng: -70.3308 },
  'San Cristóbal':          { lat: 18.4167, lng: -70.1000 },
  'San José de Ocoa':       { lat: 18.5453, lng: -70.5069 },
  'San Juan':               { lat: 18.8064, lng: -71.2294 },
  'San Pedro de Macorís':   { lat: 18.4539, lng: -69.3086 },
  'Sánchez Ramírez':        { lat: 19.0553, lng: -70.1500 },
  'Santiago Rodríguez':     { lat: 19.4772, lng: -71.3400 },
  'Valverde':               { lat: 19.5514, lng: -71.0781 },
}

/** Every region the listing form can produce, mapped to coordinates. */
export const REGION_COORDS: Record<string, { lat: number; lng: number }> = {
  ...PROVINCE_COORDS,
  ...Object.fromEntries(DR_REGIONS.map(r => [r.key, { lat: r.lat, lng: r.lng }])),
}

const deaccent = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

/**
 * Coordinates for a listing's region string. Exact match first — that is what
 * the listing form writes — then substring matching for older free-text values
 * like "Cabarete, Puerto Plata". Returns null when nothing matches, so callers
 * decide their own fallback.
 */
export function coordsForRegion(region: string): { lat: number; lng: number } | null {
  if (!region) return null
  const exact = REGION_COORDS[region.trim()]
  if (exact) return exact

  // Free-text regions are written most-specific-first, so the earliest match in
  // the string wins ("Cabarete, Puerto Plata" is in Cabarete). Ties go to the
  // longer key, so "Santiago Rodríguez" is not swallowed by "Santiago".
  const flat = deaccent(region)
  let best: { key: string; at: number } | null = null
  for (const key of Object.keys(REGION_COORDS)) {
    const at = flat.indexOf(deaccent(key))
    if (at === -1) continue
    if (!best || at < best.at || (at === best.at && key.length > best.key.length)) {
      best = { key, at }
    }
  }
  return best ? REGION_COORDS[best.key] : null
}

/** True for the tourist areas, which are tight enough to zoom in on hard. */
export const isLocality = (region: string) => DR_REGIONS.some(r => r.key === region)
