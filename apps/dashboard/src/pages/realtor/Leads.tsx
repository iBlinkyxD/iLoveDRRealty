import { useEffect, useState } from 'react'
import { ClipboardList, Plus } from 'lucide-react'
import { Card } from '../../components/dashboard/shared'
import { getRealtorInquiries, type Inquiry } from '../../api/inquiries'

const TONE = '#1f7a3d'

function fmtRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return `${Math.floor(d / 30)}mo ago`
}

export function RealtorLeads({ go }: { go?: (v: string) => void }) {
  const [leads, setLeads] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRealtorInquiries()
      .then(data => setLeads(data.sort((a, b) => b.created_at.localeCompare(a.created_at))))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card
      title={<><ClipboardList size={14} /> All Leads{!loading && leads.length > 0 && ` (${leads.length})`}</>}
      padded={false}
    >
      {loading ? (
        <div className="divide-y divide-line">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_80px] gap-3 py-3 px-5.5 animate-pulse">
              <div className="h-3.5 bg-line-soft rounded w-3/4" />
              <div className="h-3.5 bg-line-soft rounded w-1/2" />
              <div className="h-3.5 bg-line-soft rounded w-2/3" />
              <div className="h-5 bg-line-soft rounded-full w-14" />
            </div>
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="py-12 flex flex-col items-center gap-3 text-center px-6">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${TONE}18` }}>
            <ClipboardList size={20} style={{ color: TONE }} />
          </div>
          <div>
            <div className="text-[13.5px] font-semibold text-ink mb-0.5">No leads yet</div>
            <div className="text-[11.5px] text-dim">Add a listing so buyers can inquire about your properties.</div>
          </div>
          <button
            onClick={() => go?.('submit-listing')}
            className="flex items-center gap-1.5 py-1.75 px-4 rounded-full text-[12.5px] font-bold cursor-pointer border-0 text-white"
            style={{ background: TONE }}
          >
            <Plus size={13} strokeWidth={2.5} /> Add a listing
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-[1fr_1fr_1.5fr_90px] gap-3 py-2.5 px-5.5 border-b border-line">
              {['Name', 'Property', 'Message', 'Time'].map((h, i) => (
                <div key={i} className="text-[11.5px] font-bold text-dim uppercase tracking-[.06em]">{h}</div>
              ))}
            </div>
            {leads.map((l, i) => (
              <div
                key={l.id}
                className={`grid grid-cols-[1fr_1fr_1.5fr_90px] gap-3 py-3 px-5.5 items-center ${i < leads.length - 1 ? 'border-b border-line' : ''}`}
              >
                <div>
                  <div className="text-[13.5px] font-semibold text-ink truncate">{l.name}</div>
                  <div className="text-[11px] text-dim truncate">{l.email}</div>
                </div>
                <div className="text-[13px] text-ink2 truncate">{l.listing_title ?? 'General inquiry'}</div>
                <div className="text-[12.5px] text-ink2 truncate">{l.message}</div>
                <div className="text-xs text-dim">{fmtRelative(l.created_at)}</div>
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-line">
            {leads.map(l => (
              <div key={l.id} className="px-4 py-3.5 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[13.5px] font-semibold text-ink">{l.name}</div>
                  <div className="text-[11px] text-dim shrink-0">{fmtRelative(l.created_at)}</div>
                </div>
                <div className="text-[11.5px] text-dim">{l.listing_title ?? 'General inquiry'}</div>
                <div className="text-[12px] text-ink2 line-clamp-2">{l.message}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}
