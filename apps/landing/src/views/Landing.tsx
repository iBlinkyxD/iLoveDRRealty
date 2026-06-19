'use client'
import { useNav } from '../hooks/useNav'
import { useState, useEffect } from 'react'
import { Search, Check, ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { STATS, MISTAKES, ROLES } from '../data/landingData'
import { fetchListings, fetchDealListings } from '../api/listings'
import type { ApiDealListing } from '../api/listings'
import type { Listing } from '../data/listings'

type GoFn = (page: string, slug?: string, params?: Record<string, string>) => void

function CurrencyToggle({ currency, onChange }: { currency: 'USD' | 'DOP'; onChange: (c: 'USD' | 'DOP') => void }) {
  return (
    <div className="flex rounded-lg border border-line overflow-hidden text-[11px] font-bold shrink-0">
      {(['DOP', 'USD'] as const).map(c => (
        <button key={c} type="button" onClick={() => onChange(c)}
          className="px-2.5 py-1 transition-colors cursor-pointer"
          style={{ background: currency === c ? '#00102e' : 'white', color: currency === c ? 'white' : '#64748b' }}>
          {c}
        </button>
      ))}
    </div>
  )
}

function PropertyCard({ prop, go, currency, dopRate }: { prop: Listing; go: GoFn; currency: 'USD' | 'DOP'; dopRate: number }) {
  const fmtP = (n: number) => n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : `$${(n / 1e3).toFixed(0)}K`
  const fmtDOP = (n: number) => n >= 1_000_000 ? `RD$${(n / 1_000_000).toFixed(1)}M` : `RD$${Math.round(n / 1_000)}K`
  const tag = prop.tags?.[0]?.[0] ?? ''
  const discountedPrice = prop.is_deal && prop.deal_discount_value
    ? (prop.deal_discount_type === 'fixed'
        ? prop.price - prop.deal_discount_value
        : Math.round(prop.price * (1 - prop.deal_discount_value / 100)))
    : null
  const effectivePrice = discountedPrice ?? prop.price
  const displayPrice = currency === 'DOP' ? fmtDOP(Math.round(effectivePrice * dopRate)) : fmtP(effectivePrice)
  const displayOrig = discountedPrice
    ? (currency === 'DOP' ? fmtDOP(Math.round(prop.price * dopRate)) : fmtP(prop.price))
    : null
  return (
    <div
      onClick={() => go('detail', undefined, { id: String(prop.id) })}
      className="bg-paper rounded-2xl border border-line-soft overflow-hidden cursor-pointer"
    >
      <div className="h-45 relative bg-ink" style={{ backgroundImage: `url(${prop.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {tag && (
          <span className="absolute top-3 left-3 text-2.75 font-bold tracking-[.04em] bg-black/35 text-white px-2.25 py-0.75 rounded-md font-sans">
            {tag}
          </span>
        )}
        {prop.is_deal && prop.deal_discount_value ? (
          <span className="absolute top-3 right-3 text-2.75 font-bold bg-coral text-white px-2.25 py-0.75 rounded-md font-sans">
            {prop.deal_discount_type === 'fixed'
              ? currency === 'DOP'
                ? `−${fmtDOP(Math.round(prop.deal_discount_value * dopRate))} off`
                : `−$${Number(prop.deal_discount_value).toLocaleString()} off`
              : `−${prop.deal_discount_value}% off`}
          </span>
        ) : prop.roi > 0 ? (
          <span className="absolute top-3 right-3 text-2.75 font-bold bg-amber-600 text-white px-2.25 py-0.75 rounded-md font-sans">
            {prop.roi}% ROI
          </span>
        ) : null}
      </div>
      <div className="pt-4 px-4.5 pb-4.5">
        <div className="font-sans text-2.75 text-dim mb-1 flex items-center gap-1"><MapPin size={11} /> {prop.region}</div>
        <div className="font-sans text-4.25 font-semibold text-ink leading-tight mb-2.5">
          {prop.title}
        </div>
        <div className="flex gap-3.5 text-3 text-dim font-sans mb-3">
          {prop.bd > 0 && <span>{prop.bd} bd</span>}
          {prop.ba > 0 && <span>{prop.ba} ba</span>}
          {prop.m2 > 0 && <span>{prop.m2} m²</span>}
        </div>
        <div className="flex items-baseline gap-2">
          <div className="font-sans text-5.5 font-bold text-ink">
            {displayPrice}{currency === 'USD' && <span className="font-sans text-3 text-dim font-normal ml-1">USD</span>}
          </div>
          {displayOrig && (
            <div className="font-sans text-3.5 text-dim line-through">
              {displayOrig}{currency === 'USD' && <span className="font-normal ml-0.5">USD</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Landing() {
  const go = useNav()
  const [hLoc,    setHLoc]    = useState('')
  const [hType,   setHType]   = useState('All')
  const [hBudget, setHBudget] = useState('')
  const [featured,  setFeatured]  = useState<Listing[]>([])
  const [deals,       setDeals]       = useState<ApiDealListing[]>([])
  const [dealIdx,     setDealIdx]     = useState(0)
  const [dealHovered, setDealHovered] = useState(false)
  const [currency,  setCurrency]  = useState<'USD' | 'DOP'>('DOP')
  const [dopRate,   setDopRate]   = useState(59.5)

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => { if (d.rates?.DOP) setDopRate(d.rates.DOP) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchListings().then(all => {
      const shuffled = [...all]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      setFeatured(shuffled.slice(0, 4))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    fetchDealListings().then(setDeals).catch(() => {})
  }, [])

  useEffect(() => {
    if (deals.length < 2 || dealHovered) return
    const t = setInterval(() => setDealIdx(i => (i + 1) % deals.length), 5000)
    return () => clearInterval(t)
  }, [deals.length, dealHovered])

  return (
    <div className="bg-paper">

      {/* ─────────────────────── Hero ─────────────────────── */}
      <div className="relative overflow-hidden bg-ink"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative z-10 max-w-335 w-full mx-auto px-4 sm:px-7 py-16 sm:py-20 lg:py-0 lg:min-h-145 lg:flex lg:items-center">
          <div className="w-full grid gap-10 items-center grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left */}
            <div>
              <div className="text-2.75 font-bold tracking-[.18em] uppercase text-gold font-sans">
                Discover · Invest · Live
              </div>
              <h1 className="font-sans text-[clamp(34px,5vw,64px)] font-semibold text-white leading-[1.03] tracking-[-0.02em] mt-4 max-w-155">
                Discover, Invest, and Live in Paradise.
              </h1>
              <p className="text-[rgba(247,244,236,0.78)] text-4.25 leading-[1.6] max-w-130 mt-4.5 font-sans">
                The Dominican Republic's real estate ecosystem — luxury properties, investing tools, and AI-powered guidance — in one trusted platform.
              </p>

              {/* Search bar */}
              <div className="mt-7 bg-white rounded-2xl p-2 flex flex-wrap gap-1.5 w-full max-w-160 items-stretch shadow-[rgba(0,0,0,0.4)_0px_20px_50px_-20px]">
                <div className="flex-[1_1_150px] px-3 py-1.5 sm:border-r border-line">
                  <div className="text-2.5 font-bold tracking-widest uppercase text-dim">Location</div>
                  <select value={hLoc} onChange={e => setHLoc(e.target.value)} className="border-none bg-transparent font-sans text-sm text-ink cursor-pointer w-full mt-0.5 outline-none">
                    <option value="">Anywhere</option>
                    {['Cap Cana', 'Cabarete', 'Jarabacoa', 'Las Terrenas', 'Punta Cana', 'Puerto Plata', 'Samaná', 'Santo Domingo', 'Santiago', 'Sosúa'].map(r =>
                      <option key={r} value={r}>{r}</option>
                    )}
                  </select>
                </div>
                <div className="flex-[1_1_130px] px-3 py-1.5 sm:border-r border-line">
                  <div className="text-2.5 font-bold tracking-widest uppercase text-dim">Type</div>
                  <select value={hType} onChange={e => setHType(e.target.value)} className="border-none bg-transparent font-sans text-sm text-ink cursor-pointer w-full mt-0.5 outline-none">
                    {['All', 'Villa', 'Apartment', 'Condo', 'Land', 'Commercial'].map(t =>
                      <option key={t} value={t}>{t === 'All' ? 'All properties' : t}</option>
                    )}
                  </select>
                </div>
                <div className="flex-[1_1_120px] px-3 py-1.5 sm:border-r border-line">
                  <div className="text-2.5 font-bold tracking-widest uppercase text-dim">Budget</div>
                  <select value={hBudget} onChange={e => setHBudget(e.target.value)} className="border-none bg-transparent font-sans text-sm text-ink cursor-pointer w-full mt-0.5 outline-none">
                    <option value="">Any price</option>
                    <option value="500000">Under $500K</option>
                    <option value="1000000">Under $1M</option>
                    <option value="3000000">Under $3M</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    const params: Record<string, string> = {}
                    if (hLoc) params.location = hLoc
                    if (hType && hType !== 'All') params.type = hType
                    if (hBudget) params.budget = hBudget
                    go('search', undefined, params)
                  }}
                  className="font-sans text-sm font-semibold cursor-pointer px-6 py-3 sm:py-0 rounded-full w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 border border-coral bg-coral text-white"
                >
                  <Search size={17} /> Search
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex gap-4.5 flex-wrap mt-5.5">
                {[
                  ['🛡', 'Admin-verified listings'],
                  ['🌐', 'English & Spanish'],
                  ['⚡', 'Live ROI analysis'],
                  ['💬', 'WhatsApp concierge'],
                ].map(([icon, label]) => (
                  <span key={String(label)} className="flex items-center gap-1.75 text-[rgba(247,244,236,0.72)] text-[12.5px] font-sans">
                    {icon} {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — property photos */}
            <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-3 h-100">
              {/* Large left — luxury villa */}
              <div className="row-span-2 rounded-3xl overflow-hidden relative shadow-[rgba(0,0,0,0.5)_0px_20px_50px_-20px]"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent" />
                <div className="absolute bottom-3.5 left-3.5 right-3.5">
                  <div className="text-white text-2.75 font-bold font-sans tracking-[.04em]">📍 Cap Cana</div>
                  <div className="text-white/70 text-2.5 font-sans mt-0.5">Luxury villa · 4BD · $1.2M</div>
                </div>
              </div>
              {/* Top right — pool view */}
              <div className="rounded-3xl overflow-hidden relative shadow-[rgba(0,0,0,0.5)_0px_20px_50px_-20px]"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-linear-to-t from-ink/50 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3">
                  <div className="text-white text-2.5 font-bold font-sans">📍 Punta Cana</div>
                </div>
              </div>
              {/* Bottom right — beachfront */}
              <div className="rounded-3xl overflow-hidden relative shadow-[rgba(0,0,0,0.5)_0px_20px_50px_-20px]"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-linear-to-t from-ink/50 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3">
                  <div className="text-white text-2.5 font-bold font-sans">📍 Las Terrenas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────── Stats strip ─────────────────────── */}
      <div className="bg-ink border-t border-[rgba(246,241,231,.08)]">
        <div className="max-w-310 mx-auto px-4 sm:px-6 py-6.5 grid grid-cols-2 sm:flex sm:flex-wrap gap-6 sm:justify-between">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="font-sans text-7.5 font-semibold text-white">{value}</div>
              <div className="font-sans text-3 text-[rgba(246,241,231,0.55)] tracking-[0.04em] mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────── Deal of the Week ─────────────────────── */}
      {deals.length > 0 && (() => {
        const deal = deals[dealIdx]
        return (
          <div
            className="bg-paper pt-14 sm:pt-17.5 px-4 sm:px-6 pb-7.5"
            onMouseEnter={() => setDealHovered(true)}
            onMouseLeave={() => setDealHovered(false)}
          >
            <div className="max-w-310 mx-auto">
              <div className="flex items-center gap-3 mb-5.5 flex-wrap">
                <span className="inline-flex items-center gap-1.75 px-3.5 py-1.5 rounded-full bg-gold text-ink text-2.75 font-extrabold tracking-[0.14em] uppercase">
                  ★ Deal of the Week
                </span>
                <span className="font-sans text-3.25 text-dim">Handpicked by our team</span>
                <div className="ml-auto flex items-center gap-3">
                  {deals.length > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDealIdx(i => (i - 1 + deals.length) % deals.length)}
                        className="w-7 h-7 rounded-full flex items-center justify-center border border-line-soft bg-white hover:bg-line-soft transition-colors cursor-pointer"
                      >
                        <ChevronLeft size={14} className="text-dim" />
                      </button>
                      <div className="flex items-center gap-1.5">
                        {deals.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setDealIdx(i)}
                            className="rounded-full transition-all cursor-pointer border-0 p-0"
                            style={{
                              width: i === dealIdx ? 20 : 7,
                              height: 7,
                              background: i === dealIdx ? '#0d9488' : '#cbd5e1',
                            }}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setDealIdx(i => (i + 1) % deals.length)}
                        className="w-7 h-7 rounded-full flex items-center justify-center border border-line-soft bg-white hover:bg-line-soft transition-colors cursor-pointer"
                      >
                        <ChevronRight size={14} className="text-dim" />
                      </button>
                    </div>
                  )}
                  <CurrencyToggle currency={currency} onChange={setCurrency} />
                </div>
              </div>

              <div className="bg-paper border border-line-soft rounded-3xl overflow-hidden shadow-[rgba(0,16,46,0.3)_0px_30px_60px_-40px] grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
                {/* Left — property photo */}
                <div
                  className="relative h-64 lg:h-115 overflow-hidden bg-ink"
                  style={deal.images?.[0] ? { backgroundImage: `url(${deal.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                >
                  <div className="absolute top-4.5 left-4.5 flex flex-col gap-2">
                    {deal.deal_discount_value && (
                      <span className="bg-coral text-white text-2.75 font-extrabold tracking-[0.08em] uppercase px-2.75 py-1.25 rounded-full font-sans">
                        {deal.deal_discount_type === 'fixed'
                          ? currency === 'DOP'
                            ? `−RD$${Math.round(deal.deal_discount_value * dopRate).toLocaleString()} off`
                            : `−$${Number(deal.deal_discount_value).toLocaleString()} USD off`
                          : `−${deal.deal_discount_value}% off`}
                      </span>
                    )}
                    <span className="bg-ink/80 text-white text-[10.5px] font-bold px-2.75 py-1.25 rounded-full backdrop-blur-1.5 font-sans inline-flex items-center gap-1">
                      <MapPin size={10} /> {deal.location}
                    </span>
                  </div>
                  {deal.features?.length > 0 && (
                    <div className="absolute bottom-4.5 left-4.5 right-4.5 flex flex-wrap gap-1.5">
                      {deal.features.slice(0, 3).map(f => (
                        <span key={f} className="bg-white/95 text-ink text-2.75 font-bold px-2.5 py-1.25 rounded-full font-sans whitespace-nowrap">{f}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right — details */}
                <div className="px-5 py-6 sm:px-9 sm:py-8 flex flex-col">
                  <div className="font-sans text-3 font-bold tracking-[0.12em] uppercase text-coral mb-2">This week's pick</div>
                  <h2 className="font-sans text-7 font-bold text-ink leading-[1.15] mb-2">{deal.title}</h2>
                  {deal.description && (
                    <p className="font-sans text-[14.5px] text-ink2 leading-[1.65] mb-4.5 line-clamp-4">
                      {deal.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
                    </p>
                  )}
                  <div className="flex divide-x divide-line-soft py-4 border-t border-b border-line-soft mb-4.5">
                    {[
                      deal.bedrooms != null && [String(deal.bedrooms), 'Bedrooms'],
                      deal.bathrooms != null && [String(deal.bathrooms), 'Bathrooms'],
                      deal.area_sqft != null && [`${Math.round(deal.area_sqft / 10.764)} m²`, 'Total area'],
                    ].filter((x): x is [string, string] => Boolean(x)).map(([val, lbl]) => (
                      <div key={lbl} className="flex-1 pr-3 last:pr-0 first:pl-0 pl-3">
                        <div className="font-sans text-5 sm:text-5.5 font-bold text-ink">{val}</div>
                        <div className="font-sans text-[10px] sm:text-2.75 text-dim sm:tracking-[0.06em] uppercase mt-0.5 leading-tight">{lbl}</div>
                      </div>
                    ))}
                  </div>
                  {(() => {
                    const fmtDOP = (n: number) => n >= 1_000_000 ? `RD$${(n / 1_000_000).toFixed(1)}M` : `RD$${Math.round(n / 1_000)}K`
                    const fmtUSD = (n: number) => `$${Number(n).toLocaleString()}`
                    const effectivePrice = deal.deal_discount_value
                      ? (deal.deal_discount_type === 'fixed'
                          ? Math.round(deal.price - deal.deal_discount_value)
                          : Math.round(deal.price * (1 - deal.deal_discount_value / 100)))
                      : deal.price
                    const displayPrice = currency === 'DOP'
                      ? fmtDOP(Math.round(effectivePrice * dopRate))
                      : fmtUSD(effectivePrice)
                    const displayOrig = deal.deal_discount_value
                      ? (currency === 'DOP'
                          ? fmtDOP(Math.round(deal.price * dopRate))
                          : fmtUSD(deal.price))
                      : null
                    return (
                      <div className="mb-5">
                        <div className="flex items-baseline gap-3">
                          <div className="font-sans text-9.5 font-bold text-ink leading-none">
                            {displayPrice}{currency === 'USD' && <span className="font-sans text-4 text-dim font-normal ml-1.5">USD</span>}
                          </div>
                          {displayOrig && (
                            <div className="font-sans text-4 text-dim line-through">
                              {displayOrig}{currency === 'USD' && <span className="font-normal ml-1">USD</span>}
                            </div>
                          )}
                          {deal.deal_discount_value && (
                            <div className="font-sans text-3 text-brand font-bold px-2 py-0.75 bg-brand/10 rounded-full">
                              {deal.deal_discount_type === 'fixed'
                                ? currency === 'DOP'
                                  ? `−RD$${Math.round(deal.deal_discount_value * dopRate).toLocaleString()}`
                                  : `−$${Number(deal.deal_discount_value).toLocaleString()} USD`
                                : `−${deal.deal_discount_value}%`}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })()}
                  <div className="flex flex-col sm:flex-row gap-2.5 mt-auto">
                    <button onClick={() => go('detail', undefined, { id: String(deal.id) })} className="font-sans text-3.5 font-semibold cursor-pointer px-5.5 py-2.75 rounded-full inline-flex items-center justify-center gap-2 border border-coral bg-coral text-white">
                      View this property <ArrowRight size={16} />
                    </button>
                    <button onClick={() => go('calculator')} className="font-sans text-3.5 font-semibold cursor-pointer px-5.5 py-2.75 rounded-full inline-flex items-center justify-center gap-2 border border-ink bg-transparent text-ink">
                      Run ROI numbers
                    </button>
                  </div>
                </div>
              </div>

              <div className="font-sans text-3 text-dim mt-3.5 text-center leading-[1.55]">
                How we pick: each week our team selects one property where location, lifestyle, and price-per-m² genuinely stand out.{' '}
                <strong className="text-ink2">Owners and realtors can submit a property for consideration</strong> — our team reviews every submission for value and quality before featuring it.
              </div>
            </div>
          </div>
        )
      })()}

      {/* ─────────────────────── Founder Story ─────────────────────── */}
      <div className="bg-paper2 py-14 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-295 mx-auto relative">
          {/* 2-col: photo collage left, story right */}
          <div className="grid gap-10 lg:gap-15 items-center grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            {/* Left — photo collage */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_70px_-30px_rgba(0,16,46,.4)]">
                <div className="h-64 sm:h-80 lg:h-95 bg-ink" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="absolute inset-0 bg-ink/40" />
                <div className="absolute bottom-4 left-4.5 text-paper text-2.75 tracking-[.12em] uppercase font-bold font-sans">
                  The Founders · Las Terrenas, 2019
                </div>
              </div>
              <div className="hidden lg:block absolute -bottom-5 -right-5 w-50 h-37.5 rounded-xl overflow-hidden border-4 border-paper shadow-[0_20px_40px_-20px_rgba(0,16,46,.4)]">
                <div className="h-37.5 bg-ink" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
              </div>
              <div className="absolute top-4 left-4 lg:-left-5 bg-coral text-white px-4 py-2.5 rounded-full text-3 font-bold shadow-[0_12px_30px_-12px_rgba(225,15,31,.5)] flex items-center gap-2 font-sans">
                <span className="text-3.5">🇺🇸 → 🇩🇴</span> Made the move in 2019
              </div>
            </div>

            {/* Right — story */}
            <div>
              <div className="font-sans text-2.75 font-bold tracking-[.18em] uppercase text-coral">★ Why we built this</div>
              <h2 className="font-sans text-[clamp(28px,3.4vw,42px)] font-semibold text-ink leading-[1.1] tracking-[-0.02em] mt-3 mb-5.5">
                We were once where{' '}
                <span className="text-coral italic">you are now.</span>
              </h2>
              <div className="font-sans text-[15.5px] text-ink2 leading-[1.7] mb-4.5">
                We're Americans who moved to the Dominican Republic for the same reasons most of you are considering it — the climate, the cost of living, the pace, the long-term opportunity, and a Caribbean lifestyle that doesn't require a passport stamp every six months.
              </div>
              <div className="font-sans text-[15.5px] text-ink2 leading-[1.7] mb-4.5">
                Like most expats, we thought we'd done our homework. We hadn't. We{' '}
                <strong className="text-ink">overpaid on our first property</strong>, because the listing price in the DR isn't really the price. We{' '}
                <strong className="text-ink">lost a deposit on a deal that never closed</strong>, because nobody told us what to check before wiring funds. We hired the wrong attorney, took the wrong recommendations, and learned — slowly and expensively — that the DR rewards people who know the local rules and punishes everyone else.
              </div>
              <div className="font-sans text-[15.5px] text-ink2 leading-[1.7] mb-5.5">
                That's why I♥DR Realty exists. We built the platform we wished we'd had when we started: verified listings, transparent pricing, a bilingual team that's lived through the process, and the practical answers that don't appear in any guidebook.
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => go('buying')}
                  className="font-sans text-3.5 font-semibold cursor-pointer px-6 py-3 rounded-full bg-coral text-white border border-coral inline-flex items-center gap-2"
                >
                  Start the buying guide <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => go('team')}
                  className="font-sans text-3.5 font-semibold cursor-pointer px-6 py-3 rounded-full bg-transparent text-ink border border-line inline-flex items-center gap-2"
                >
                  Meet the team
                </button>
              </div>
            </div>
          </div>

          {/* Lessons we learned */}
          <div className="mt-20">
            <div className="text-center max-w-160 mx-auto mb-10">
              <div className="font-sans text-2.75 font-bold tracking-[.18em] uppercase text-gold">★ Lessons we paid for, so you don't have to</div>
              <h3 className="font-sans text-[clamp(24px,2.6vw,32px)] font-semibold text-ink leading-[1.15] tracking-[-0.01em] mt-3">
                Six mistakes we made — and how we help you skip them
              </h3>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4.5">
              {MISTAKES.map((it, i) => (
                <div key={i} className="bg-paper border border-line-soft rounded-2xl pt-5.5 px-5.5 pb-5 shadow-[0_6px_18px_-12px_rgba(0,16,46,.12)]">
                  <div
                    className="w-11 h-11 rounded-xl grid place-items-center text-5.5 mb-3.5"
                    style={{ background: it.color, boxShadow: `0 8px 20px -8px ${it.color}88` }}
                  >
                    {it.icon}
                  </div>
                  <div className="font-sans text-2.75 font-bold tracking-widest uppercase mb-1.5" style={{ color: it.color }}>The mistake</div>
                  <div className="text-[14.5px] font-semibold text-ink leading-[1.35] mb-3">"{it.mistake}"</div>
                  <div className="h-px bg-line-soft -mx-5.5 mb-3" />
                  <div className="font-sans text-2.75 font-bold tracking-widest uppercase text-dim mb-1.5">How we fixed it</div>
                  <div className="font-sans text-[13.5px] text-ink2 leading-[1.55]">{it.lesson}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pull quote */}
          <div className="mt-17.5 max-w-205 mx-auto text-center">
            <div className="font-sans text-[clamp(22px,2.4vw,30px)] font-normal italic text-ink leading-[1.35] tracking-[-0.01em]">
              "If we'd had a team like ours when we started, we'd have closed our first DR property six months sooner — and paid forty thousand dollars less."
            </div>
            <div className="mt-4.5 font-sans text-3.25 text-dim tracking-[.08em] uppercase font-bold">
              — The Founders, I♥DR Realty
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────── Roles ─────────────────────── */}
      <div className="max-w-310 mx-auto pt-14 sm:pt-18 px-4 sm:px-6 pb-5">
        <div className="text-center max-w-150 mx-auto mb-11">
          <div className="font-sans text-2.75 font-bold tracking-[.18em] uppercase text-gold">Built for everyone</div>
          <h2 className="font-sans text-[clamp(28px,3.6vw,42px)] font-semibold text-ink leading-[1.12] tracking-[-0.02em] mt-3">
            One platform. Three powerful experiences.
          </h2>
          <p className="font-sans text-ink2 text-[15.5px] leading-[1.6] mt-3.5">
            Whether you're buying a dream home, growing a portfolio, or closing deals as a professional — every workflow runs through one admin-verified marketplace.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-5">
          {ROLES.map(role => (
            <div key={role.key} className="bg-paper border border-line-soft rounded-2xl overflow-hidden shadow-[0_1px_0_rgba(0,16,46,.03)]">
              <div className="relative">
                <div className="h-37.5 bg-ink" style={{ backgroundImage: `url(${role.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="absolute top-0 left-0 w-full h-0.75" style={{ background: role.tone }} />
              </div>
              <div className="px-7.5 pb-7.5 -mt-7 relative">
                <div
                  className="w-13 h-13 rounded-xl text-paper grid place-items-center mb-4 shadow-[0_8px_20px_-8px_rgba(0,16,46,.45)]"
                  style={{ background: role.tone }}
                >
                  <role.Icon />
                </div>
                <div className="font-sans text-5.75 font-semibold text-ink">{role.label}</div>
                <p className="font-sans text-ink2 text-3.5 leading-[1.6] mt-2.5 mb-4.5">{role.sub}</p>
                {role.perks.map((perk, j) => (
                  <div key={perk} className={`flex items-center gap-2.25 py-1.75 font-sans text-[13.5px] text-ink${j ? ' border-t border-line-soft' : ''}`}>
                    <span className="shrink-0" style={{ color: role.tone }}><Check size={14} /></span>
                    {perk}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────── Featured Properties ─────────────────────── */}
      <div className="max-w-310 mx-auto pt-11 px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="flex items-end justify-between mb-6.5 flex-wrap gap-3">
          <div>
            <div className="font-sans text-2.75 font-bold tracking-[.18em] uppercase text-sea">Hand-picked</div>
            <h2 className="font-sans text-8.5 font-semibold text-ink mt-2">Featured properties</h2>
          </div>
          <div className="flex items-center gap-3">
            <CurrencyToggle currency={currency} onChange={setCurrency} />
            <button
              onClick={() => go('search')}
              className="font-sans text-3.5 font-semibold cursor-pointer text-ink2 bg-transparent border border-line px-5 py-2.5 rounded-full inline-flex items-center gap-2"
            >
              View all <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-5">
          {featured.map(p => <PropertyCard key={p.id} prop={p} go={go} currency={currency} dopRate={dopRate} />)}
        </div>
      </div>

    </div>
  )
}
