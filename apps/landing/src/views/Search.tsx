'use client'
import { useNav } from '../hooks/useNav'
import { useState, useMemo, useEffect, type ReactNode } from 'react'
import { BedDouble, Bath, Maximize2, MapPin, Heart, TrendingUp, SlidersHorizontal, X } from 'lucide-react'
import { LISTINGS, fmt, type Listing } from '../data/listings'
import { DR_REGIONS } from '../data/searchData'

type TagTone = 'sand' | 'coral' | 'sea' | 'gold' | 'green'
const TONE_CLASSES: Record<TagTone, string> = {
  sand:  'bg-ink/80 text-white border border-white/20',
  coral: 'bg-coral text-white border border-coral',
  sea:   'bg-sea text-white border border-sea',
  gold:  'bg-gold text-[#3d2800] border border-gold',
  green: 'bg-[#1f7a3d] text-white border border-[#1f7a3d]',
}

function regionOf(l: Listing): string {
  const r = l.region
  if (/Punta Cana/.test(r))                            return 'Punta Cana'
  if (/Cap Cana/.test(r))                              return 'Cap Cana'
  if (/Santo Domingo|SD Este|Naco|Piantini/.test(r))   return 'Santo Domingo'
  if (/Las Terrenas|Saman/.test(r))                    return 'Las Terrenas'
  if (/Sos[uú]a/.test(r))                              return 'Sosúa'
  if (/Cabarete/.test(r))                              return 'Cabarete'
  if (/Puerto Plata/.test(r))                          return 'Puerto Plata'
  return r
}

function coordsForListing(l: Listing) {
  const match = (s: string, key: string) =>
    new RegExp(key.replace('á', '[áa]').replace('ú', '[úu]'), 'i').test(s)
  const base = DR_REGIONS.find(reg => match(l.region, reg.key))
    ?? DR_REGIONS.find(reg => reg.key === 'Santo Domingo')
    ?? DR_REGIONS[0]
  const seed = (l.id * 9301 + 49297) % 233280
  const rand = (i: number) => (((seed * (i + 1)) % 233280) / 233280) * 2 - 1
  return { x: base.x + rand(1) * 12, y: base.y + rand(2) * 8, tone: base.tone }
}


function Tag({ children, tone = 'sand' }: { children: ReactNode; tone?: string }) {
  const cls = TONE_CLASSES[(tone as TagTone)] ?? TONE_CLASSES.sand
  return (
    <span className={`text-[10.5px] font-bold tracking-widest uppercase py-1 px-2.5 rounded-full ${cls}`}>
      {children}
    </span>
  )
}

