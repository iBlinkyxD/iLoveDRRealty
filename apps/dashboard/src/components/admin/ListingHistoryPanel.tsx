import { useEffect, useState } from 'react'
import {
  X, CheckCircle2, XCircle, Archive, Send, GitCompare, Clock, ChevronDown, ChevronUp,
} from 'lucide-react'
import { getListingHistory } from '../../api/admin'
import type { ListingEvent } from '../../api/admin'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtRelative(dateStr: string): string {
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

function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

// ── Event metadata ─────────────────────────────────────────────────────────────

type EventMeta = {
  label: string
  Icon: typeof CheckCircle2
  color: string
  bg: string
}

const EVENT_META: Record<string, EventMeta> = {
  submitted:      { label: 'Submitted',        Icon: Send,          color: '#0ea5e9', bg: '#e0f2fe' },
  approved:       { label: 'Approved',          Icon: CheckCircle2,  color: '#16a34a', bg: '#dcfce7' },
  rejected:       { label: 'Rejected',          Icon: XCircle,       color: '#dc2626', bg: '#fee2e2' },
  archived:       { label: 'Archived',          Icon: Archive,       color: '#6b7280', bg: '#f3f4f6' },
  edit_submitted: { label: 'Edit Submitted',    Icon: GitCompare,    color: '#7c3aed', bg: '#ede9fe' },
  edit_approved:  { label: 'Edit Approved',     Icon: CheckCircle2,  color: '#16a34a', bg: '#dcfce7' },
  edit_rejected:  { label: 'Edit Rejected',     Icon: XCircle,       color: '#dc2626', bg: '#fee2e2' },
}
const DEFAULT_META: EventMeta = { label: 'Event', Icon: Clock, color: '#6b7280', bg: '#f3f4f6' }

// ── Diff labels (mirrors ListingEditDiffPanel) ─────────────────────────────────

const DIFF_LABELS: Record<string, string> = {
  title: 'Title', type: 'Type', transaction: 'Transaction', price: 'Price',
  location: 'Region', description: 'Description', bedrooms: 'Bedrooms',
  bathrooms: 'Bathrooms', area_sqft: 'Living Area (ft²)', lot_size_sqft: 'Lot Size (ft²)',
  roi: 'Est. ROI (%)', seller_financing: 'Seller Financing', hoa: 'HOA Community',
  hoa_fee: 'HOA Fee ($/mo)', tax_exempt: 'CONFOTUR Tax Exempt',
  gated_community: 'Gated Community', construction_status: 'Construction Status',
  year_built: 'Year Built', features: 'Features', maps_url: 'Google Maps URL',
  latitude: 'Latitude', longitude: 'Longitude', tag: 'Tag', images: 'Photos',
  tags: 'Tags', video_links: 'Video Links', tour_3d_url: '3D Tour URL',
  utilities: 'Utilities', included_utilities: 'What is Included',
  association_fee: 'Assoc. Fee ($/mo)', deposit_policy: 'Deposit Policy',
}

const ARRAY_FIELDS = new Set(['features', 'images', 'tags', 'video_links', 'included_utilities'])

function formatVal(key: string, val: unknown): string {
  if (val == null) return '—'
  if (key === 'price' || key === 'association_fee') return `$${Number(val).toLocaleString()}`
  if (ARRAY_FIELDS.has(key)) return Array.isArray(val) ? (val as unknown[]).join(', ') || '—' : '—'
  if (typeof val === 'boolean') return val ? 'Yes' : 'No'
  return String(val)
}

function getChangedKeys(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): string[] {
  return Object.keys(DIFF_LABELS).filter(key => {
    const a = before[key], b = after[key]
    if (ARRAY_FIELDS.has(key)) return JSON.stringify(a ?? []) !== JSON.stringify(b ?? [])
    return String(a ?? '') !== String(b ?? '')
  })
}

// ── Inline diff table ──────────────────────────────────────────────────────────

function InlineDiff({ before, after }: { before: Record<string, unknown>; after: Record<string, unknown> }) {
  const changed = getChangedKeys(before, after)
  if (changed.length === 0) return <p className="text-[12px] text-dim">No field changes detected.</p>
  return (
    <div className="mt-3 rounded-xl border border-line overflow-hidden">
      <div className="grid grid-cols-[1fr_1fr_1fr] px-3 py-2 bg-nav/5 border-b border-line">
        <div className="text-[10px] font-bold uppercase tracking-wide text-dim">Field</div>
        <div className="text-[10px] font-bold uppercase tracking-wide text-dim">Before</div>
        <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#d97706' }}>After</div>
      </div>
      <div className="divide-y divide-line-soft">
        {changed.map(key => (
          <div key={key} className="grid grid-cols-[1fr_1fr_1fr] px-3 py-2 items-start">
            <div className="text-[11.5px] font-semibold text-ink">{DIFF_LABELS[key]}</div>
            <div className="text-[11.5px] text-dim line-clamp-2 wrap-break-words">{formatVal(key, before[key])}</div>
            <div className="text-[11.5px] font-medium line-clamp-2 wrap-break-words" style={{ color: '#d97706' }}>{formatVal(key, after[key])}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Event row ─────────────────────────────────────────────────────────────────

function EventRow({ event }: { event: ListingEvent }) {
  const [expanded, setExpanded] = useState(false)
  const meta = EVENT_META[event.event_type] ?? DEFAULT_META
  const { Icon } = meta
  const hasDiff = (event.event_type === 'edit_approved') && event.snapshot_before && event.snapshot_after

  return (
    <div className="flex gap-3">
      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background: meta.bg }}
        >
          <Icon size={13} style={{ color: meta.color }} />
        </div>
        <div className="w-px flex-1 bg-line-soft mt-1" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2 py-0.5 rounded-full text-[10.5px] font-bold"
            style={{ background: meta.bg, color: meta.color }}
          >
            {meta.label}
          </span>
          {event.actor_name && (
            <span className="text-[12px] text-ink font-semibold truncate">{event.actor_name}</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-dim" title={fmtDate(event.created_at)}>
            {fmtRelative(event.created_at)}
          </span>
          <span className="text-[11px] text-dim">·</span>
          <span className="text-[11px] text-dim">{fmtDate(event.created_at)}</span>
        </div>

        {event.note && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-[12px] text-red-700">
            {event.note}
          </div>
        )}

        {hasDiff && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold cursor-pointer"
            style={{ color: '#d97706' }}
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Hide changes' : `Show changes (${getChangedKeys(event.snapshot_before!, event.snapshot_after!).length} fields)`}
          </button>
        )}

        {hasDiff && expanded && (
          <InlineDiff before={event.snapshot_before!} after={event.snapshot_after!} />
        )}
      </div>
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────

interface Props {
  listingId: string
  listingTitle: string
  onClose: () => void
}

export function ListingHistoryPanel({ listingId, listingTitle, onClose }: Props) {
  const [events, setEvents] = useState<ListingEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getListingHistory(listingId).then(data => {
      setEvents(data)
      setLoading(false)
    })
  }, [listingId])

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-120 max-w-full bg-paper z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-line shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sky-50">
            <Clock size={15} className="text-sky-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-ink truncate">{listingTitle}</div>
            <div className="text-[11px] text-dim">Listing History</div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-dim hover:text-ink hover:bg-line/50 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-7 h-7 rounded-full bg-line-soft shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-line-soft rounded w-1/3" />
                    <div className="h-3 bg-line-soft rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="py-12 text-center text-sm text-dim">No history recorded yet.</div>
          ) : (
            <div>
              {events.map(ev => <EventRow key={ev.id} event={ev} />)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
