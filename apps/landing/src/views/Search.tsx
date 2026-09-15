'use client'
import { useNav } from '../hooks/useNav'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useState, useEffect, type ReactNode } from 'react'
import { BedDouble, Bath, Maximize2, MapPin, Heart, TrendingUp, SlidersHorizontal } from 'lucide-react'
import { fmt, fmtDOP, type Listing } from '../data/listings'
import { fetchListings } from '../api/listings'
import { supabaseImgUrl } from '../api/imgUrl'
import { getMySavedIds, saveHome, unsaveHome } from '../api/savedHomes'
import { SearchFilterSidebar } from '../components/SearchFilterSidebar'
import { SearchMapSidebar } from '../components/SearchMapSidebar'
import { PRICE_MAX, FEATURES } from '../data/searchData'
import { useTranslation } from 'react-i18next'

type TagTone = 'sand' | 'coral' | 'sea' | 'gold' | 'green'
const TONE_CLASSES: Record<TagTone, string> = {
  sand:  'bg-ink/80 text-white border border-white/20',
  coral: 'bg-coral text-white border border-coral',
  sea:   'bg-sea text-white border border-sea',
  gold:  'bg-gold text-[#3d2800] border border-gold',
  green: 'bg-[#1f7a3d] text-white border border-[#1f7a3d]',
}

function pageWindow(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b)
  const out: (number | '…')[] = []
  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }
  return out
}

