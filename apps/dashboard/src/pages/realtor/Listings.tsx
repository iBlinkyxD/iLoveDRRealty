import { useState, useEffect, useRef } from 'react'
import {
  Building2, Plus, Search, MoreHorizontal, Home, Pencil, Trash2, EyeOff,
  ChevronLeft, ChevronRight, X, MapPin, Tag, Link2,
} from 'lucide-react'
import DOMPurify from 'dompurify'
import { getMyListings, type Listing } from '../../api/listings'
import { EditListing } from './SubmitListing'

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

function ActionMenu({ onEdit }: { onEdit: () => void }) {
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
          className="fixed w-36 bg-paper rounded-xl border border-line shadow-lg z-50 overflow-hidden"
          style={{ top: pos.top, left: pos.left }}
        >
          <button
            onClick={() => { onEdit(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs text-ink hover:bg-line/40 transition-colors cursor-pointer"
          >
            <Pencil size={12} /> Edit listing
          </button>
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

// ── DetailPanel (slide-over) ──────────────────────────────────────────────────

function DetailPanel({
  listing, tone, onClose, onEdit,
}: {
  listing: Listing; tone: string; onClose: () => void; onEdit: () => void
}) {
  const [imgIdx, setImgIdx] = useState(0)
  const imgs = listing.images ?? []

  const BOOLS: { key: keyof Listing; label: string }[] = [
    { key: 'seller_financing', label: 'Seller Financing'     },
    { key: 'hoa',              label: 'HOA Community'        },
    { key: 'tax_exempt',       label: 'CONFOTUR Tax Exempt'  },
    { key: 'gated_community',  label: 'Gated Community'      },
  ]

  const FIELDS: { key: keyof Listing; label: string; fmt?: (v: unknown) => string }[] = [
    { key: 'price',               label: 'Price',              fmt: v => fmtPrice(Number(v))           },
    { key: 'type',                label: 'Property Type',      fmt: v => fmtType(String(v))            },
    { key: 'transaction',         label: 'Transaction',        fmt: v => fmtType(String(v))            },
    { key: 'year_built',          label: 'Year Built'                                                  },
    { key: 'bedrooms',            label: 'Bedrooms'                                                    },
    { key: 'bathrooms',           label: 'Bathrooms'                                                   },
    { key: 'area_sqft',           label: 'Living Area (ft²)'                                           },
    { key: 'lot_size_sqft',       label: 'Lot Size (ft²)'                                              },
    { key: 'roi',                 label: 'Est. ROI (%)'                                                },
    { key: 'hoa_fee',             label: 'HOA Fee ($/mo)'                                              },
    { key: 'construction_status', label: 'Construction', fmt: v => String(v).replace(/_/g, ' ')       },
  ]

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-120 max-w-full bg-paper z-50 flex flex-col shadow-2xl">
        {/* Image carousel */}
        <div className="relative bg-black shrink-0" style={{ height: 220 }}>
          {imgs.length > 0 ? (
            <>
              <img src={imgs[imgIdx]} alt="" className="w-full h-full object-cover opacity-90" />
              {imgs.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {imgs.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className="w-1.5 h-1.5 rounded-full cursor-pointer transition-colors"
                        style={{ background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.45)' }}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: `${tone}22` }}>
              <Home size={48} style={{ color: tone }} className="opacity-60" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <div className="flex items-start gap-2 justify-between">
              <h2 className="text-[16px] font-bold text-ink leading-snug flex-1">{titleCase(listing.title)}</h2>
              <StatusChip status={listing.status} />
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[12px] text-dim">
              <MapPin size={12} />
              {listing.location}
            </div>
          </div>

          {listing.status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[12.5px] text-red-700">
              <span className="font-semibold">Rejected: </span>
              {listing.rejection_reason ?? 'No reason provided.'}
              <div className="mt-1.5 text-[11.5px] text-red-500">
                You can edit and resubmit this listing for review.
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {FIELDS.filter(({ key }) => {
              const v = listing[key]
              return v !== null && v !== undefined && v !== ''
            }).map(({ key, label, fmt }) => (
              <div key={key}>
                <div className="text-[10.5px] font-semibold text-dim uppercase tracking-wide">{label}</div>
                <div className="text-[13px] font-semibold text-ink mt-0.5">
                  {fmt ? fmt(listing[key]) : String(listing[key])}
                </div>
              </div>
            ))}
          </div>

          {BOOLS.some(b => listing[b.key] === true) && (
            <div className="flex flex-wrap gap-2">
              {BOOLS.filter(b => listing[b.key] === true).map(b => (
                <span
                  key={b.key}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  {b.label}
                </span>
              ))}
            </div>
          )}

          {listing.features?.length > 0 && (
            <div>
              <div className="text-[10.5px] font-semibold text-dim uppercase tracking-wide mb-2">Features</div>
              <div className="flex flex-wrap gap-1.5">
                {listing.features.map(f => (
                  <span key={f} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-line text-ink">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {listing.tag && (
            <div className="flex items-center gap-2 text-[12.5px] text-dim">
              <Tag size={13} />
              <span className="font-semibold text-ink">{listing.tag}</span>
            </div>
          )}

          {listing.maps_url && (
            <div className="flex items-center gap-2 text-[12.5px]">
              <Link2 size={13} className="text-dim shrink-0" />
              <a
                href={listing.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
              >
                View on Google Maps
              </a>
            </div>
          )}

          {listing.description && (
            <div>
              <div className="text-[10.5px] font-semibold text-dim uppercase tracking-wide mb-1.5">Description</div>
              {(() => {
                const raw = listing.description
                const html = raw.trimStart().startsWith('<') ? raw : `<p>${raw}</p>`
                const safe = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
                return <div className="detail-prose" dangerouslySetInnerHTML={{ __html: safe }} />
              })()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-line px-5 py-4 flex gap-3 shrink-0">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold text-white cursor-pointer"
            style={{ background: tone }}
          >
            <Pencil size={14} /> Edit Listing
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-ink border border-line bg-paper cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function RealtorListings({ tone, go }: { tone: string; go: (v: string) => void }) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState<'All' | 'Active' | 'Review' | 'Rejected' | 'Archived'>('All')
  const [query,    setQuery]    = useState('')
  const [selected, setSelected] = useState<Listing | null>(null)
  const [editing,  setEditing]  = useState(false)

  const filters = ['All', 'Active', 'Review', 'Rejected', 'Archived'] as const

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

  return (
    <>
      <div className="bg-paper rounded-2xl border border-line overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search listings…"
                className="pl-7 pr-3 py-1.5 text-xs rounded-lg border border-line bg-transparent text-ink placeholder:text-dim outline-none focus:border-brand transition-colors w-56"
              />
            </div>
            <button
              onClick={() => go('submit-listing')}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0"
              style={{ background: tone, color: '#fff', border: `1.5px solid ${tone}` }}
            >
              <Plus size={13} strokeWidth={2.5} />
              Add listing
            </button>
          </div>

          <div className="flex-1" />

          <div className="flex gap-1.5">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="py-1 px-3 rounded-full text-xs font-semibold cursor-pointer transition-colors"
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

        {/* Body */}
        {loading ? (
          <div className="py-10 text-center text-sm text-dim">Loading…</div>
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
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-5 py-3">Property</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Type</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Price</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Views</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Leads</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-dim">
                    {query.trim()
                      ? `No results for "${query}"`
                      : `No ${filter.toLowerCase()} listings.`}
                  </td>
                </tr>
              ) : (
                visible.map((l, i) => (
                  <tr
                    key={l.id}
                    onClick={() => { setSelected(l); setEditing(false) }}
                    className={`hover:bg-line/20 transition-colors cursor-pointer ${i < visible.length - 1 ? 'border-b border-line' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {l.images?.[0] ? (
                          <img
                            src={l.images[0]}
                            alt={l.title}
                            className="w-24 h-14 rounded-[10px] object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className="w-24 h-14 rounded-[10px] flex items-center justify-center shrink-0"
                            style={{ background: `${tone}18` }}
                          >
                            <Home size={22} style={{ color: tone }} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-ink truncate max-w-50">{titleCase(l.title)}</div>
                          <div className="text-[11px] text-dim truncate max-w-50">{l.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-ink">{fmtType(l.type)}</td>
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-ink">{fmtPrice(Number(l.price))}</td>
                    <td className="px-4 py-3.5"><StatusChip status={l.status} /></td>
                    <td className="px-4 py-3.5 text-[13px] text-ink">{l.view_count.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-[13px] text-ink">{l.leads_count.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-[13px] text-dim">{fmtRelative(l.updated_at)}</td>
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <ActionMenu onEdit={() => { setSelected(l); setEditing(true) }} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {selected && !editing && (
        <DetailPanel
          listing={selected}
          tone={tone}
          onClose={() => setSelected(null)}
          onEdit={() => setEditing(true)}
        />
      )}
    </>
  )
}
