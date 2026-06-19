import { useState } from 'react'
import { Check, X, MapPin, GitCompare } from 'lucide-react'
import type { AdminListingEdit } from '../../api/admin'
import { TONE } from '../../pages/admin/shared'

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

interface Props {
  edit: AdminListingEdit
  working: boolean
  onApprove: () => void
  onReject: (reason: string) => void
  onClose: () => void
}

export function ListingEditDiffPanel({ edit, working, onApprove, onReject, onClose }: Props) {
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')

  const changed = Object.keys(DIFF_LABELS).filter(key => {
    const cur  = edit.current_data[key]
    const prop = edit.proposed_data[key]
    if (ARRAY_FIELDS.has(key)) return JSON.stringify(cur) !== JSON.stringify(prop)
    return String(cur ?? '') !== String(prop ?? '')
  })

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-150 max-w-full bg-paper z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-line shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${TONE}18` }}>
            <GitCompare size={15} style={{ color: TONE }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-ink truncate">{edit.listing_title}</div>
            <div className="flex items-center gap-1 text-[11px] text-dim"><MapPin size={10} />{edit.listing_location}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-dim hover:text-ink hover:bg-line/50 transition-colors cursor-pointer">
            <X size={14} />
          </button>
        </div>

        {/* Submitter */}
        <div className="px-5 py-3 bg-line/20 border-b border-line shrink-0 flex items-center justify-between">
          <div>
            <div className="text-[10.5px] font-semibold text-dim uppercase tracking-wide">Submitted by</div>
            <div className="text-[13px] font-semibold text-ink">{edit.submitted_by_name ?? '—'}</div>
            <div className="text-[11px] text-dim">{edit.submitted_by_email ?? ''}</div>
          </div>
          <div className="text-right">
            <div className="text-[10.5px] font-semibold text-dim uppercase tracking-wide">Submitted</div>
            <div className="text-[12px] text-ink">{fmtRelative(edit.submitted_at)}</div>
          </div>
        </div>

        {/* Diff body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {changed.length === 0 ? (
            <div className="text-center py-10 text-sm text-dim">No field changes detected.</div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 text-[10px] font-semibold text-dim uppercase tracking-wide pb-1 border-b border-line">
                <div>Field</div>
                <div>Current (live)</div>
                <div style={{ color: TONE }}>Proposed</div>
              </div>
              {changed.map(key => {
                const cur  = formatVal(key, edit.current_data[key])
                const prop = formatVal(key, edit.proposed_data[key])
                return (
                  <div key={key} className="grid grid-cols-[1fr_1fr_1fr] gap-2 py-2 border-b border-line/50 items-start">
                    <div className="text-[12px] font-semibold text-ink">{DIFF_LABELS[key]}</div>
                    <div className="text-[12px] text-dim line-clamp-3 wrap-break-word">{cur}</div>
                    <div className="text-[12px] font-medium wrap-break-word line-clamp-3" style={{ color: TONE }}>{prop}</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Photos diff */}
          {(() => {
            const curImgs  = (edit.current_data.images  as string[] | null) ?? []
            const propImgs = (edit.proposed_data.images as string[] | null) ?? []
            if (JSON.stringify(curImgs) === JSON.stringify(propImgs)) return null
            return (
              <div className="mt-4">
                <div className="text-[10.5px] font-semibold text-dim uppercase tracking-wide mb-2">Photos comparison</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] text-dim mb-1.5">Current ({curImgs.length})</div>
                    <div className="grid grid-cols-3 gap-1">
                      {curImgs.slice(0, 6).map((u, i) => <img key={i} src={u} alt="" className="w-full h-14 object-cover rounded-lg" />)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] mb-1.5 font-medium" style={{ color: TONE }}>Proposed ({propImgs.length})</div>
                    <div className="grid grid-cols-3 gap-1">
                      {propImgs.slice(0, 6).map((u, i) => <img key={i} src={u} alt="" className="w-full h-14 object-cover rounded-lg" />)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Reject input */}
          {rejectOpen && (
            <div className="mt-4 flex gap-2">
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

        {/* Footer */}
        <div className="border-t border-line px-5 py-4 flex gap-3 shrink-0">
          <button
            onClick={onApprove}
            disabled={working}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold text-white cursor-pointer disabled:opacity-50"
            style={{ background: '#1f7a3d' }}
          >
            <Check size={14} strokeWidth={2.5} /> Approve & Go Live
          </button>
          <button
            onClick={() => setRejectOpen(v => !v)}
            disabled={working}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold border border-line bg-paper text-ink cursor-pointer disabled:opacity-50"
          >
            <X size={14} strokeWidth={2.5} /> Reject Edit
          </button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-ink border border-line bg-paper cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </>
  )
}
