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
