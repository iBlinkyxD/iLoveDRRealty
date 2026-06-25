'use client'
import { useNav } from '../hooks/useNav'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useState, useMemo, useEffect, type ReactNode } from 'react'
import { BedDouble, Bath, Maximize2, MapPin, Heart, TrendingUp, SlidersHorizontal } from 'lucide-react'
import { fmt, type Listing } from '../data/listings'
import { fetchListings } from '../api/listings'
import { getMySavedIds, saveHome, unsaveHome } from '../api/savedHomes'
import { SearchFilterSidebar } from '../components/SearchFilterSidebar'
import { SearchMapSidebar } from '../components/SearchMapSidebar'
import { useTranslation } from 'react-i18next'

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

const titleCase = (s: string) =>
  s === s.toUpperCase() ? s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : s

function Tag({ children, tone = 'sand' }: { children: ReactNode; tone?: string }) {
  const cls = TONE_CLASSES[(tone as TagTone)] ?? TONE_CLASSES.sand
  return (
    <span className={`text-[10.5px] font-bold tracking-widest uppercase py-1 px-2.5 rounded-full ${cls}`}>
      {children}
    </span>
  )
}

function PropertyCard({ l, go, onHover, currency, dopRate, savedIds, onToggleSave }: {
  l: Listing
  go: (p: string) => void
  onHover?: (l: Listing | null) => void
  currency: 'USD' | 'DOP'
  dopRate: number
  savedIds: Set<string>
  onToggleSave: (id: string) => void
}) {
  const { t } = useTranslation('search')
  const [hot, setHot] = useState(false)
  const isSaved = savedIds.has(l.id)
  const discountedPrice = l.is_deal && l.deal_discount_value
    ? (l.deal_discount_type === 'fixed'
        ? l.price - l.deal_discount_value
        : Math.round(l.price * (1 - l.deal_discount_value / 100)))
    : null
  const effectivePrice = discountedPrice ?? l.price
  const dp = currency === 'DOP' ? Math.round(effectivePrice * dopRate) : null
  const displayPrice = dp != null
    ? dp >= 1_000_000 ? `RD$${(dp / 1_000_000).toFixed(1)}M` : `RD$${Math.round(dp / 1_000)}K`
    : `${fmt(effectivePrice)} USD`
  const origDp = currency === 'DOP' && discountedPrice ? Math.round(l.price * dopRate) : null
  const displayOrig = origDp != null
    ? origDp >= 1_000_000 ? `RD$${(origDp / 1_000_000).toFixed(1)}M` : `RD$${Math.round(origDp / 1_000)}K`
    : discountedPrice ? `${fmt(l.price)} USD` : null
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
          onClick={e => { e.stopPropagation(); onToggleSave(l.id) }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 grid place-items-center border-none cursor-pointer transition-colors ${isSaved ? 'text-coral' : 'text-ink/30 hover:text-coral'}`}
        >
          <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        {l.is_deal && l.deal_discount_value ? (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.25 bg-coral text-white py-1.25 px-2.5 rounded-md text-xs font-semibold font-sans">
            {l.deal_discount_type === 'fixed'
              ? t('discount.fixed', { amount: Number(l.deal_discount_value).toLocaleString() })
              : t('discount.percent', { amount: l.deal_discount_value })}
          </div>
        ) : l.roi > 0 ? (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.25 bg-ink/90 text-paper py-1.25 px-2.5 rounded-md text-xs font-semibold">
            <TrendingUp size={13} />{l.roi}{t('yield')}
          </div>
        ) : null}
      </div>
      <div className="pt-4 px-4.5 pb-4.5 font-sans">
        <div className="flex items-baseline gap-2">
          <div className="font-sans text-5.25 font-semibold text-ink">
            {displayPrice}
            {l.purpose === 'rent' && <span className="text-3.25 text-dim font-sans">{t('per_month')}</span>}
          </div>
          {displayOrig && (
            <div className="font-sans text-3.25 text-dim line-through">{displayOrig}</div>
          )}
        </div>
        <div className="text-3.75 font-semibold text-ink mt-1.5 mb-1 leading-[1.3]">{titleCase(l.title)}</div>
        <div className="flex items-center gap-1.25 text-dim text-[12.5px]">
          <MapPin size={13} />{l.region}
        </div>
        <div className="flex gap-4 mt-3.5 pt-3.25 border-t border-line-soft text-ink2 text-[12.5px]">
          {l.bd > 0 && <span className="flex items-center gap-1.25"><BedDouble size={15} />{l.bd} {t('card.bd')}</span>}
          {l.ba > 0 && <span className="flex items-center gap-1.25"><Bath size={15} />{l.ba} {t('card.ba')}</span>}
          <span className="flex items-center gap-1.25"><Maximize2 size={15} />{l.m2} m²</span>
        </div>
      </div>
    </div>
  )
}

export default function Search() {
  const go = useNav()
  const { t } = useTranslation('search')
  const searchParams = useSearchParams()
  const router   = useRouter()
  const pathname = usePathname()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading,  setLoading]  = useState(true)
  const [purpose,  setPurpose]  = useState<'sale' | 'rent' | 'investment'>(() => {
    const p = searchParams.get('purpose')
    return (p === 'rent' || p === 'investment') ? p : 'sale'
  })
  const [type,     setType]     = useState(() => searchParams.get('type') ?? 'All')
  const [minPrice, setMinPrice] = useState(() => {
    const v = searchParams.get('minPrice')
    return v ? Number(v) : 0
  })
  const [maxPrice, setMaxPrice] = useState(() => {
    const b = searchParams.get('budget')
    return b ? Number(b) : 3_000_000
  })
  const [beds,     setBeds]     = useState(() => searchParams.get('beds') ?? 'any')
  const [sort,     setSort]     = useState<'new' | 'low' | 'high' | 'roi'>(() => {
    const s = searchParams.get('sort')
    return (s === 'low' || s === 'high' || s === 'roi') ? s : 'new'
  })
  const [region,   setRegion]   = useState<string | null>(() => searchParams.get('location') ?? null)
  const [minROI,   setMinROI]   = useState(() => {
    const v = searchParams.get('roi')
    return v ? Number(v) : 0
  })
  const [amenities,   setAmenities]   = useState(new Set<string>())
  const [invFlags,    setInvFlags]    = useState(new Set<string>())
  const [hovered,     setHovered]     = useState<Listing | null>(null)
  const [view,        setView]        = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currency,    setCurrency]    = useState<'USD' | 'DOP'>('DOP')
  const [dopRate,     setDopRate]     = useState(59.5)
  const [savedIds,    setSavedIds]    = useState<Set<string>>(new Set())
  const [isLoggedIn,  setIsLoggedIn]  = useState(false)

  useEffect(() => {
    fetchListings()
      .then(setListings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => { if (d.rates?.DOP) setDopRate(d.rates.DOP) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    getMySavedIds()
      .then(ids => { setSavedIds(new Set(ids)); setIsLoggedIn(true) })
      .catch(() => {})
  }, [])

  const handleToggleSave = async (id: string) => {
    if (!isLoggedIn) { go('login'); return }
    const wasSaved = savedIds.has(id)
    setSavedIds(prev => { const n = new Set(prev); wasSaved ? n.delete(id) : n.add(id); return n })
    try {
      await (wasSaved ? unsaveHome(id) : saveHome(id))
    } catch {
      setSavedIds(prev => { const n = new Set(prev); wasSaved ? n.add(id) : n.delete(id); return n })
    }
  }

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [filtersOpen])

  useEffect(() => {
    const params = new URLSearchParams()
    if (purpose !== 'sale')        params.set('purpose',  purpose)
    if (type    !== 'All')         params.set('type',     type)
    if (region)                    params.set('location', region)
    if (minPrice > 0)              params.set('minPrice', String(minPrice))
    if (maxPrice < 3_000_000)      params.set('budget',   String(maxPrice))
    if (beds    !== 'any')         params.set('beds',     beds)
    if (sort    !== 'new')         params.set('sort',     sort)
    if (minROI  > 0)               params.set('roi',      String(minROI))
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [purpose, type, region, minPrice, maxPrice, beds, sort, minROI, pathname, router])

  const allAmenities = useMemo(() => {
    const seen = new Set<string>()
    listings.forEach(l => l.features.forEach(f => seen.add(f)))
    return [...seen].sort()
  }, [listings])

  const results = useMemo(() => {
    let r = listings.filter(l =>
      (purpose === 'sale' || l.purpose === purpose || (purpose === 'investment' && l.roi >= 7)) &&
      (type === 'All' || l.type === type) &&
      (!region || regionOf(l) === region) &&
      l.roi >= minROI &&
      (beds === 'any' || l.bd >= +beds) &&
      (l.purpose === 'rent' || (l.price >= minPrice && l.price <= maxPrice)) &&
      (amenities.size === 0 || [...amenities].every(a => l.features.includes(a)))
    )
    if (sort === 'new')  r = [...r].sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
    if (sort === 'low')  r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'high') r = [...r].sort((a, b) => b.price - a.price)
    if (sort === 'roi')  r = [...r].sort((a, b) => b.roi   - a.roi)
    return r
  }, [listings, purpose, type, minPrice, maxPrice, sort, region, minROI, beds, amenities])

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
    const ids  = new Set(results.map(l => l.id))
    const rest = listings.filter(l => !ids.has(l.id))
    if (region) {
      const nearby = rest.filter(l => regionOf(l) === region)
      return nearby.length ? nearby.slice(0, 3) : rest.slice(0, 3)
    }
    return rest.slice(0, 3)
  }, [listings, results, region])

  const chips: { label: string; clear: () => void }[] = []
  if (purpose !== 'sale') chips.push({ label: purpose === 'rent' ? t('chips.rent') : t('chips.investment'), clear: () => setPurpose('sale') })
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

  const filterProps = {
    type, purpose, minPrice, maxPrice, beds, region, minROI, amenities, invFlags,
    setType, setPurpose, setMinPrice, setMaxPrice, setBeds, setRegion, setMinROI, setAmenities, setInvFlags,
    allAmenities, chips, resultsCount: results.length, clearAll,
  }

  return (
    <>
    <div className="max-w-380 mx-auto pt-4 sm:pt-6 px-4 sm:px-6 pb-17.5 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px] gap-5.5 font-sans items-start">

      <SearchFilterSidebar {...filterProps} />

      {/* ===== CENTER: RESULTS ===== */}
      <main className="min-w-0">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-3.5">
          <h1 className="font-sans text-5 sm:text-6.5 font-semibold text-ink leading-[1.1] m-0">
            {t('results_count', { count: results.length })}{' '}
            <span className="text-dim text-3.25 sm:text-3.75 font-sans font-normal">
              {region ? t('location_in', { region }) : t('location_across')}
            </span>
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 font-sans text-3.25 font-semibold cursor-pointer py-2 px-3.5 rounded-full border border-line bg-paper text-ink"
            >
              <SlidersHorizontal size={14} />
              {t('filters')}
              {chips.length > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-coral text-white text-[10px] font-bold grid place-items-center">{chips.length}</span>
              )}
            </button>
            <span className="hidden sm:inline text-[12.5px] text-dim">{t('sort_label')}</span>
            <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
              className="font-sans text-3.25 py-2 px-3 rounded-full border border-line bg-paper text-ink cursor-pointer">
              <option value="new">{t('sort.new')}</option>
              <option value="low">{t('sort.low')}</option>
              <option value="high">{t('sort.high')}</option>
              <option value="roi">{t('sort.roi')}</option>
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
              {t('clear_all')}
            </button>
          </div>
        )}

        {loading ? (
          <div className={`grid gap-4.5 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-paper rounded-xl overflow-hidden border border-line-soft animate-pulse">
                <div className="h-46 bg-line-soft" />
                <div className="p-4.5 space-y-3">
                  <div className="h-5 bg-line-soft rounded w-2/5" />
                  <div className="h-4 bg-line-soft rounded w-3/4" />
                  <div className="h-3.5 bg-line-soft rounded w-1/3" />
                  <div className="h-px bg-line-soft" />
                  <div className="flex gap-4">
                    <div className="h-3.5 bg-line-soft rounded w-12" />
                    <div className="h-3.5 bg-line-soft rounded w-12" />
                    <div className="h-3.5 bg-line-soft rounded w-14" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="p-15 text-center text-dim border border-dashed border-line rounded-2xl">
            {t('empty')}
          </div>
        ) : (
          <div className={`grid gap-4.5 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {results.map(l => <PropertyCard key={l.id} l={l} go={go} onHover={setHovered} currency={currency} dopRate={dopRate} savedIds={savedIds} onToggleSave={handleToggleSave} />)}
          </div>
        )}
      </main>

      <SearchMapSidebar
        hovered={hovered}
        results={results}
        alsoLike={alsoLike}
        insights={insights}
        currency={currency}
        dopRate={dopRate}
        region={region}
        onCurrencyChange={setCurrency}
        onSelect={l => go(`detail?id=${l.id}`)}
        go={go}
      />

    </div>

    {filtersOpen && (
      <SearchFilterSidebar {...filterProps} mobile onClose={() => setFiltersOpen(false)} />
    )}
    </>
  )
}
