'use client'
import { GoogleMap, OverlayView, useJsApiLoader } from '@react-google-maps/api'
import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { fmt, type Listing } from '../data/listings'
import { DR_REGIONS } from '../data/searchData'
import { supabaseImgUrl } from '../api/imgUrl'

const titleCase = (s: string) =>
  s === s.toUpperCase() ? s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : s

function strHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) >>> 0
  return h
}

function coordsForListing(l: Listing): { lat: number; lng: number } {
  if (l.latitude != null && l.longitude != null) {
    return { lat: l.latitude, lng: l.longitude }
  }
  const match = (s: string, key: string) =>
    new RegExp(key.replace('á', '[áa]').replace('ú', '[úu]'), 'i').test(s)
  const base = DR_REGIONS.find(reg => match(l.region, reg.key))
    ?? DR_REGIONS.find(reg => reg.key === 'Santo Domingo')
    ?? DR_REGIONS[0]
  const seed = (strHash(l.id) * 9301 + 49297) % 233280
  const rand = (i: number) => (((seed * (i + 1)) % 233280) / 233280) * 2 - 1
  return { lat: base.lat + rand(1) * 0.055, lng: base.lng + rand(2) * 0.075 }
}

const MAP_CENTER = { lat: 18.73, lng: -70.16 }
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: 'poi',            elementType: 'labels.icon',        stylers: [{ visibility: 'off' }] },
  { featureType: 'transit',        elementType: 'labels.icon',        stylers: [{ visibility: 'off' }] },
  { featureType: 'road',           elementType: 'geometry.fill',      stylers: [{ color: '#f0ede8' }] },
  { featureType: 'road.highway',   elementType: 'geometry.fill',      stylers: [{ color: '#e4dfd8' }] },
  { featureType: 'water',          elementType: 'geometry',           stylers: [{ color: '#cfe0f0' }] },
  { featureType: 'landscape',      elementType: 'geometry',           stylers: [{ color: '#f7f5f2' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke',    stylers: [{ color: '#d8d3cc' }] },
]
const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: MAP_STYLES,
  gestureHandling: 'cooperative',
  minZoom: 7,
  maxZoom: 14,
}

function fmtPill(l: { price: number; purpose: string }, currency: 'USD' | 'DOP', dopRate: number): string {
  if (currency === 'DOP') {
    const dp = Math.round(l.price * dopRate)
    const short = dp >= 1_000_000 ? `RD$${(dp / 1_000_000).toFixed(1)}M` : `RD$${Math.round(dp / 1_000)}K`
    return l.purpose === 'rent' ? `RD$${dp.toLocaleString()}/mo` : short
  }
  const p = l.price
  const short = p >= 1_000_000 ? `$${(p / 1_000_000).toFixed(1)}M USD` : `$${Math.round(p / 1_000)}K USD`
  return l.purpose === 'rent' ? `$${Math.round(p).toLocaleString()} USD/mo` : short
}

function Insight({ label, value, tone }: { label: string; value: string | number; tone?: 'brand' }) {
  return (
    <div className="py-2.5 border-b border-line-soft">
      <div className="text-[10.5px] font-bold tracking-[.08em] uppercase text-dim mb-1">{label}</div>
      <div className={`font-sans text-5.5 font-bold leading-none ${tone === 'brand' ? 'text-brand' : 'text-ink'}`}>{value}</div>
    </div>
  )
}

function LiveMap({ apiKey, hovered, listings, onSelect, currency, dopRate, region }: {
  apiKey: string
  hovered: Listing | null
  listings: Listing[]
  onSelect: (l: Listing) => void
  currency: 'USD' | 'DOP'
  dopRate: number
  region: string | null
}) {
  const { t } = useTranslation('search')
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: apiKey })
  const mapRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return
    if (region) {
      const match = DR_REGIONS.find(r => r.key === region)
      if (match) {
        mapRef.current.panTo({ lat: match.lat, lng: match.lng })
        mapRef.current.setZoom(12)
      }
    } else {
      mapRef.current.panTo(MAP_CENTER)
      mapRef.current.setZoom(8)
    }
  }, [region])

  if (!isLoaded) {
    return (
      <div style={{ width: '100%', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#00102e', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
        {t('map.loading')}
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '260px' }}
      center={MAP_CENTER}
      zoom={8}
      options={MAP_OPTIONS}
      onLoad={map => { mapRef.current = map }}
    >
      {listings.map(l => {
        const pos   = coordsForListing(l)
        const isHot = hovered?.id === l.id
        return (
          <OverlayView
            key={l.id}
            position={pos}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(w, h) => ({ x: -w / 2, y: -h / 2 })}
          >
            <div style={{ overflow: 'visible', whiteSpace: 'nowrap' }}>
              <div
                onClick={() => onSelect(l)}
                style={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                  fontSize: '13px',
                  fontWeight: '700',
                  fontFamily: '"Mona Sans","Inter",system-ui,sans-serif',
                  padding: '7px 13px',
                  borderRadius: '9999px',
                  background: isHot ? '#00102e' : 'white',
                  color: isHot ? 'white' : '#00102e',
                  border: `1.5px solid ${isHot ? '#00102e' : 'rgba(0,0,0,0.18)'}`,
                  userSelect: 'none',
                  boxShadow: isHot ? '0 2px 10px rgba(0,0,0,0.35)' : '0 2px 6px rgba(0,0,0,0.14)',
                  zIndex: isHot ? 10 : 1,
                  position: 'relative',
                  transform: isHot ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                }}
              >
                {fmtPill(l, currency, dopRate)}
              </div>
            </div>
          </OverlayView>
        )
      })}
    </GoogleMap>
  )
}

