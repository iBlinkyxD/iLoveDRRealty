import { c } from '../design'

export interface RegionDef {
  key: string; x: number; y: number; lx: number; ly: number; tone: string
}

export const DR_REGIONS: RegionDef[] = [
  { key: 'Puerto Plata',  x: 165, y:  66, lx: 110, ly:  36, tone: c.green },
  { key: 'Sosúa',         x: 195, y:  62, lx: 195, ly:  32, tone: c.sea   },
  { key: 'Cabarete',      x: 222, y:  64, lx: 262, ly:  36, tone: c.coral },
  { key: 'Samaná',        x: 410, y:  90, lx: 470, ly:  72, tone: c.gold  },
  { key: 'Las Terrenas',  x: 388, y:  70, lx: 388, ly:  38, tone: c.green },
  { key: 'Santiago',      x: 195, y: 112, lx: 110, ly: 120, tone: c.sea   },
  { key: 'Jarabacoa',     x: 220, y: 148, lx: 110, ly: 158, tone: c.green },
  { key: 'Santo Domingo', x: 290, y: 188, lx: 280, ly: 222, tone: c.sea   },
  { key: 'Punta Cana',    x: 478, y: 142, lx: 488, ly: 112, tone: c.coral },
  { key: 'Cap Cana',      x: 482, y: 164, lx: 488, ly: 198, tone: c.gold  },
]
