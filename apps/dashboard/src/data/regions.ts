/**
 * Region options for the listing form.
 *
 * `POPULAR_AREAS` are the tourist localities the site has always offered — the
 * values are unchanged so existing listings keep matching. `DR_PROVINCES` is the
 * full national set: the 31 provinces plus the Distrito Nacional.
 */

export const POPULAR_AREAS = [
  'Cap Cana', 'Cabarete', 'Jarabacoa', 'Las Terrenas', 'Punta Cana',
  'Puerto Plata', 'Samaná', 'Santo Domingo', 'Santiago', 'Sosúa',
]

export const DR_PROVINCES = [
  'Azua', 'Bahoruco', 'Barahona', 'Dajabón', 'Distrito Nacional', 'Duarte',
  'El Seibo', 'Elías Piña', 'Espaillat', 'Hato Mayor', 'Hermanas Mirabal',
  'Independencia', 'La Altagracia', 'La Romana', 'La Vega',
  'María Trinidad Sánchez', 'Monseñor Nouel', 'Monte Cristi', 'Monte Plata',
  'Pedernales', 'Peravia', 'Puerto Plata', 'Samaná', 'San Cristóbal',
  'San José de Ocoa', 'San Juan', 'San Pedro de Macorís', 'Sánchez Ramírez',
  'Santiago', 'Santiago Rodríguez', 'Santo Domingo', 'Valverde',
]

/** Provinces that aren't already offered as a popular area, so no value appears twice. */
export const OTHER_PROVINCES = DR_PROVINCES.filter(p => !POPULAR_AREAS.includes(p))

export const REGION_GROUPS: { key: 'popular' | 'provinces'; regions: string[] }[] = [
  { key: 'popular',   regions: POPULAR_AREAS   },
  { key: 'provinces', regions: OTHER_PROVINCES },
]

/** Every selectable region value, de-duplicated. */
export const ALL_REGIONS = [...POPULAR_AREAS, ...OTHER_PROVINCES]