function DRMap({ hovered, listings, onSelect, currency, dopRate, onCurrencyChange, region }: {
  hovered: Listing | null
  listings: Listing[]
  onSelect: (l: Listing) => void
  currency: 'USD' | 'DOP'
  dopRate: number
  onCurrencyChange: (c: 'USD' | 'DOP') => void
  region: string | null
}) {
  const { t } = useTranslation('search')
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const hasKey = Boolean(apiKey && apiKey !== 'YOUR_KEY_HERE')

  return (
    <div className="bg-paper rounded-2xl overflow-hidden border border-line">
      <div className="pt-3.5 px-4.5 pb-3.5 flex items-start justify-between gap-2">
        <div>
          <div className="font-sans text-4.25 font-semibold text-ink">Dominican Republic</div>
          <div className="text-xs text-dim mt-0.5 font-sans">
            {listings.length > 0
              ? t('map.mapped', { count: listings.length })
              : t('map.tap_region')}
          </div>
        </div>
        <div className="flex rounded-lg border border-line overflow-hidden text-[11px] font-bold shrink-0">
          {(['DOP', 'USD'] as const).map(c => (
            <button key={c} type="button" onClick={() => onCurrencyChange(c)}
              className="px-2.5 py-1 transition-colors cursor-pointer"
              style={{ background: currency === c ? '#00102e' : 'white', color: currency === c ? 'white' : '#64748b' }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        {hasKey ? (
          <LiveMap
            apiKey={apiKey}
            hovered={hovered}
            listings={listings}
            onSelect={onSelect}
            currency={currency}
            dopRate={dopRate}
            region={region}
          />
        ) : (
          <div style={{ width: '100%', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#00102e', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env
          </div>
        )}
      </div>
    </div>
  )
}

export interface MapSidebarProps {
  hovered: Listing | null
  results: Listing[]
  alsoLike: Listing[]
  insights: { count: number; median: number; avgYield: number } | null
  currency: 'USD' | 'DOP'
  dopRate: number
  region: string | null
  onCurrencyChange: (c: 'USD' | 'DOP') => void
  onSelect: (l: Listing) => void
  go: (path: string) => void
}

export function SearchMapSidebar({
  hovered, results, alsoLike, insights, currency, dopRate, region,
  onCurrencyChange, onSelect, go,
}: MapSidebarProps) {
  const { t } = useTranslation('search')
  const fmtMedian = (v: number) => {
    if (currency === 'DOP') {
      const dp = Math.round(v * dopRate)
      return dp >= 1_000_000 ? `RD$${(dp / 1_000_000).toFixed(1)}M` : `RD$${Math.round(dp / 1_000)}K`
    }
    return v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M USD` : `$${Math.round(v / 1_000)}K USD`
  }

  return (
    <aside className="hidden lg:block self-start sticky top-22.5 max-h-[calc(100vh-110px)] overflow-y-auto space-y-3.5">

      <DRMap
        hovered={hovered}
        listings={results}
        onSelect={onSelect}
        currency={currency}
        dopRate={dopRate}
        onCurrencyChange={onCurrencyChange}
        region={region}
      />

      {insights && (
        <div className="bg-paper border border-line-soft rounded-2xl py-4 px-4.5">
          <div className="text-2.75 font-bold tracking-[.12em] uppercase text-dim mb-1">{t('map.snapshot')}</div>
          <div className="text-[11.5px] text-dim mb-2.5 leading-[1.45]">
            {region ? t('map.snapshot_in', { region }) : t('map.snapshot_across')}
          </div>
          <Insight label={t('map.insight_count')} value={insights.count} />
          {insights.median   > 0 && <Insight label={t('map.insight_median')} value={fmtMedian(insights.median)} />}
          {insights.avgYield > 0 && <Insight label={t('map.insight_yield')}  value={`${insights.avgYield.toFixed(1)}%`} tone="brand" />}
        </div>
      )}

      {alsoLike.length > 0 && (
        <div className="bg-paper border border-line-soft rounded-2xl py-4 px-4.5">
          <div className="text-2.75 font-bold tracking-[.12em] uppercase text-dim mb-1">{t('map.also_like')}</div>
          <div className="text-[11.5px] text-dim mb-3 leading-[1.45]">{t('map.also_like_sub')}</div>
          {alsoLike.map((l, i) => (
            <button key={l.id} onClick={() => go(`detail?id=${l.id}`)}
              className={`flex w-full gap-2.5 py-2.5 bg-transparent border-x-0 border-t-0 cursor-pointer text-left font-sans ${i < alsoLike.length - 1 ? 'border-b border-line-soft' : 'border-b-0'}`}>
              <div className="w-14 h-11 rounded-md shrink-0 overflow-hidden"
                style={{ backgroundImage: `url(${supabaseImgUrl(l.img, 400)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-ink truncate">{titleCase(l.title)}</div>
                <div className="text-[10.5px] text-dim mt-px truncate">{l.region}</div>
                <div className="text-[11.5px] font-bold text-coral mt-0.5">
                  {currency === 'DOP'
                    ? (() => { const dp = Math.round(l.price * dopRate); return dp >= 1_000_000 ? `RD$${(dp/1_000_000).toFixed(1)}M` : `RD$${Math.round(dp/1_000)}K` })()
                    : `${fmt(l.price)} USD`}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="bg-ink text-paper rounded-2xl p-4.5 font-sans">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4ade80] shrink-0" />
          <span className="text-2.75 text-white/65 tracking-[.08em] uppercase font-bold">
            {t('map.team_badge')}
          </span>
        </div>
        <div className="font-sans text-4.25 font-semibold leading-tight mb-1.5">
          {t('map.team_heading')}
        </div>
        <div className="text-[12.5px] text-white/70 leading-normal mb-3">
          {t('map.team_body')}
        </div>
        <button onClick={() => go('contact')}
          className="w-full py-2.5 px-3.5 rounded-lg bg-coral text-white border-none font-sans text-3.25 font-semibold cursor-pointer">
          {t('map.team_cta')}
        </button>
      </div>

    </aside>
  )
}
