'use client'
import { type ReactNode } from 'react'
import { X } from 'lucide-react'

const TYPES       = ['All', 'Villa', 'Apartment', 'Condo', 'Land', 'Commercial']
const ALL_REGIONS = ['Punta Cana', 'Santo Domingo', 'Cap Cana', 'Las Terrenas', 'Samaná', 'Jarabacoa', 'Santiago', 'Puerto Plata', 'Sosúa', 'Cabarete']

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-5.5">
      <div className="text-2.75 font-bold tracking-widest uppercase text-dim mb-2.5">{label}</div>
      {children}
    </div>
  )
}

function Chip({ active, onClick, children, tone }: {
  active: boolean
  onClick: () => void
  children: ReactNode
  tone?: 'coral' | 'brand'
}) {
  return (
    <button onClick={onClick}
      className={`font-sans text-[12.5px] cursor-pointer py-1.5 px-3 rounded-full mr-1.25 mb-1.25 border transition-all duration-150 ${
        active
          ? tone === 'coral' ? 'bg-coral text-paper border-coral font-bold'
          : tone === 'brand' ? 'bg-brand text-paper border-brand font-bold'
          : 'bg-ink text-paper border-ink font-bold'
          : 'bg-paper text-ink2 border-line font-medium'
      }`}>{children}</button>
  )
}

export interface FilterSidebarProps {
  type: string
  purpose: 'sale' | 'rent' | 'investment'
  minPrice: number
  maxPrice: number
  beds: string
  region: string | null
  minROI: number
  amenities: Set<string>
  invFlags: Set<string>
  setType: (v: string) => void
  setPurpose: (v: 'sale' | 'rent' | 'investment') => void
  setMinPrice: (v: number) => void
  setMaxPrice: (v: number) => void
  setBeds: (v: string) => void
  setRegion: (v: string | null) => void
  setMinROI: (v: number) => void
  setAmenities: (v: Set<string>) => void
  setInvFlags: (v: Set<string>) => void
  allAmenities: string[]
  chips: { label: string; clear: () => void }[]
  resultsCount: number
  clearAll: () => void
  mobile?: boolean
  onClose?: () => void
}

export function SearchFilterSidebar(props: FilterSidebarProps) {
  const {
    type, purpose, minPrice, maxPrice, beds, region, minROI, amenities, invFlags,
    setType, setPurpose, setMinPrice, setMaxPrice, setBeds, setRegion, setMinROI, setAmenities, setInvFlags,
    allAmenities, chips, resultsCount, clearAll, mobile = false, onClose,
  } = props

  const filterContent = (
    <>
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
          {allAmenities.map(a => {
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
    </>
  )

  if (mobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-paper lg:hidden">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-line-soft shrink-0">
          <div className="font-sans text-4.5 font-bold text-ink">Filters / Filtros</div>
          <div className="flex items-center gap-2">
            {chips.length > 0 && (
              <span className="text-2.5 font-bold py-0.75 px-2 rounded-full bg-coral text-white">{chips.length}</span>
            )}
            <button onClick={onClose}
              className="p-1.5 bg-transparent border-none cursor-pointer text-ink flex items-center">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
          {filterContent}
        </div>
        <div className="shrink-0 px-4 py-4 border-t border-line-soft flex flex-col gap-2.5">
          <button onClick={clearAll}
            className="w-full py-2.5 px-3.5 rounded-lg bg-transparent text-dim border border-line font-sans text-3.25 font-semibold cursor-pointer">
            Clear all filters
          </button>
          <button onClick={onClose}
            className="w-full py-2.5 px-3.5 rounded-lg bg-coral text-white border-none font-sans text-3.25 font-semibold cursor-pointer">
            Show {resultsCount} results
          </button>
        </div>
      </div>
    )
  }

  return (
    <aside className="hidden lg:block self-start sticky top-22.5 max-h-[calc(100vh-110px)] overflow-y-auto bg-paper border border-line-soft rounded-2xl p-4.5">
      <div className="flex items-center justify-between mb-4.5 pb-3 border-b border-line-soft">
        <div className="font-sans text-4.5 font-bold text-ink">Filters</div>
        {chips.length > 0 &&
          <span className="text-2.5 font-bold py-0.75 px-2 rounded-full bg-coral text-white">
            {chips.length}
          </span>}
      </div>
      {filterContent}
      <div className="flex flex-col gap-2 mt-4.5 pt-3.5 border-t border-line-soft">
        <button onClick={clearAll}
          className="w-full py-2.5 px-3.5 rounded-lg bg-transparent text-dim border border-line font-sans text-3.25 font-semibold cursor-pointer">
          Clear all filters
        </button>
        <button
          className="w-full py-2.5 px-3.5 rounded-lg bg-coral text-white border-none font-sans text-3.25 font-semibold cursor-pointer">
          Apply ({resultsCount})
        </button>
      </div>
    </aside>
  )
}
