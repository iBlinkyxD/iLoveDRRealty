'use client'
import { Suspense, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, BedDouble, Bath, Maximize2,
  MapPin, Star, BarChart2, Share2, MessageCircle,
} from 'lucide-react'
import { useNav } from '../hooks/useNav'
import { LISTINGS, fmt } from '../data/listings'
import { TONE_MAP, GALLERY_EXTRAS, HIGHLIGHTS, THINGS_TO_KNOW, REVIEWS } from '../data/propertyDetailData'

function Slider({ label, value, set, min, max, step, fmtV }: {
  label: string; value: number; set: (v: number) => void
  min: number; max: number; step: number; fmtV: (v: number) => string
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-[11.5px] font-semibold text-muted tracking-wide uppercase">{label}</span>
        <span className="text-[13px] font-bold text-ink font-serif">{fmtV(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => set(+e.target.value)}
        className="w-full accent-sea" />
    </div>
  )
}

function PropertyDetailInner() {
  const params    = useSearchParams()
  const go        = useNav()
  const id        = Number(params.get('id') ?? '1')
  const listing   = LISTINGS.find(l => l.id === id) ?? LISTINGS[0]

  const [tab,          setTab]          = useState<'rent' | 'buy'>('buy')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [aPrice,       setAPrice]       = useState(listing.price)
  const [aDown,        setADown]        = useState(30)
  const [aRate,        setARate]        = useState(7)
  const [aOcc,         setAOcc]         = useState(88)
  const [aConfotur,    setAConfotur]    = useState(true)

  const summaryKpis = [
    [`${listing.roi}%`, 'Est. annual ROI'],
    ['$225K',           'Est. annual gross'],
    ['11 yr',           'Break-even'],
    [`${aOcc}%`,        'Occupancy'],
  ]

  const calc = useMemo(() => {
    const loan     = aPrice * (1 - aDown / 100)
    const mr       = aRate / 100 / 12
    const n        = 360
    const mortgage = mr > 0 ? loan * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1) : loan / n
    const gross    = 1200 * 365 * (aOcc / 100)
    const ipi      = aConfotur ? 0 : aPrice * 0.01
    const net      = gross - gross * 0.3 - ipi - mortgage * 12
    const cashIn   = aPrice * (aDown / 100) + aPrice * 0.04
    const roi      = (net / cashIn) * 100
    const be       = net > 0 ? cashIn / net : 0
    return { gross, net, roi, be, cashIn }
  }, [aPrice, aDown, aRate, aOcc, aConfotur])

  const years  = Array.from({ length: 6 }, (_, i) => calc.net * (i + 1) - calc.cashIn)
  const maxBar = Math.max(...years.map(Math.abs), 1)
  const imgs   = [listing.img, ...GALLERY_EXTRAS]

  return (
    <div className="max-w-310 mx-auto px-6 py-5 pb-20">

      {/* Back */}
      <button onClick={() => go('search')}
        className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-ink2 text-[13px] mb-4 font-sans">
        <ArrowLeft size={15} />
        Back to search
      </button>

      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3 mb-3.5">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {listing.tags.map(([tag, tone], i) => (
              <span key={i} className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${TONE_MAP[tone] ?? TONE_MAP.sand}`}>
                {tag}
              </span>
            ))}
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border bg-brand text-white border-brand">
              Verified
            </span>
          </div>
          <h1 className="font-serif text-[clamp(26px,4vw,40px)] font-semibold text-ink leading-[1.07] tracking-tight">
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3.5 text-ink2 text-[14px] mt-2">
            <span className="flex items-center gap-1.5"><MapPin size={15} />{listing.region}</span>
            <span className="flex items-center gap-1.5">
              <Star size={15} className="text-gold fill-gold" />
              4.97 · 142 reviews
            </span>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-transparent border border-line text-ink text-[13px] font-semibold px-4 py-2.5 rounded-full cursor-pointer font-sans">
          <Share2 size={15} /> Share
        </button>
      </div>

      {/* Gallery */}
      <div className="mb-7 grid grid-cols-[2fr_1fr_1fr] grid-rows-[172px_172px] gap-2">
        <div className="rounded-2xl overflow-hidden row-span-2 bg-cover bg-center"
          style={{ backgroundImage: `url(${imgs[0]})` }} />
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-xl overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${imgs[i]})` }} />
        ))}
        <div className="rounded-xl overflow-hidden bg-cover bg-center relative"
          style={{ backgroundImage: `url(${imgs[4] ?? imgs[1]})` }}>
          <div className="absolute inset-0 grid place-items-center text-white text-[13px] font-semibold font-sans bg-ink/52">
            + 24 photos
          </div>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-[1fr_360px] gap-10 items-start">

        {/* ── LEFT ── */}
        <div>

          {/* Description */}
          <p className="font-serif text-[19px] leading-[1.65] text-ink2 italic pb-6 border-b border-line-soft">
            Nestled along the pristine shores of {listing.region.split(',')[0]}, this property is an architectural
            masterpiece that redefines Caribbean luxury — an extraordinary residence offering an unparalleled
            fusion of indoor-outdoor living in one of the DR&apos;s most sought-after destinations.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 py-5.5 border-b border-line-soft text-ink text-[15px]">
            {listing.bd > 0 && <span className="flex items-center gap-1.5"><BedDouble size={18} />{listing.bd} beds</span>}
            {listing.ba > 0 && <span className="flex items-center gap-1.5"><Bath size={18} />{listing.ba} baths</span>}
            <span className="flex items-center gap-1.5"><Maximize2 size={18} />{listing.m2.toLocaleString()} ft²</span>
          </div>

          {/* Property highlights */}
          <h3 className="font-serif text-[22px] font-semibold text-ink mt-7 mb-4">Property highlights</h3>
          <div className="grid grid-cols-2 gap-3">
            {HIGHLIGHTS.map(([icon, title, sub], i) => (
              <div key={i} className="flex gap-3.5 p-4 bg-paper2 border border-line-soft rounded-2xl">
                <span className="text-[22px] shrink-0">{icon}</span>
                <div>
                  <div className="font-semibold text-[14px] text-ink">{title}</div>
                  <div className="text-[12.5px] text-muted mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Investment summary (sale only) */}
          {listing.purpose === 'sale' && (
            <div className="mt-7 border border-line-soft rounded-2xl overflow-hidden bg-white shadow-[0_10px_30px_-18px_rgba(0,16,46,.18)]">

              {/* Header band */}
              <div className="relative overflow-hidden flex items-center gap-3 px-6 py-4 text-white bg-[linear-gradient(135deg,var(--color-ink)_0%,var(--color-sea)_100%)]">
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(225,15,31,.18)_0%,transparent_70%)]" />
                <div className="relative w-8 h-8 rounded-lg grid place-items-center shrink-0 bg-white/15">
                  <BarChart2 size={17} />
                </div>
                <div className="relative">
                  <div className="text-[11px] font-bold tracking-[.14em] uppercase">Investment Summary</div>
                  <div className="text-[12px] mt-0.5 text-white/70">
                    Estimated returns at current asking price · typical assumptions
                  </div>
                </div>
              </div>

              {/* KPI row */}
              <div className="px-6 pt-5 pb-4">
                <div className="grid grid-cols-4 gap-4">
                  {summaryKpis.map(([n, l], i) => (
                    <div key={i} className={`relative ${i > 0 ? 'pl-4 border-l border-line-soft' : ''}`}>
                      <div className="text-[10.5px] font-bold tracking-wide uppercase text-muted mb-1.5">{l}</div>
                      <div className="font-serif text-sea text-[28px] font-bold leading-none">{n}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowAnalysis(s => !s)}
                  className={`mt-5 flex items-center gap-2 text-white text-[13px] font-bold px-5 py-2.5 rounded-full border-none cursor-pointer font-sans transition-all duration-150 ${showAnalysis ? 'bg-ink' : 'bg-coral shadow-[0_10px_24px_-10px_rgba(225,15,31,.53)]'}`}>
                  <BarChart2 size={15} />
                  {showAnalysis ? 'Hide deal analysis' : 'Run full deal analysis'}
                </button>
              </div>

              {/* Expanded analysis */}
              {showAnalysis && (
                <div className="px-6 pb-6 border-t border-line-soft">
                  <div className="pt-5 grid grid-cols-2 gap-4 gap-x-6">
                    <Slider label="Purchase price" value={aPrice} set={setAPrice} min={500000} max={5000000} step={50000} fmtV={v => fmt(v)} />
                    <Slider label="Down payment"   value={aDown}  set={setADown}  min={10}     max={100}     step={5}      fmtV={v => `${v}%`} />
                    <Slider label="Interest rate"  value={aRate}  set={setARate}  min={0}      max={14}      step={0.25}   fmtV={v => `${v}%`} />
                    <Slider label="Occupancy"      value={aOcc}   set={setAOcc}   min={40}     max={100}     step={1}      fmtV={v => `${v}%`} />
                  </div>

                  <label className="inline-flex items-center gap-2 mt-4 text-[12.5px] text-ink2 cursor-pointer px-3 py-2 bg-paper2 rounded-lg border border-line-soft">
                    <input type="checkbox" checked={aConfotur} onChange={e => setAConfotur(e.target.checked)}
                      className="w-3.5 h-3.5 accent-sea" />
                    CONFOTUR tax exemption
                    <span className="text-muted text-[11.5px]">(waives IPI property tax)</span>
                  </label>

                  {/* Result cards */}
                  <div className="grid grid-cols-3 gap-3 mt-5">
                    {[
                      ['Net annual profit',  calc.net >= 0 ? `$${Math.round(calc.net).toLocaleString()}` : `-$${Math.abs(Math.round(calc.net)).toLocaleString()}`, calc.net >= 0],
                      ['Cash-on-cash ROI',   `${calc.roi.toFixed(1)}%`, calc.roi >= 0],
                      ['Break-even',         calc.be > 0 ? `${calc.be.toFixed(1)} yrs` : '—', calc.be > 0 && calc.be < 15],
                    ].map(([l, v, ok], i) => (
                      <div key={i} className="border border-line-soft rounded-xl overflow-hidden bg-white">
                        <div className={`h-1 ${ok ? 'bg-sea' : 'bg-coral'}`} />
                        <div className="p-3.5 px-4">
                          <div className="text-[10.5px] text-muted font-bold tracking-wide uppercase">{l as string}</div>
                          <div className={`font-serif text-[24px] font-bold mt-1 ${ok ? 'text-ink' : 'text-coral'}`}>
                            {v as string}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cash flow chart */}
                  <div className="text-[10.5px] text-muted font-bold mt-6 mb-3 tracking-wide uppercase">
                    Cumulative cash flow · 6 years
                  </div>
                  <div className="bg-paper2 border border-line-soft rounded-xl p-4">
                    <div className="relative flex items-stretch gap-1.5 h-45">
                      <div className="absolute left-0 right-0 top-1/2 h-px bg-line z-0" />
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[9px] text-muted font-bold bg-paper2 px-1 tracking-wide">$0</div>
                      {years.map((y, i) => {
                        const pos  = y >= 0
                        const barH = Math.max(3, (Math.abs(y) / maxBar) * 60)
                        return (
                          <div key={i} className="flex-1 relative flex flex-col">
                            <div className="flex-1 relative">
                              {pos && (
                                <>
                                  <div className="absolute left-0 right-0 text-center text-[10.5px] font-bold font-sans text-sea"
                                    style={{ bottom: barH + 4 }}>
                                    +${Math.round(y / 1000)}K
                                  </div>
                                  <div className="absolute" style={{
                                    left: '22%', right: '22%', bottom: 0, height: barH,
                                    background: 'linear-gradient(180deg, var(--color-sea), #084a82)',
                                    borderRadius: '4px 4px 0 0',
                                    boxShadow: '0 2px 6px -2px rgba(11,99,171,0.4)',
                                  }} />
                                </>
                              )}
                            </div>
                            <div className="flex-1 relative">
                              {!pos && (
                                <>
                                  <div className="absolute" style={{
                                    left: '22%', right: '22%', top: 0, height: barH,
                                    background: 'linear-gradient(0deg, var(--color-coral), #a8000d)',
                                    borderRadius: '0 0 4px 4px',
                                    boxShadow: '0 -2px 6px -2px rgba(225,15,31,0.4)',
                                  }} />
                                  <div className="absolute left-0 right-0 text-center text-[10.5px] font-bold font-sans text-coral"
                                    style={{ top: barH + 4 }}>
                                    -${Math.round(Math.abs(y) / 1000)}K
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="absolute left-0 right-0 text-center text-[10.5px] text-muted font-semibold -bottom-4.5">
                              Yr {i + 1}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2.5 mt-6 flex-wrap">
                    <button className="flex-1 min-w-44 justify-center flex items-center gap-1.5 bg-paper border border-line text-ink px-4 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer font-sans">
                      <Share2 size={14} /> Share report
                    </button>
                    <button onClick={() => go('calculator')}
                      className="flex-1 min-w-44 justify-center flex items-center gap-1.5 bg-ink border-none text-white px-4 py-2.5 rounded-full text-[13px] font-bold cursor-pointer font-sans">
                      Open full calculator <ArrowRight size={14} />
                    </button>
                  </div>
                  <p className="text-[11.5px] text-muted mt-3.5 leading-[1.55]">
                    Estimates based on a $1,200 nightly rate and {aOcc}% occupancy. Illustrative only, not financial advice.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Location map */}
          <div className="mt-7">
            <h2 className="font-serif text-[22px] font-semibold text-ink mb-3.5">Location</h2>
            <div className="rounded-2xl overflow-hidden border border-line relative">
              <svg viewBox="0 0 800 300" style={{ width: '100%', display: 'block' }}>
                <rect width="800" height="300" fill="#e8eef0" />
                <g stroke="#d4dde0" strokeWidth="2" fill="none">
                  <path d="M0 80 H800 M0 160 H800 M0 240 H800 M150 0 V300 M340 0 V300 M520 0 V300 M680 0 V300" />
                </g>
                <path d="M0 200 Q200 180 400 210 T800 200 L800 300 L0 300 Z" fill="#bfe0ec" opacity="0.7" />
                <g fill="#cfe6d4"><circle cx="120" cy="110" r="40" /><circle cx="640" cy="90" r="50" /></g>
                <circle cx="400" cy="150" r="13" fill="var(--color-coral)" stroke="#fff" strokeWidth="3" />
                <circle cx="400" cy="150" r="26" fill="var(--color-coral)" opacity="0.2" />
                <text x="400" y="195" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-ink)" fontFamily="sans-serif">
                  {listing.region}
                </text>
              </svg>
              <div className="absolute top-3 right-3 bg-white rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-ink2 shadow-md">
                📍 Map view
              </div>
            </div>
            <p className="text-[12.5px] text-muted mt-2 leading-[1.55]">
              Exact location shared after inquiry.
            </p>
          </div>

          {/* Things to know */}
          <div className="mt-7">
            <h2 className="font-serif text-[22px] font-semibold text-ink mb-3.5">Things to know</h2>
            <div className="grid grid-cols-3 gap-4">
              {THINGS_TO_KNOW.map(([title, items], i) => (
                <div key={i}>
                  <div className="text-[14px] font-bold text-ink mb-2.5">{title}</div>
                  {items.map((it, j) => <div key={j} className="text-[13px] text-ink2 leading-[1.7]">{it}</div>)}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-7">
            <div className="flex items-center gap-2.5 mb-4">
              <Star size={20} className="text-gold fill-gold" />
              <h2 className="font-serif text-[22px] font-semibold text-ink">4.97 · 142 reviews</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {REVIEWS.map((r, i) => (
                <div key={i} className="bg-paper2 border border-line-soft rounded-2xl p-4">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className={`w-8 h-8 rounded-full grid place-items-center text-[12px] font-bold text-white shrink-0 ${r.colClass}`}>
                      {r.ini}
                    </span>
                    <div>
                      <div className="text-[13.5px] font-semibold text-ink">{r.name}</div>
                      <div className="flex gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} size={10} className="text-gold fill-gold" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[13px] text-ink2 leading-[1.6]">{r.text}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 flex items-center gap-2 bg-transparent border border-line text-ink text-[13px] font-semibold px-4 py-2.5 rounded-full cursor-pointer font-sans">
              Show all 142 reviews
            </button>
          </div>

        </div>

        {/* ── RIGHT sticky sidebar ── */}
        <div className="sticky top-22.5 border border-line rounded-2xl p-5.5 bg-white shadow-[0_18px_44px_-30px_rgba(0,16,46,.4)]">

          {/* Rent / Buy tabs */}
          <div className="flex bg-paper2 rounded-lg p-1 mb-4.5">
            {(['buy', 'rent'] as const).map(k => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex-1 py-2 rounded-lg border-none cursor-pointer font-sans text-[13.5px] font-bold transition-all duration-150 ${tab === k ? 'bg-white text-ink shadow-[0_1px_4px_rgba(0,16,46,.1)]' : 'bg-transparent text-dim'}`}>
                {k === 'rent' ? 'Rent' : 'Buy'}
              </button>
            ))}
          </div>

          {tab === 'buy' ? (
            <>
              <div className="font-serif text-[30px] font-semibold text-ink">
                {fmt(listing.price)}
              </div>
              <div className="text-[13px] text-muted mt-1">Sale price · CONFOTUR eligible</div>
              {[
                ['Est. monthly (mortgage)', '$11,240'],
                ['Est. ROI',               `${listing.roi}% / yr`],
                ['Property tax (IPI)',      '1% / yr'],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between py-3.5 border-b border-line-soft text-[13.5px]">
                  <span className="text-muted">{l}</span>
                  <span className="text-ink font-semibold">{v}</span>
                </div>
              ))}
              <button onClick={() => go('calculator')}
                className="w-full flex justify-center items-center py-3 mt-4 rounded-full border-none cursor-pointer text-white font-sans text-[13.5px] font-bold bg-coral">
                Analyze this deal
              </button>
            </>
          ) : (
            <>
              <div className="font-serif text-[30px] font-semibold text-ink">
                $1,200 <span className="text-[14px] text-muted font-sans font-normal">/ night</span>
              </div>
              {[['Check-in', 'Add date'], ['Check-out', 'Add date'], ['Guests', '2 adults']].map(([l, v], i) => (
                <div key={i} className="flex justify-between py-3.5 border-b border-line-soft text-[13.5px]">
                  <span className="text-muted">{l}</span>
                  <span className="text-ink font-semibold">{v}</span>
                </div>
              ))}
              <button onClick={() => go('contact')}
                className="w-full flex justify-center items-center py-3 mt-4 rounded-full border-none cursor-pointer text-white font-sans text-[13.5px] font-bold bg-coral">
                Request to book
              </button>
            </>
          )}

          <div className="flex gap-2.5 mt-3">
            <button className="flex-1 justify-center flex items-center gap-1.5 bg-transparent border border-line text-ink px-3 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer font-sans">
              <MessageCircle size={15} /> Message
            </button>
            <button className="flex-1 justify-center flex items-center bg-transparent border border-line text-ink px-3 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer font-sans">
              WhatsApp
            </button>
          </div>

          {/* Agent card */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-line-soft">
            <div className="w-10 h-10 rounded-full grid place-items-center text-white font-bold font-sans shrink-0 bg-sea">
              MR
            </div>
            <div>
              <div className="font-semibold text-[13.5px] text-ink">Miguel Rodríguez</div>
              <div className="text-[11.5px] text-muted">Certified realtor · 7 yrs · ⚡ Superhost</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function PropertyDetail() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center text-muted font-sans text-[14px]">
        Loading property…
      </div>
    }>
      <PropertyDetailInner />
    </Suspense>
  )
}
