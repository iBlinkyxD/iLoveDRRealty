import { useState, useEffect, useRef } from 'react'
import {
  Building2, Plus, Search, MoreHorizontal, Home, Pencil, Trash2, EyeOff,
  MapPin, Star, Clock,
} from 'lucide-react'
import { getMyListings, type Listing } from '../../api/listings'
import { EditListing } from './SubmitListing'
import { ListingDetailPanel } from '../../components/listings/ListingDetailPanel'

const titleCase = (s: string) =>
  s === s.toUpperCase() ? s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : s

// ── constants ─────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; filter: string }> = {
  active:           { label: 'Active',   bg: '#dcfce7', color: '#15803d', filter: 'Active'   },
  pending_approval: { label: 'Review',   bg: '#fef9c3', color: '#a16207', filter: 'Review'   },
  rejected:         { label: 'Rejected', bg: '#fee2e2', color: '#b91c1c', filter: 'Rejected' },
  archived:         { label: 'Archived', bg: '#f3f4f6', color: '#6b7280', filter: 'Archived' },
}

// ── small helpers ─────────────────────────────────────────────────────────────

function fmtPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`
  if (price >= 1_000)     return `$${Math.round(price / 1_000)}K`
  return `$${price}`
}

function fmtType(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
}

function fmtRelative(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)    return 'just now'
  if (mins < 60)   return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)    return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30)   return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

function StatusChip({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, bg: '#f3f4f6', color: '#6b7280' }
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  )
}

// ── ActionMenu (3-dots dropdown) ──────────────────────────────────────────────

function ActionMenu({ onEdit, onRequestDeal }: { onEdit: () => void; onRequestDeal?: () => void }) {
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState({ top: 0, left: 0 })
  const btnRef  = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function toggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 6, left: r.right - 144 })
    }
    setOpen(v => !v)
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-dim hover:text-ink hover:bg-line/50 transition-colors cursor-pointer"
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="fixed w-44 bg-paper rounded-xl border border-line shadow-lg z-50 overflow-hidden"
          style={{ top: pos.top, left: pos.left }}
        >
          <button
            onClick={() => { onEdit(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs text-ink hover:bg-line/40 transition-colors cursor-pointer"
          >
            <Pencil size={12} /> Edit listing
          </button>
          {onRequestDeal && (
            <button
              onClick={() => { onRequestDeal(); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs hover:bg-amber-50 transition-colors cursor-pointer"
              style={{ color: '#c07800' }}
            >
              <Star size={12} /> Deal of the Week
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs text-ink hover:bg-line/40 transition-colors cursor-pointer"
          >
            <EyeOff size={12} /> Hide listing
          </button>
          <div className="border-t border-line" />
          <button
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={12} /> Delete listing
          </button>
        </div>
      )}
    </>
  )
}

function PendingReviewsCard({ items, tone, onSelect }: { items: Listing[]; tone: string; onSelect: (l: Listing) => void }) {
  return (
    <div className="bg-paper border border-line rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-line">
        <div className="flex items-center gap-2 text-[14px] font-bold text-ink">
          <Clock size={14} className="text-dim" />
          Pending Reviews
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: tone, background: `${tone}18` }}>
          {items.length}
        </span>
      </div>
      <div className="divide-y divide-line-soft">
        {items.map(l => (
          <button
            key={l.id}
            onClick={() => onSelect(l)}
            className="w-full text-left px-4 py-3 hover:bg-line-soft/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              {l.images?.[0] ? (
                <img src={l.images[0]} alt="" className="w-10 h-7 rounded-md object-cover shrink-0" />
              ) : (
                <div className="w-10 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: `${tone}18` }}>
                  <Home size={12} style={{ color: tone }} />
                </div>
              )}
              <div className="text-[12.5px] font-semibold text-ink truncate">{titleCase(l.title)}</div>
            </div>
            <div className="flex flex-col gap-1 pl-0.5">
              {l.has_pending_deal_request && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: '#c07800' }}>
                  <Star size={10} fill="#f0a800" style={{ color: '#f0a800' }} />
                  Deal request pending
                </div>
              )}
              {l.has_pending_edit && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: '#7c3aed' }}>
                  <Pencil size={10} />
                  Edit pending approval
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── constants ─────────────────────────────────────────────────────────────────

const COLS    = 'grid-cols-[2fr_0.8fr_1fr_1fr_0.7fr_0.7fr_1fr_40px]'
const HEADERS = ['Property', 'Type', 'Price', 'Status', 'Views', 'Leads', 'Updated', ''] as const
const FILTERS = ['All', 'Active', 'Review', 'Rejected', 'Archived'] as const

// ── Main component ────────────────────────────────────────────────────────────

export function RealtorListings({ tone, go }: { tone: string; go: (v: string) => void }) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState<typeof FILTERS[number]>('All')
  const [query,    setQuery]    = useState('')
  const [selected,  setSelected]  = useState<Listing | null>(null)
  const [editing,   setEditing]   = useState(false)
  const [openDeal,  setOpenDeal]  = useState(false)

  function load() {
    getMyListings()
      .then(setListings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const afterFilter = filter === 'All'
    ? listings
    : listings.filter(l => (STATUS_MAP[l.status]?.filter ?? l.status) === filter)

  const visible = query.trim()
    ? afterFilter.filter(l =>
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.location.toLowerCase().includes(query.toLowerCase())
      )
    : afterFilter

  if (editing && selected) {
    return (
      <EditListing
        listing={selected}
        tone={tone}
        onBack={() => setEditing(false)}
        onSaved={updated => {
          setListings(prev => prev.map(l => l.id === updated.id ? updated : l))
          setSelected(updated)
          setEditing(false)
        }}
      />
    )
  }

  const pendingReviews = listings.filter(l => l.has_pending_deal_request || l.has_pending_edit)

  return (
    <>
      <div className={pendingReviews.length > 0 ? 'flex flex-col gap-5 xl:flex-row xl:items-start' : ''}>
      <div className={`bg-paper border border-line rounded-2xl overflow-hidden${pendingReviews.length > 0 ? ' flex-1 min-w-0' : ''}`}>

        {/* Toolbar */}
        <div className="px-4 sm:px-5.5 py-4 border-b border-line space-y-3">
          <div className="font-sans text-[17px] font-bold text-ink">
            My Listings
            {!loading && <span className="ml-2 text-[13px] font-normal text-dim">({visible.length})</span>}
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-white w-55">
                <Search size={13} className="text-dim" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search listings…"
                  className="text-xs border-0 outline-none bg-transparent text-ink placeholder:text-dim flex-1"
                />
              </div>
              <button
                onClick={() => go('submit-listing')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold text-white shrink-0 cursor-pointer border-0"
                style={{ background: tone }}
              >
                <Plus size={13} /> Add Listing
              </button>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="py-1 px-3 rounded-full text-[11.5px] font-semibold cursor-pointer transition-colors"
                  style={{
                    border:     `1px solid ${filter === f ? tone : '#e4ddcf'}`,
                    background: filter === f ? tone : 'transparent',
                    color:      filter === f ? '#fff' : '#33425f',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop table header */}
        <div className={`hidden sm:grid ${COLS} px-5.5 py-2.5 border-b border-line bg-nav/5`}>
          {HEADERS.map(h => (
            <div key={h} className="text-[11px] font-bold uppercase tracking-[.07em] text-dim">{h}</div>
          ))}
        </div>

        {/* Body */}
        {loading ? (
          <div className="divide-y divide-line-soft">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5.5 py-4 animate-pulse flex items-center gap-3">
                <div className="w-14 h-9 rounded-lg bg-line-soft shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-line-soft rounded w-1/3" />
                  <div className="h-3 bg-line-soft rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="py-14 flex flex-col items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: `${tone}18` }}
            >
              <Building2 size={26} style={{ color: tone }} />
            </div>
            <div className="text-center">
              <div className="text-[15px] font-semibold text-ink mb-1">No listings yet</div>
              <div className="text-xs text-dim max-w-55">
                Add your first property to start attracting buyers and renters.
              </div>
            </div>
            <button
              onClick={() => go('submit-listing')}
              className="flex items-center gap-1.5 py-2 px-5 rounded-full text-[13px] font-bold cursor-pointer"
              style={{ background: tone, color: '#fff' }}
            >
              <Plus size={14} strokeWidth={2.5} />
              Add your first listing
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="py-12 text-center text-sm text-dim">
            {query.trim() ? `No results for "${query}"` : `No ${filter.toLowerCase()} listings.`}
          </div>
        ) : (
          <div className="divide-y divide-line-soft">
            {visible.map(l => (
              <div key={l.id}>
                {/* Desktop row */}
                <div
                  className={`hidden sm:grid ${COLS} items-center px-5.5 py-3.5 cursor-pointer hover:bg-line-soft/40 transition-colors`}
                  onClick={() => { setSelected(l); setEditing(false) }}
                >
                  {/* Property */}
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    {l.images?.[0] ? (
                      <img src={l.images[0]} alt={l.title} className="w-14 h-9 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-14 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${tone}18` }}>
                        <Home size={16} style={{ color: tone }} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-ink truncate">{titleCase(l.title)}</div>
                      <div className="text-[11px] text-dim flex items-center gap-1 truncate"><MapPin size={9} />{l.location}</div>
                    </div>
                  </div>
                  {/* Type */}
                  <div className="text-[12px] text-ink2">{fmtType(l.type)}</div>
                  {/* Price */}
                  <div className="text-[13px] font-semibold text-ink">{fmtPrice(Number(l.price))}</div>
                  {/* Status */}
                  <div><StatusChip status={l.status} /></div>
                  {/* Views */}
                  <div className="text-[12px] text-ink2">{l.view_count.toLocaleString()}</div>
                  {/* Leads */}
                  <div className="text-[12px] text-ink2">{l.leads_count.toLocaleString()}</div>
                  {/* Updated */}
                  <div className="text-[12px] text-ink2">{fmtRelative(l.updated_at)}</div>
                  {/* Actions */}
                  <div onClick={e => e.stopPropagation()}>
                    <ActionMenu
                      onEdit={() => { setSelected(l); setEditing(true) }}
                      onRequestDeal={l.status === 'active' && !l.is_deal ? () => { setSelected(l); setOpenDeal(true) } : undefined}
                    />
                  </div>
                </div>

                {/* Mobile card */}
                <div
                  className="sm:hidden px-4 py-3.5 cursor-pointer"
                  onClick={() => { setSelected(l); setEditing(false) }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {l.images?.[0] ? (
                        <img src={l.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${tone}18` }}>
                          <Home size={14} style={{ color: tone }} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-[13.5px] font-semibold text-ink truncate">{titleCase(l.title)}</div>
                        <div className="text-[11px] text-dim flex items-center gap-1 truncate"><MapPin size={9} />{l.location}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <StatusChip status={l.status} />
                      <div className="text-[11px] text-dim">{fmtPrice(Number(l.price))}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-dim mt-2">
                    {fmtType(l.type)} · {l.view_count} views · {l.leads_count} leads · Updated {fmtRelative(l.updated_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pendingReviews.length > 0 && (
        <div className="xl:w-64 shrink-0">
          <PendingReviewsCard items={pendingReviews} tone={tone} onSelect={l => { setSelected(l); setEditing(false) }} />
        </div>
      )}
      </div>

      {selected && !editing && (
        <ListingDetailPanel
          listing={selected}
          tone={tone}
          role="realtor"
          openDeal={openDeal}
          onClose={() => { setSelected(null); setOpenDeal(false) }}
          onEdit={() => setEditing(true)}
        />
      )}
    </>
  )
}
