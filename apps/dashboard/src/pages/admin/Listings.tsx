import { useEffect, useState, useRef } from 'react'

const titleCase = (s: string) =>
  s === s.toUpperCase() ? s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : s

const sentenceCase = (s: string) =>
  s === s.toUpperCase() ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s
import {
  Check, X, Home, Search, MoreHorizontal, Archive,
  ChevronLeft, ChevronRight, MapPin,
  Tag, Link2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getAdminListings, approveAdminListing, rejectAdminListing, archiveAdminListing } from '../../api/admin'
import type { AdminListing } from '../../api/admin'
import { TONE } from './shared'

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string; accent: string }> = {
  pending_approval: { color: '#a16207', bg: '#fef9c3', label: 'Pending',  accent: '#f0a800' },
  active:           { color: '#15803d', bg: '#dcfce7', label: 'Active',   accent: '#1f7a3d' },
  rejected:         { color: '#b91c1c', bg: '#fee2e2', label: 'Rejected', accent: '#e10f1f' },
  archived:         { color: '#6b7280', bg: '#f3f4f6', label: 'Archived', accent: '#9ca3af' },
}

function fmtPrice(n: number) {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1_000)}K`
}

function fmtType(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
}

function StatusChip({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { color: '#6b7280', bg: '#f3f4f6', label: status }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

function ActionMenu({ onArchive }: { onArchive: () => void }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function toggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 6, left: r.right - 152 })
    }
    setOpen(v => !v)
  }

  return (
    <>
      <button ref={btnRef} onClick={toggle} className="w-7 h-7 flex items-center justify-center rounded-lg text-dim hover:text-ink hover:bg-line/50 transition-colors cursor-pointer">
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div ref={menuRef} className="fixed w-38 bg-paper rounded-xl border border-line shadow-lg z-50 overflow-hidden" style={{ top: pos.top, left: pos.left }}>
          <button onClick={() => { onArchive(); setOpen(false) }} className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
            <Archive size={12} />
            Archive
          </button>
        </div>
      )}
    </>
  )
}

function DetailPanel({
  listing,
  onClose,
  onApprove,
  onReject,
  onArchive,
  working,
}: {
  listing: AdminListing
  onClose: () => void
  onApprove: () => void
  onReject: (reason: string) => void
  onArchive: () => void
  working: boolean
}) {
  const [imgIdx, setImgIdx] = useState(0)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')
  const isPending = listing.status === 'pending_approval'
  const imgs = listing.images ?? []

  const FIELDS: { label: string; value: string | number | null | undefined }[] = [
    { label: 'Price',        value: fmtPrice(listing.price)                                          },
    { label: 'Property Type', value: fmtType(listing.type)                                           },
    { label: 'Transaction',  value: fmtType(listing.transaction)                                     },
    { label: 'Year Built',   value: listing.year_built                                               },
    { label: 'Bedrooms',     value: listing.bedrooms                                                 },
    { label: 'Bathrooms',    value: listing.bathrooms                                                },
    { label: 'Living Area (ft²)', value: listing.area_sqft                                          },
    { label: 'Lot Size (ft²)',    value: listing.lot_size_sqft                                      },
    { label: 'Est. ROI (%)', value: listing.roi                                                      },
    { label: 'HOA Fee ($/mo)', value: listing.hoa_fee                                               },
    { label: 'Construction', value: listing.construction_status?.replace(/_/g, ' ')                 },
  ].filter(f => f.value != null && f.value !== '')

  const boolBadges = [
    { label: 'Seller Financing', on: listing.seller_financing },
    { label: 'HOA Community',    on: listing.hoa              },
    { label: 'CONFOTUR Tax Exempt', on: listing.tax_exempt    },
    { label: 'Gated Community',  on: listing.gated_community  },
  ].filter(b => b.on)

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-140 max-w-full bg-paper z-50 flex flex-col shadow-2xl">
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
            <div className="w-full h-full flex items-center justify-center" style={{ background: `${TONE}22` }}>
              <Home size={48} style={{ color: TONE }} className="opacity-60" />
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
          {/* Title + status */}
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

          {/* Submitted by */}
          <div className="bg-line/30 rounded-xl px-4 py-3">
            <div className="text-[10.5px] font-semibold text-dim uppercase tracking-wide mb-1.5">Submitted by</div>
            <div className="text-[13px] font-semibold text-ink">{listing.submitted_by_name ?? '—'}</div>
            <div className="text-[11px] text-dim">{listing.submitted_by_email ?? ''}</div>
          </div>

          {/* Reviewed by */}
          {listing.reviewed_by_name && (
            <div className="bg-line/30 rounded-xl px-4 py-3">
              <div className="text-[10.5px] font-semibold text-dim uppercase tracking-wide mb-1.5">
                {listing.status === 'active'   ? 'Approved by'  :
                 listing.status === 'rejected' ? 'Rejected by'  :
                 listing.status === 'archived' ? 'Archived by'  : 'Reviewed by'}
              </div>
              <div className="text-[13px] font-semibold text-ink">{listing.reviewed_by_name}</div>
              <div className="text-[11px] text-dim">{listing.reviewed_by_email ?? ''}</div>
              {listing.reviewed_at && (
                <div className="text-[11px] text-dim mt-0.5">
                  {new Date(listing.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>
          )}

          {/* Fields grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {FIELDS.map(({ label, value }) => (
              <div key={label}>
                <div className="text-[10.5px] font-semibold text-dim uppercase tracking-wide">{label}</div>
                <div className="text-[13px] font-semibold text-ink mt-0.5">{String(value)}</div>
              </div>
            ))}
          </div>

          {/* Boolean badges */}
          {boolBadges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {boolBadges.map(b => (
                <span
                  key={b.label}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  {b.label}
                </span>
              ))}
            </div>
          )}

          {/* Features */}
          {listing.features && listing.features.length > 0 && (
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

          {/* Tag */}
          {listing.tag && (
            <div className="flex items-center gap-2 text-[12.5px] text-dim">
              <Tag size={13} />
              <span className="font-semibold text-ink">{listing.tag}</span>
            </div>
          )}

          {/* Maps URL */}
          {listing.maps_url && (
            <div className="flex items-center gap-2 text-[12.5px]">
              <Link2 size={13} className="text-dim shrink-0" />
              <a href={listing.maps_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                View on Google Maps
              </a>
            </div>
          )}

          {/* Description */}
          {listing.description && (
            <div>
              <div className="text-[10.5px] font-semibold text-dim uppercase tracking-wide mb-1.5">Description</div>
              <p className="text-[13px] text-ink leading-[1.6] whitespace-pre-wrap">{sentenceCase(listing.description)}</p>
            </div>
          )}

          {/* Reject input */}
          {rejectOpen && (
            <div className="flex gap-2">
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && reason.trim() && onReject(reason.trim())}
                placeholder="Reason for rejection…"
                className="flex-1 px-3 py-2 rounded-lg border border-line bg-white text-[13px] text-ink outline-none focus:border-red-400"
                autoFocus
              />
              <button
                onClick={() => { if (reason.trim()) onReject(reason.trim()) }}
                disabled={!reason.trim() || working}
                className="px-4 py-2 rounded-lg text-[12px] font-bold text-white disabled:opacity-50 cursor-pointer shrink-0"
                style={{ background: '#e10f1f' }}
              >
                Confirm
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-line px-5 py-4 flex gap-3 shrink-0">
          {isPending ? (
            <>
              <button
                onClick={onApprove}
                disabled={working}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold text-white cursor-pointer disabled:opacity-50"
                style={{ background: '#1f7a3d' }}
              >
                <Check size={14} strokeWidth={2.5} /> Approve
              </button>
              <button
                onClick={() => setRejectOpen(v => !v)}
                disabled={working}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold border border-line bg-paper text-ink cursor-pointer disabled:opacity-50"
              >
                <X size={14} strokeWidth={2.5} /> Reject
              </button>
            </>
          ) : (
            <button
              onClick={onArchive}
              disabled={working}
              className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-[13px] font-semibold border border-line text-red-500 hover:bg-red-50 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <Archive size={14} /> Archive listing
            </button>
          )}
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

export function AdminListings() {
  const [all, setAll]                   = useState<AdminListing[]>([])
  const [filter, setFilter]             = useState('All')
  const [query, setQuery]               = useState('')
  const [loading, setLoading]           = useState(true)
  const [rejectingId, setRejectingId]   = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [working, setWorking]           = useState(false)
  const [selected, setSelected]         = useState<AdminListing | null>(null)

  async function load() {
    setLoading(true)
    const data = await getAdminListings()
    setAll(data)
    setLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filters = ['All', 'Pending', 'Active', 'Rejected', 'Archived'] as const

  const afterFilter = filter === 'All' ? all : all.filter(l => {
    if (filter === 'Pending')  return l.status === 'pending_approval'
    if (filter === 'Active')   return l.status === 'active'
    if (filter === 'Rejected') return l.status === 'rejected'
    if (filter === 'Archived') return l.status === 'archived'
    return true
  })

  const visible = query.trim()
    ? afterFilter.filter(l =>
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.location.toLowerCase().includes(query.toLowerCase())
      )
    : afterFilter

  const counts = {
    pending:  all.filter(l => l.status === 'pending_approval').length,
    active:   all.filter(l => l.status === 'active').length,
    rejected: all.filter(l => l.status === 'rejected').length,
    archived: all.filter(l => l.status === 'archived').length,
  }

  async function handleApprove(id: string) {
    setWorking(true)
    await approveAdminListing(id)
    setSelected(null)
    await load()
    setWorking(false)
    toast.success('Listing approved.')
  }

  async function handleReject(id: string, reason: string) {
    setWorking(true)
    await rejectAdminListing(id, reason)
    setRejectingId(null)
    setRejectReason('')
    setSelected(null)
    await load()
    setWorking(false)
    toast.success('Listing rejected.')
  }

  async function handleArchive(id: string) {
    setWorking(true)
    await archiveAdminListing(id)
    setSelected(null)
    await load()
    setWorking(false)
    toast.success('Listing archived.')
  }

  const statCards: { key: keyof typeof counts; label: string; accent: string }[] = [
    { key: 'pending',  label: 'Pending',  accent: '#f0a800' },
    { key: 'active',   label: 'Active',   accent: '#1f7a3d' },
    { key: 'rejected', label: 'Rejected', accent: '#e10f1f' },
    { key: 'archived', label: 'Archived', accent: '#9ca3af' },
  ]

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {statCards.map(({ key, label, accent }) => (
          <div key={key} className="bg-paper border border-line rounded-xl px-4 py-3.5 flex items-center gap-3" style={{ borderLeft: `3px solid ${accent}` }}>
            <div>
              <div className="font-sans text-2xl font-bold text-ink leading-none">{counts[key]}</div>
              <div className="text-[11.5px] text-dim mt-1">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-paper rounded-2xl border border-line overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
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
          <div className="flex-1" />
          <div className="flex gap-1.5">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} className="py-1 px-3 rounded-full text-xs font-semibold cursor-pointer transition-colors" style={{ border: `1px solid ${filter === f ? TONE : '#e4ddcf'}`, background: filter === f ? TONE : 'transparent', color: filter === f ? '#fff' : '#33425f' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-12 text-center text-sm text-dim">Loading…</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-5 py-3">Property</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Type</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Price</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Submitted by</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Reviewed by</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-dim">
                    {query.trim() ? `No results for "${query}"` : 'No listings found.'}
                  </td>
                </tr>
              ) : (
                visible.map((l, i) => {
                  const isPending = l.status === 'pending_approval'
                  const isRejectOpen = rejectingId === l.id
                  const isLast = i === visible.length - 1

                  return (
                    <>
                      <tr key={l.id} onClick={() => setSelected(l)} className={`hover:bg-line/20 transition-colors cursor-pointer ${!isLast || isRejectOpen ? 'border-b border-line' : ''}`}>
                        {/* Property */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {l.images?.[0] ? (
                              <img src={l.images[0]} alt={l.title} className="w-24 h-14 rounded-[10px] object-cover shrink-0" />
                            ) : (
                              <div className="w-24 h-14 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: `${TONE}18` }}>
                                <Home size={20} style={{ color: TONE }} />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="text-[13px] font-semibold text-ink truncate max-w-55 hover:underline">{titleCase(l.title)}</div>
                              <div className="flex items-center gap-1 text-[11px] text-dim truncate max-w-55">
                                <MapPin size={10} />{l.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* Type */}
                        <td className="px-4 py-3.5 text-[13px] text-ink">{fmtType(l.type)}</td>
                        {/* Price */}
                        <td className="px-4 py-3.5 text-[13px] font-semibold text-ink">{fmtPrice(l.price)}</td>
                        {/* Status */}
                        <td className="px-4 py-3.5"><StatusChip status={l.status} /></td>
                        {/* Submitted by */}
                        <td className="px-4 py-3.5">
                          <div className="text-[13px] font-semibold text-ink leading-tight">{l.submitted_by_name ?? '—'}</div>
                          <div className="text-[11px] text-dim mt-0.5">{l.submitted_by_email ?? ''}</div>
                        </td>
                        {/* Reviewed by */}
                        <td className="px-4 py-3.5">
                          {l.reviewed_by_name ? (
                            <>
                              <div className="text-[13px] font-semibold text-ink leading-tight">{l.reviewed_by_name}</div>
                              <div className="text-[11px] text-dim mt-0.5 capitalize">
                                {l.status === 'active' ? 'Approved' : l.status === 'rejected' ? 'Rejected' : 'Archived'}
                                {l.reviewed_at && ` · ${new Date(l.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                              </div>
                            </>
                          ) : (
                            <span className="text-[12px] text-dim">—</span>
                          )}
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            {isPending ? (
                              <>
                                <button onClick={() => handleApprove(l.id)} disabled={working} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white cursor-pointer disabled:opacity-50 shrink-0" style={{ background: '#1f7a3d' }}>
                                  <Check size={12} strokeWidth={2.5} /> Approve
                                </button>
                                <button onClick={() => { setRejectingId(isRejectOpen ? null : l.id); setRejectReason('') }} disabled={working} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-ink border border-line bg-paper cursor-pointer disabled:opacity-50 shrink-0">
                                  <X size={12} strokeWidth={2.5} /> Reject
                                </button>
                              </>
                            ) : (
                              <ActionMenu onArchive={() => handleArchive(l.id)} />
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Inline reject reason row */}
                      {isRejectOpen && (
                        <tr key={`${l.id}-reject`} className={!isLast ? 'border-b border-line' : ''}>
                          <td colSpan={7} className="px-5 pb-4 pt-0">
                            <div className="flex gap-2 ml-30">
                              <input
                                type="text"
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleReject(l.id, rejectReason.trim())}
                                placeholder="Reason for rejection…"
                                className="flex-1 px-3 py-2 rounded-lg border border-line bg-white text-[13px] text-ink outline-none focus:border-red-400"
                                autoFocus
                              />
                              <button onClick={() => handleReject(l.id, rejectReason.trim())} disabled={!rejectReason.trim() || working} className="px-4 py-2 rounded-lg text-[12px] font-bold text-white cursor-pointer disabled:opacity-50 shrink-0" style={{ background: '#e10f1f' }}>
                                Confirm
                              </button>
                              <button onClick={() => { setRejectingId(null); setRejectReason('') }} className="px-3 py-2 rounded-lg text-[12px] text-dim border border-line bg-paper cursor-pointer shrink-0">
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail slide-over */}
      {selected && (
        <DetailPanel
          listing={selected}
          onClose={() => setSelected(null)}
          onApprove={() => handleApprove(selected.id)}
          onReject={(reason) => handleReject(selected.id, reason)}
          onArchive={() => handleArchive(selected.id)}
          working={working}
        />
      )}
    </div>
  )
}