function PropertyCard({ l, go, onHover }: {
  l: Listing
  go: (p: string) => void
  onHover?: (l: Listing | null) => void
}) {
  const [hot, setHot] = useState(false)
  return (
    <div
      onMouseEnter={() => { setHot(true); onHover?.(l) }}
      onMouseLeave={() => { setHot(false); onHover?.(null) }}
      onClick={() => go(`detail?id=${l.id}`)}
      className={`bg-paper rounded-xl overflow-hidden cursor-pointer transition-all duration-250 border ${hot ? 'border-line -translate-y-1 shadow-[0_22px_50px_-28px_rgba(0,16,46,.4)]' : 'border-line-soft shadow-[0_1px_0_rgba(0,16,46,.03)]'}`}
    >
      <div className="relative h-46" style={{ backgroundImage: `url(${l.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute top-3 left-3 flex gap-1.5">
          {l.tags.map(([tag, tone], i) => <Tag key={i} tone={tone}>{tag}</Tag>)}
        </div>
        <button
          onClick={e => e.stopPropagation()}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-coral grid place-items-center border-none cursor-pointer"
        >
          <Heart size={16} />
        </button>
        {l.roi > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.25 bg-ink/90 text-paper py-1.25 px-2.5 rounded-md text-xs font-semibold">
            <TrendingUp size={13} />{l.roi}% yield
          </div>
        )}
      </div>
      <div className="pt-4 px-4.5 pb-4.5 font-sans">
        <div className="font-serif text-5.25 font-semibold text-ink">
          {fmt(l.price)}
          {l.purpose === 'rent' && <span className="text-3.25 text-dim font-sans"> / mo</span>}
        </div>
        <div className="text-3.75 font-semibold text-ink mt-1.5 mb-1 leading-[1.3]">{l.title}</div>
        <div className="flex items-center gap-1.25 text-dim text-[12.5px]">
          <MapPin size={13} />{l.region}
        </div>
        <div className="flex gap-4 mt-3.5 pt-3.25 border-t border-line-soft text-ink2 text-[12.5px]">
          {l.bd > 0 && <span className="flex items-center gap-1.25"><BedDouble size={15} />{l.bd} bd</span>}
          {l.ba > 0 && <span className="flex items-center gap-1.25"><Bath size={15} />{l.ba} ba</span>}
          <span className="flex items-center gap-1.25"><Maximize2 size={15} />{l.m2} m²</span>
        </div>
      </div>
    </div>
  )
}

const SANS = '"Mona Sans", "Inter", -apple-system, system-ui, sans-serif'
const SERIF = '"Fraunces", "Playfair Display", Georgia, serif'

function DRMap({ active, onPick, counts, hovered, listings, onSelect }: {
  active: string | null
  onPick: (r: string | null) => void
  counts: Record<string, number>
  hovered: Listing | null
  listings: Listing[]
  onSelect: (l: Listing) => void
}) {
  const hoverPos = hovered ? coordsForListing(hovered) : null
  return (
    <div className="bg-ink rounded-2xl overflow-hidden border border-line">
      <div className="pt-3.5 px-4.5 pb-2">
        <div className="font-serif text-4.25 font-semibold text-paper">Dominican Republic</div>
        <div className="text-xs text-white/60 mt-0.5 font-sans">
          {listings.length > 0
            ? `${listings.length} ${listings.length === 1 ? 'property' : 'properties'} mapped · hover a card`
            : 'Tap a region to filter'}
        </div>
      </div>

      <svg viewBox="0 0 540 240" preserveAspectRatio="none" className="w-full h-65 block">
        <defs>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0e3656" /><stop offset="1" stopColor="#082a47" />
          </linearGradient>
          <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a8a52" /><stop offset="1" stopColor="#2c6e3f" />
          </linearGradient>
          <radialGradient id="hoverGlow">
            <stop offset="0" stopColor="#e10f1f" stopOpacity=".7" />
            <stop offset="1" stopColor="#e10f1f" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="540" height="240" fill="url(#water)" />
        <g opacity="0.18" stroke="#6fbdf2" strokeWidth=".7" fill="none">
          <path d="M0 218 Q135 212 270 218 T540 218" />
          <path d="M0 12 Q135 6 270 12 T540 12" />
        </g>

        {/* Haiti */}
        <path d="M0 50 L70 42 L80 90 L70 140 L62 180 L40 215 L0 220 Z" fill="#1d3b58" opacity="0.55" />
        <text x="32" y="135" textAnchor="middle" fontSize="9" fontWeight="600"
          fill="rgba(255,255,255,.32)" fontFamily={SANS}>HAITI</text>

        {/* DR landmass */}
        <path d="M 65 95 C 78 72,105 58,132 56 C 165 53,200 55,235 57 C 270 59,300 58,325 57
          C 355 56,380 58,400 62 L 415 66 L 430 64 C 445 62,458 64,462 70 C 466 76,460 82,448 84
          L 432 84 L 418 82 C 408 80,398 80,390 84 L 386 90 C 392 96,408 98,422 96 L 445 92
          C 465 91,485 97,500 110 C 510 122,510 138,502 152 C 494 168,480 176,460 180
          C 440 182,415 178,392 174 C 372 170,352 168,332 172 C 312 178,296 188,280 198
          C 262 204,240 206,215 204 C 188 200,162 192,138 180 C 115 168,95 154,80 138
          C 70 124,62 108,65 95 Z"
          fill="url(#land)" stroke="#1a5230" strokeWidth="1.2" />

        {/* Mountain ranges */}
        <g opacity="0.55" fill="#1f5e33">
          <path d="M155 112 l16 -14 14 14 z" /><path d="M178 118 l14 -12 14 12 z" />
          <path d="M198 120 l16 -16 16 16 z" /><path d="M222 122 l14 -12 14 12 z" />
          <path d="M150 142 l12 -10 12 10 z" /><path d="M168 148 l14 -12 14 12 z" />
        </g>
        <path d="M150 80 Q165 110 190 138 Q220 164 252 180"
          stroke="#6fbdf2" strokeWidth="1.1" strokeDasharray="3 3" fill="none" opacity="0.4" />

        {/* Region labels */}
        {DR_REGIONS.map(r => {
          const on = active === r.key
          const n = counts[r.key] || 0
          const w = r.key.length * 5.6 + (n ? 18 : 10)
          return (
            <g key={r.key} onClick={() => onPick(on ? null : r.key)} style={{ cursor: 'pointer' }}>
              <line x1={r.x} y1={r.y} x2={r.lx} y2={r.ly + 6} stroke="rgba(255,255,255,.28)" strokeWidth="1" />
              <circle cx={r.x} cy={r.y} r={on ? 5 : 3.5}
                fill={on ? r.tone : '#fff'} stroke={on ? '#fff' : r.tone} strokeWidth="1.4" opacity="0.95" />
              <rect x={r.lx - w / 2} y={r.ly - 7} width={w} height="14" rx="7"
                fill={on ? r.tone : 'rgba(255,255,255,.92)'} />
              <text x={r.lx} y={r.ly + 2.5} textAnchor="middle" fontSize="9" fontWeight="700"
                fill={on ? '#fff' : '#00102e'} fontFamily={SANS}>
                {r.key}{n ? ` · ${n}` : ''}
              </text>
            </g>
          )
        })}

        {/* Property pins */}
        {listings.map(l => {
          const pos = coordsForListing(l)
          const isHot = hovered?.id === l.id
          return (
            <g key={l.id} onClick={() => onSelect(l)} style={{ cursor: 'pointer' }}>
              {isHot && <circle cx={pos.x} cy={pos.y} r="14" fill="url(#hoverGlow)" />}
              <circle cx={pos.x} cy={pos.y} r={isHot ? 6 : 3.4}
                fill={isHot ? '#e10f1f' : '#fff'} stroke={isHot ? '#fff' : '#e10f1f'}
                strokeWidth={isHot ? 2 : 1.2} />
            </g>
          )
        })}

        {/* Hover tooltip */}
        {hovered && hoverPos && (() => {
          const tw = 196, th = 56
          const above = hoverPos.y > 90
          const ty = above ? hoverPos.y - th - 14 : hoverPos.y + 14
          const tx = Math.max(6, Math.min(540 - tw - 6, hoverPos.x - tw / 2))
          const arrowX = hoverPos.x
          const arrowY = above ? ty + th : ty
          const title  = hovered.title.length  > 28 ? hovered.title.slice(0, 27)  + '…' : hovered.title
          const region = hovered.region.length > 28 ? hovered.region.slice(0, 27) + '…' : hovered.region
          const price  = fmt(hovered.price) + (hovered.purpose === 'rent' ? ' / mo' : '')
          return (
            <g key="tooltip" style={{ pointerEvents: 'none' }}>
              <rect x={tx} y={ty + 1} width={tw} height={th} rx="8" fill="rgba(0,16,46,.25)" />
              <rect x={tx} y={ty}     width={tw} height={th} rx="8" fill="#ffffff" stroke="#e4ddcf" strokeWidth="1" />
              <text x={tx + 12} y={ty + 18} fontSize="13" fontWeight="700" fill="#e10f1f"  fontFamily={SERIF}>{price}</text>
              <text x={tx + 12} y={ty + 34} fontSize="11" fontWeight="600" fill="#00102e"  fontFamily={SANS}>{title}</text>
              <text x={tx + 12} y={ty + 48} fontSize="10"                  fill="#7884a0"  fontFamily={SANS}>📍 {region}</text>
              <polygon
                points={above
                  ? `${arrowX - 6},${arrowY - 1} ${arrowX + 6},${arrowY - 1} ${arrowX},${arrowY + 6}`
                  : `${arrowX - 6},${arrowY + 1} ${arrowX + 6},${arrowY + 1} ${arrowX},${arrowY - 6}`}
                fill="#ffffff" stroke="#e4ddcf" strokeWidth="1" />
            </g>
          )
        })()}
      </svg>

      {/* Quick region shortcuts */}
      <div className="pt-2.5 px-4 pb-3.5 flex flex-wrap gap-1.5">
        {['Punta Cana', 'Cap Cana', 'Santo Domingo', 'Las Terrenas', 'Puerto Plata', 'Sosúa'].map(k => {
          const on = active === k
          return (
            <button key={k} onClick={() => onPick(on ? null : k)}
              className={`font-sans text-2.75 cursor-pointer py-1.25 px-2.5 rounded-full border ${on ? 'bg-coral text-white border-coral font-bold' : 'bg-white/10 text-white/80 border-white/18 font-medium'}`}>
              {k}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Search() {
  const go = useNav()
  const [purpose,  setPurpose]  = useState<'sale' | 'rent' | 'investment'>('sale')
  const [type,     setType]     = useState('All')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(3_000_000)
  const [beds,     setBeds]     = useState('any')
  const [sort,     setSort]     = useState<'new' | 'low' | 'high' | 'roi'>('new')
  const [region,   setRegion]   = useState<string | null>(null)
  const [minROI,   setMinROI]   = useState(0)
  const [amenities, setAmenities] = useState(new Set<string>())
  const [invFlags,  setInvFlags]  = useState(new Set<string>())
  const [hovered,  setHovered]  = useState<Listing | null>(null)
  const [view,        setView]        = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [filtersOpen])

  const TYPES        = ['All', 'Villa', 'Condo', 'House', 'Land', 'Commercial', 'Rental']
  const ALL_REGIONS  = ['Punta Cana', 'Santo Domingo', 'Cap Cana', 'Las Terrenas', 'Samaná', 'Jarabacoa', 'Santiago', 'Puerto Plata', 'Sosúa', 'Cabarete']
  const ALL_AMENITIES = ['Pool', 'Ocean View', 'Beachfront', 'Garage', 'Gated', 'A/C', 'Gym', 'Golf', 'Furnished', 'Generator']

  const counts = useMemo(() => {
    const m: Record<string, number> = {}
    LISTINGS.forEach(l => { const k = regionOf(l); m[k] = (m[k] || 0) + 1 })
    return m
  }, [])

  const results = useMemo(() => {
    let r = LISTINGS.filter(l =>
      (purpose === 'sale' || l.purpose === purpose || (purpose === 'investment' && l.roi >= 7)) &&
      (type === 'All' || l.type === type) &&
      (!region || regionOf(l) === region) &&
      l.roi >= minROI &&
      (beds === 'any' || l.bd >= +beds) &&
      (l.purpose === 'rent' || (l.price >= minPrice && l.price <= maxPrice))
    )
    if (sort === 'low')  r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'high') r = [...r].sort((a, b) => b.price - a.price)
    if (sort === 'roi')  r = [...r].sort((a, b) => b.roi   - a.roi)
    return r
  }, [purpose, type, minPrice, maxPrice, sort, region, minROI, beds])

  const insights = useMemo(() => {
    if (!results.length) return null
    const avg    = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length
    const median = (xs: number[]) => {
      const s = [...xs].sort((a, b) => a - b)
      return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2
    }
    const sales  = results.filter(l => l.purpose === 'sale')
    const yields = results.filter(l => l.roi > 0).map(l => l.roi)
    return {
      count:    results.length,
      median:   sales.length  ? median(sales.map(l => l.price)) : 0,
      avgYield: yields.length ? avg(yields) : 0,
    }
  }, [results])

  const alsoLike = useMemo(() => {
    const ids = new Set(results.map(l => l.id))
    const rest = LISTINGS.filter(l => !ids.has(l.id))
    if (region) {
      const nearby = rest.filter(l => regionOf(l) === region)
      return nearby.length ? nearby.slice(0, 3) : rest.slice(0, 3)
    }
    return rest.slice(0, 3)
  }, [results, region])

  const chips: { label: string; clear: () => void }[] = []
  if (purpose !== 'sale') chips.push({ label: purpose === 'rent' ? 'For Rent' : 'Investment', clear: () => setPurpose('sale') })
  if (type !== 'All')     chips.push({ label: type, clear: () => setType('All') })
  if (beds !== 'any')     chips.push({ label: `${beds}+ beds`, clear: () => setBeds('any') })
  if (region)             chips.push({ label: region, clear: () => setRegion(null) })
  if (minROI > 0)         chips.push({ label: `ROI ${minROI}%+`, clear: () => setMinROI(0) })
  amenities.forEach(a => chips.push({ label: a, clear: () => { const n = new Set(amenities); n.delete(a); setAmenities(n) } }))
  invFlags.forEach(f  => chips.push({ label: f, clear: () => { const n = new Set(invFlags);  n.delete(f); setInvFlags(n)  } }))
  if (minPrice > 0 || maxPrice < 3_000_000)
    chips.push({ label: `${fmt(minPrice)} – ${fmt(maxPrice)}`, clear: () => { setMinPrice(0); setMaxPrice(3_000_000) } })

  const clearAll = () => {
    setPurpose('sale'); setType('All'); setMinPrice(0); setMaxPrice(3_000_000)
    setBeds('any'); setRegion(null); setMinROI(0); setAmenities(new Set()); setInvFlags(new Set())
  }

  const FilterGroup = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="mb-5.5">
      <div className="text-2.75 font-bold tracking-widest uppercase text-dim mb-2.5">{label}</div>
      {children}
    </div>
  )

  const Chip = ({ active, onClick, children, tone }: { active: boolean; onClick: () => void; children: ReactNode; tone?: 'coral' | 'brand' }) => (
    <button onClick={onClick}
      className={`font-sans text-[12.5px] cursor-pointer py-1.5 px-3 rounded-full mr-1.25 mb-1.25 border transition-all duration-150 ${
        active
          ? tone === 'coral' ? 'bg-coral text-paper border-coral font-bold'
          : tone === 'brand' ? 'bg-brand text-paper border-brand font-bold'
          : 'bg-ink text-paper border-ink font-bold'
          : 'bg-paper text-ink2 border-line font-medium'
      }`}>{children}</button>
  )

  const Insight = ({ label, value, tone }: { label: string; value: string | number; tone?: 'brand' }) => (
    <div className="py-2.5 border-b border-line-soft">
      <div className="text-[10.5px] font-bold tracking-[.08em] uppercase text-dim mb-1">{label}</div>
      <div className={`font-serif text-5.5 font-bold leading-none ${tone === 'brand' ? 'text-brand' : 'text-ink'}`}>{value}</div>
    </div>
  )

  const fmtMedian = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : `$${Math.round(v / 1_000)}K`

  return (
    <>
    <div className="max-w-380 mx-auto pt-4 sm:pt-6 px-4 sm:px-6 pb-17.5 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px] gap-5.5 font-sans items-start">

      {/* ===== LEFT: FILTERS ===== */}
      <aside className="hidden lg:block self-start sticky top-22.5 max-h-[calc(100vh-110px)] overflow-y-auto bg-paper border border-line-soft rounded-2xl p-4.5">

        <div className="flex items-center justify-between mb-4.5 pb-3 border-b border-line-soft">
          <div className="font-serif text-4.5 font-bold text-ink">Filters / Filtros</div>
          {chips.length > 0 &&
            <span className="text-2.5 font-bold py-0.75 px-2 rounded-full bg-coral text-white">
              {chips.length}
            </span>}
        </div>

        <FilterGroup label="Property Type">
          {TYPES.map(t => <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>)}
        </FilterGroup>

        <FilterGroup label="Purpose">
          {(['sale', 'rent', 'investment'] as const).map(k => (
            <Chip key={k} active={purpose === k} onClick={() => setPurpose(k)} tone="coral">
              {k === 'sale' ? 'For Sale' : k === 'rent' ? 'For Rent' : 'Investment'}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="Price Range (USD)">
          <div className="flex items-center gap-2">
            <input type="text" value={minPrice ? minPrice.toLocaleString() : ''} placeholder="Min"
              onChange={e => setMinPrice(+e.target.value.replace(/[^0-9]/g, '') || 0)}
              className="flex-1 min-w-0 py-2 px-2.5 rounded-md border border-line text-3.25 font-sans text-ink outline-none" />
            <span className="text-dim text-xs">—</span>
            <input type="text" value={maxPrice < 3_000_000 ? maxPrice.toLocaleString() : ''} placeholder="Max"
              onChange={e => setMaxPrice(+e.target.value.replace(/[^0-9]/g, '') || 3_000_000)}
              className="flex-1 min-w-0 py-2 px-2.5 rounded-md border border-line text-3.25 font-sans text-ink outline-none" />
          </div>
          <input type="range" min={0} max={3_000_000} step={50_000} value={maxPrice}
            onChange={e => setMaxPrice(+e.target.value)}
            className="w-full mt-2 accent-coral" />
          <div className="flex justify-between text-[10.5px] text-dim">
            <span>$0</span><span>$3M+</span>
          </div>
        </FilterGroup>

        <FilterGroup label="Bedrooms">
          {['any', '1', '2', '3', '4', '5'].map(v => (
            <Chip key={v} active={beds === v} onClick={() => setBeds(v)}>{v === 'any' ? 'Any' : `${v}+`}</Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="Region">
          {ALL_REGIONS.map(r => {
            const key = r === 'Samaná' ? 'Las Terrenas' : r
            return (
              <Chip key={r} active={region === key} onClick={() => setRegion(region === key ? null : key)} tone="coral">
                {r}
              </Chip>
            )
          })}
        </FilterGroup>

        <FilterGroup label="Amenities">
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5">
            {ALL_AMENITIES.map(a => {
              const checked = amenities.has(a)
              return (
                <label key={a} className="flex items-center gap-1.75 text-[12.5px] text-ink2 cursor-pointer py-0.75">
                  <input type="checkbox" checked={checked} onChange={() => {
                    const n = new Set(amenities)
                    checked ? n.delete(a) : n.add(a)
                    setAmenities(n)
                  }} className="accent-coral w-3.5 h-3.5 shrink-0" />
                  <span>{a}</span>
                </label>
              )
            })}
          </div>
        </FilterGroup>

        <FilterGroup label="Investment Filters">
          {([
            ['roi6', 'ROI 6%+',  () => setMinROI(minROI === 6 ? 0 : 6),  minROI === 6],
            ['roi8', 'ROI 8%+',  () => setMinROI(minROI === 8 ? 0 : 8),  minROI === 8],
            ['conf', 'CONFOTUR', () => { const n = new Set(invFlags); n.has('CONFOTUR') ? n.delete('CONFOTUR') : n.add('CONFOTUR'); setInvFlags(n) }, invFlags.has('CONFOTUR')],
            ['mgd',  'Managed',  () => { const n = new Set(invFlags); n.has('Managed')  ? n.delete('Managed')  : n.add('Managed');  setInvFlags(n) }, invFlags.has('Managed')],
          ] as [string, string, () => void, boolean][]).map(([k, label, onClick, active]) => (
            <Chip key={k} active={active} onClick={onClick} tone="brand">{label}</Chip>
          ))}
        </FilterGroup>

        <div className="flex flex-col gap-2 mt-4.5 pt-3.5 border-t border-line-soft">
          <button onClick={clearAll}
            className="w-full py-2.5 px-3.5 rounded-lg bg-transparent text-dim border border-line font-sans text-3.25 font-semibold cursor-pointer">
            Clear all filters
          </button>
          <button
            className="w-full py-2.5 px-3.5 rounded-lg bg-coral text-white border-none font-sans text-3.25 font-semibold cursor-pointer">
            Apply ({results.length})
          </button>
        </div>
      </aside>

      {/* ===== CENTER: RESULTS ===== */}
      <main className="min-w-0">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-3.5">
          <h1 className="font-serif text-5 sm:text-6.5 font-semibold text-ink leading-[1.1] m-0">
            {results.length} properties{' '}
            <span className="text-dim text-3.25 sm:text-3.75 font-sans font-normal">
              {region ? `in ${region}` : 'across the DR'}
            </span>
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 font-sans text-3.25 font-semibold cursor-pointer py-2 px-3.5 rounded-full border border-line bg-paper text-ink"
            >
              <SlidersHorizontal size={14} />
              Filters
              {chips.length > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-coral text-white text-[10px] font-bold grid place-items-center">{chips.length}</span>
              )}
            </button>
            <span className="hidden sm:inline text-[12.5px] text-dim">Sort</span>
            <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
              className="font-sans text-3.25 py-2 px-3 rounded-full border border-line bg-paper text-ink cursor-pointer">
              <option value="new">Newest first</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="roi">Best ROI</option>
            </select>
            <div className="hidden sm:inline-flex border border-line rounded-md overflow-hidden bg-paper">
              {(['grid', 'list'] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`py-1.75 px-2.5 border-none cursor-pointer text-3.25 ${view === v ? 'bg-ink text-paper' : 'bg-transparent text-dim'}`}>
                  {v === 'grid' ? '▦' : '≡'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-4">
            {chips.map((chip, i) => (
              <div key={i} className="inline-flex items-center gap-1.75 py-1.25 pr-2.5 pl-3 rounded-full bg-ink text-paper text-xs font-semibold">
                {chip.label}
                <button onClick={chip.clear}
                  className="bg-white/20 text-paper border-none rounded-full w-4.5 h-4.5 grid place-items-center cursor-pointer text-xs leading-none">×</button>
              </div>
            ))}
            <button onClick={clearAll}
              className="bg-transparent border-none text-coral font-sans text-xs font-bold cursor-pointer py-1.25 px-2">
              Clear all
            </button>
          </div>
        )}

        {results.length === 0
          ? (
            <div className="p-15 text-center text-dim border border-dashed border-line rounded-2xl">
              No properties match these filters. Try widening your price range or clearing a region.
            </div>
          ) : (
            <div className={`grid gap-4.5 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {results.map(l => <PropertyCard key={l.id} l={l} go={go} onHover={setHovered} />)}
            </div>
          )}
      </main>

      {/* ===== RIGHT: MAP + INSIGHTS ===== */}
      <aside className="hidden lg:flex flex-col self-start sticky top-22.5 max-h-[calc(100vh-110px)] overflow-y-auto gap-3.5">

        <DRMap
          active={region}
          onPick={setRegion}
          counts={counts}
          hovered={hovered}
          listings={results}
          onSelect={(l) => go(`detail?id=${l.id}`)}
        />

        {insights && (
          <div className="bg-paper border border-line-soft rounded-2xl py-4 px-4.5">
            <div className="text-2.75 font-bold tracking-[.12em] uppercase text-dim mb-1">Market snapshot</div>
            <div className="text-[11.5px] text-dim mb-2.5 leading-[1.45]">
              {region ? `In ${region} · ` : 'Across all results · '}updated for current filters
            </div>
            <Insight label="Matching listings" value={insights.count} />
            {insights.median   > 0 && <Insight label="Median price"     value={fmtMedian(insights.median)} />}
            {insights.avgYield > 0 && <Insight label="Avg rental yield" value={`${insights.avgYield.toFixed(1)}%`} tone="brand" />}
          </div>
        )}

        {alsoLike.length > 0 && (
          <div className="bg-paper border border-line-soft rounded-2xl py-4 px-4.5">
            <div className="text-2.75 font-bold tracking-[.12em] uppercase text-dim mb-1">You might also like</div>
            <div className="text-[11.5px] text-dim mb-3 leading-[1.45]">Just outside your current filters</div>
            {alsoLike.map((l, i) => (
              <button key={l.id} onClick={() => go(`detail?id=${l.id}`)}
                className={`flex w-full gap-2.5 py-2.5 bg-transparent border-x-0 border-t-0 cursor-pointer text-left font-sans ${i < alsoLike.length - 1 ? 'border-b border-line-soft' : 'border-b-0'}`}>
                <div className="w-14 h-11 rounded-md shrink-0 overflow-hidden"
                  style={{ backgroundImage: `url(${l.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-ink truncate">{l.title}</div>
                  <div className="text-[10.5px] text-dim mt-px truncate">{l.region}</div>
                  <div className="text-[11.5px] font-bold text-coral mt-0.5">{fmt(l.price)}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Pinned CTA */}
        <div className="bg-ink text-paper rounded-2xl p-4.5 font-sans">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] shrink-0" />
            <span className="text-2.75 text-white/65 tracking-[.08em] uppercase font-bold">
              Local team online
            </span>
          </div>
          <div className="font-serif text-4.25 font-semibold leading-tight mb-1.5">
            Need help narrowing down?
          </div>
          <div className="text-[12.5px] text-white/70 leading-normal mb-3">
            Our local agents will short-list 3–5 properties that match your goals — usually within 24 hours.
          </div>
          <button onClick={() => go('contact')}
            className="w-full py-2.5 px-3.5 rounded-lg bg-coral text-white border-none font-sans text-3.25 font-semibold cursor-pointer">
            Talk to an agent
          </button>
        </div>

      </aside>
    </div>

    {/* ===== MOBILE FILTER DRAWER ===== */}
    {filtersOpen && (
      <div className="fixed inset-0 z-50 flex flex-col bg-paper lg:hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-line-soft shrink-0">
          <div className="font-serif text-4.5 font-bold text-ink">Filters / Filtros</div>
          <div className="flex items-center gap-2">
            {chips.length > 0 && (
              <span className="text-2.5 font-bold py-0.75 px-2 rounded-full bg-coral text-white">{chips.length}</span>
            )}
            <button onClick={() => setFiltersOpen(false)}
              className="p-1.5 bg-transparent border-none cursor-pointer text-ink flex items-center">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">

          <FilterGroup label="Property Type">
            {TYPES.map(t => <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>)}
          </FilterGroup>

          <FilterGroup label="Purpose">
            {(['sale', 'rent', 'investment'] as const).map(k => (
              <Chip key={k} active={purpose === k} onClick={() => setPurpose(k)} tone="coral">
                {k === 'sale' ? 'For Sale' : k === 'rent' ? 'For Rent' : 'Investment'}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label="Price Range (USD)">
            <div className="flex items-center gap-2">
              <input type="text" value={minPrice ? minPrice.toLocaleString() : ''} placeholder="Min"
                onChange={e => setMinPrice(+e.target.value.replace(/[^0-9]/g, '') || 0)}
                className="flex-1 min-w-0 py-2 px-2.5 rounded-md border border-line text-3.25 font-sans text-ink outline-none" />
              <span className="text-dim text-xs">—</span>
              <input type="text" value={maxPrice < 3_000_000 ? maxPrice.toLocaleString() : ''} placeholder="Max"
                onChange={e => setMaxPrice(+e.target.value.replace(/[^0-9]/g, '') || 3_000_000)}
                className="flex-1 min-w-0 py-2 px-2.5 rounded-md border border-line text-3.25 font-sans text-ink outline-none" />
            </div>
            <input type="range" min={0} max={3_000_000} step={50_000} value={maxPrice}
              onChange={e => setMaxPrice(+e.target.value)}
              className="w-full mt-2 accent-coral" />
            <div className="flex justify-between text-[10.5px] text-dim">
              <span>$0</span><span>$3M+</span>
            </div>
          </FilterGroup>

          <FilterGroup label="Bedrooms">
            {['any', '1', '2', '3', '4', '5'].map(v => (
              <Chip key={v} active={beds === v} onClick={() => setBeds(v)}>{v === 'any' ? 'Any' : `${v}+`}</Chip>
            ))}
          </FilterGroup>

          <FilterGroup label="Region">
            {ALL_REGIONS.map(r => {
              const key = r === 'Samaná' ? 'Las Terrenas' : r
              return (
                <Chip key={r} active={region === key} onClick={() => setRegion(region === key ? null : key)} tone="coral">
                  {r}
                </Chip>
              )
            })}
          </FilterGroup>

          <FilterGroup label="Amenities">
            <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5">
              {ALL_AMENITIES.map(a => {
                const checked = amenities.has(a)
                return (
                  <label key={a} className="flex items-center gap-1.75 text-[12.5px] text-ink2 cursor-pointer py-0.75">
                    <input type="checkbox" checked={checked} onChange={() => {
                      const n = new Set(amenities)
                      checked ? n.delete(a) : n.add(a)
                      setAmenities(n)
                    }} className="accent-coral w-3.5 h-3.5 shrink-0" />
                    <span>{a}</span>
                  </label>
                )
              })}
            </div>
          </FilterGroup>

          <FilterGroup label="Investment Filters">
            {([
              ['roi6', 'ROI 6%+',  () => setMinROI(minROI === 6 ? 0 : 6),  minROI === 6],
              ['roi8', 'ROI 8%+',  () => setMinROI(minROI === 8 ? 0 : 8),  minROI === 8],
              ['conf', 'CONFOTUR', () => { const n = new Set(invFlags); n.has('CONFOTUR') ? n.delete('CONFOTUR') : n.add('CONFOTUR'); setInvFlags(n) }, invFlags.has('CONFOTUR')],
              ['mgd',  'Managed',  () => { const n = new Set(invFlags); n.has('Managed')  ? n.delete('Managed')  : n.add('Managed');  setInvFlags(n) }, invFlags.has('Managed')],
            ] as [string, string, () => void, boolean][]).map(([k, label, onClick, active]) => (
              <Chip key={k} active={active} onClick={onClick} tone="brand">{label}</Chip>
            ))}
          </FilterGroup>

        </div>

        {/* Sticky bottom CTAs */}
        <div className="shrink-0 px-4 py-4 border-t border-line-soft flex flex-col gap-2.5">
          <button onClick={clearAll}
            className="w-full py-2.5 px-3.5 rounded-lg bg-transparent text-dim border border-line font-sans text-3.25 font-semibold cursor-pointer">
            Clear all filters
          </button>
          <button onClick={() => setFiltersOpen(false)}
            className="w-full py-2.5 px-3.5 rounded-lg bg-coral text-white border-none font-sans text-3.25 font-semibold cursor-pointer">
            Show {results.length} results
          </button>
        </div>

      </div>
    )}
    </>
  )
}