function PaginationBar({
  page, totalPages, border, onPrev, onNext, onSetPage,
}: {
  page: number; totalPages: number; border: 'border-b' | 'border-t'
  onPrev: () => void; onNext: () => void; onSetPage: (p: number) => void
}) {
  const { t } = useTranslation('search')
  if (totalPages <= 1) return null
  return (
    <div className={`flex items-center justify-center gap-1.5 py-4 flex-wrap ${border} border-line-soft`}>
      <button
        disabled={page <= 1}
        onClick={() => { onPrev(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        className="py-2 px-3.5 rounded-full border border-line bg-paper text-ink text-3.25 font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('pagination.prev')}
      </button>
      {pageWindow(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-1 text-dim text-3.25">…</span>
        ) : (
          <button
            key={p}
            onClick={() => { onSetPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className={`w-9 h-9 rounded-full text-3.25 font-semibold cursor-pointer ${p === page ? 'bg-ink text-paper' : 'bg-paper border border-line text-ink'}`}
          >
            {p}
          </button>
        )
      )}
      <button
        disabled={page >= totalPages}
        onClick={() => { onNext(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        className="py-2 px-3.5 rounded-full border border-line bg-paper text-ink text-3.25 font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('pagination.next')}
      </button>
    </div>
  )
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
  const displayPrice = dp != null ? fmtDOP(dp) : `${fmt(effectivePrice)} USD`
  const origDp = currency === 'DOP' && discountedPrice ? Math.round(l.price * dopRate) : null
  const displayOrig = origDp != null ? fmtDOP(origDp) : discountedPrice ? `${fmt(l.price)} USD` : null
  return (
    <div
      onMouseEnter={() => { setHot(true); onHover?.(l) }}
      onMouseLeave={() => { setHot(false); onHover?.(null) }}
      onClick={() => go(`detail?id=${l.id}`)}
      className={`bg-paper rounded-xl overflow-hidden cursor-pointer transition-all duration-250 border ${hot ? 'border-line -translate-y-1 shadow-[0_22px_50px_-28px_rgba(0,16,46,.4)]' : 'border-line-soft shadow-[0_1px_0_rgba(0,16,46,.03)]'}`}
    >
      <div className="relative h-46" style={{ backgroundImage: `url(${supabaseImgUrl(l.img, 600)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
          {l.m2 > 0 && <span className="flex items-center gap-1.25"><Maximize2 size={15} />{l.m2} m²</span>}
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
  const PAGE_SIZE = 24
  const [listings,    setListings]    = useState<Listing[]>([])
  const [total,       setTotal]       = useState(0)
  const [medianPrice, setMedianPrice] = useState<number | null>(null)
  const [avgRoi,      setAvgRoi]      = useState<number | null>(null)
  const [alsoLike,    setAlsoLike]    = useState<Listing[]>([])
  const [loading,     setLoading]     = useState(true)
  const [page,        setPage]        = useState(() => {
    const p = searchParams.get('page')
    return p ? Math.max(1, Number(p)) : 1
  })
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
    return b ? Number(b) : PRICE_MAX
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

  // Price/ROI sliders fire on every drag pixel — debounce them before they
  // trigger a server refetch. Discrete filters (purpose, type, region, beds,
  // sort, amenity toggles) refetch immediately.
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(minPrice)
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(maxPrice)
  const [debouncedMinROI,   setDebouncedMinROI]   = useState(minROI)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMinPrice(minPrice)
      setDebouncedMaxPrice(maxPrice)
      setDebouncedMinROI(minROI)
    }, 350)
    return () => clearTimeout(timer)
  }, [minPrice, maxPrice, minROI])

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
    if (maxPrice < PRICE_MAX)      params.set('budget',   String(maxPrice))
    if (beds    !== 'any')         params.set('beds',     beds)
    if (sort    !== 'new')         params.set('sort',     sort)
    if (minROI  > 0)               params.set('roi',      String(minROI))
    if (page    > 1)               params.set('page',     String(page))
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [purpose, type, region, minPrice, maxPrice, beds, sort, minROI, page, pathname, router])

  // Any filter change resets to page 1. `page` is deliberately excluded from
  // this effect's own deps — only filter changes should trigger the reset.
  useEffect(() => {
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purpose, type, region, debouncedMinPrice, debouncedMaxPrice, beds, debouncedMinROI, sort, amenities])

  useEffect(() => {
    setLoading(true)
    fetchListings({
      page,
      pageSize: PAGE_SIZE,
      purpose: purpose === 'sale' ? undefined : purpose,
      type: type === 'All' ? undefined : type,
      region: region ?? undefined,
      minPrice: debouncedMinPrice > 0 ? debouncedMinPrice : undefined,
      maxPrice: debouncedMaxPrice < PRICE_MAX ? debouncedMaxPrice : undefined,
      beds: beds === 'any' ? undefined : Number(beds),
      minRoi: debouncedMinROI > 0 ? debouncedMinROI : undefined,
      features: amenities.size > 0 ? [...amenities] : undefined,
      sort,
    })
      .then(res => {
        setListings(res.items)
        setTotal(res.total)
        setMedianPrice(res.medianPrice)
        setAvgRoi(res.avgRoi)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, purpose, type, region, debouncedMinPrice, debouncedMaxPrice, beds, debouncedMinROI, amenities, sort])

  // "You might also like": a handful of nearby suggestions outside the current
  // page's results — falls back to non-regional suggestions if none are nearby.
  useEffect(() => {
    const ids = listings.map(l => l.id)
    if (!ids.length) { setAlsoLike([]); return }
    let cancelled = false
    const tryFetch = (withRegion: boolean) =>
      fetchListings({ region: withRegion ? (region ?? undefined) : undefined, excludeIds: ids, pageSize: 3, includeAggregates: false })
    ;(region ? tryFetch(true) : tryFetch(false))
      .then(res => (region && res.items.length === 0) ? tryFetch(false) : res)
      .then(res => { if (!cancelled) setAlsoLike(res.items) })
      .catch(() => { if (!cancelled) setAlsoLike([]) })
    return () => { cancelled = true }
  }, [listings, region])

  const insights = total > 0 ? { count: total, median: medianPrice ?? 0, avgYield: avgRoi ?? 0 } : null
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const chips: { label: string; clear: () => void }[] = []
  if (purpose !== 'sale') chips.push({ label: purpose === 'rent' ? t('chips.rent') : t('chips.investment'), clear: () => setPurpose('sale') })
  if (type !== 'All')     chips.push({ label: type, clear: () => setType('All') })
  if (beds !== 'any')     chips.push({ label: t('chip_beds', { beds }), clear: () => setBeds('any') })
  if (region)             chips.push({ label: region, clear: () => setRegion(null) })
  if (minROI > 0)         chips.push({ label: t('chip_roi', { roi: minROI }), clear: () => setMinROI(0) })
  amenities.forEach(a => chips.push({ label: a, clear: () => { const n = new Set(amenities); n.delete(a); setAmenities(n) } }))
  invFlags.forEach(f  => chips.push({ label: f, clear: () => { const n = new Set(invFlags);  n.delete(f); setInvFlags(n)  } }))
  if (minPrice > 0 || maxPrice < PRICE_MAX)
    chips.push({ label: `${fmt(minPrice)} – ${fmt(maxPrice)}`, clear: () => { setMinPrice(0); setMaxPrice(PRICE_MAX) } })

  const clearAll = () => {
    setPurpose('sale'); setType('All'); setMinPrice(0); setMaxPrice(PRICE_MAX)
    setBeds('any'); setRegion(null); setMinROI(0); setAmenities(new Set()); setInvFlags(new Set())
  }

  const filterProps = {
    type, purpose, minPrice, maxPrice, beds, region, minROI, amenities, invFlags,
    setType, setPurpose, setMinPrice, setMaxPrice, setBeds, setRegion, setMinROI, setAmenities, setInvFlags,
    allAmenities: FEATURES, chips, resultsCount: total, clearAll,
  }

  return (
    <>
    <div className="max-w-380 mx-auto pt-4 sm:pt-6 px-4 sm:px-6 pb-17.5 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px] gap-5.5 font-sans items-start">

      <SearchFilterSidebar {...filterProps} />

      {/* ===== CENTER: RESULTS ===== */}
      <main className="min-w-0">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-3.5">
          <h1 className="font-sans text-5 sm:text-6.5 font-semibold text-ink leading-[1.1] m-0">
            {t('results_count', { count: total })}{' '}
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
        ) : listings.length === 0 ? (
          <div className="p-15 text-center text-dim border border-dashed border-line rounded-2xl">
            {t('empty')}
          </div>
        ) : (
          <>
            <PaginationBar
              page={page} totalPages={totalPages} border="border-b"
              onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} onSetPage={setPage}
            />
            <div className={`grid gap-4.5 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {listings.map(l => <PropertyCard key={l.id} l={l} go={go} onHover={setHovered} currency={currency} dopRate={dopRate} savedIds={savedIds} onToggleSave={handleToggleSave} />)}
            </div>
            <PaginationBar
              page={page} totalPages={totalPages} border="border-t"
              onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} onSetPage={setPage}
            />
          </>
        )}
      </main>

      <SearchMapSidebar
        hovered={hovered}
        results={listings}
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
