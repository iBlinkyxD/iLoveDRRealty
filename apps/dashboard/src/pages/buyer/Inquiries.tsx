import { useEffect, useState } from 'react'
import { MessageCircle, Search } from 'lucide-react'
import { Card } from '../../components/dashboard/shared'
import { getMyLeads, type Lead } from '../../api/leads'

const LANDING_URL = import.meta.env.VITE_LANDING_URL ?? 'https://ilovedrrealty.com'

const STATUS_COLOR: Record<string, string> = {
  new: '#64748b',
  assigned: '#0d9488',
  contacted: '#1f7a3d',
  closed: '#94a3b8',
}

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

export function Inquiries() {
  const [inquiries, setInquiries] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyLeads()
      .then(data => setInquiries(data.filter(l => l.type === 'property_inquiry')))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card title={<><MessageCircle size={14} />My Inquiries</>} padded={false}>
      {loading ? (
        <div className="px-5 py-8 text-[13px] text-dim text-center">Loading…</div>
      ) : inquiries.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: '#e10f1f18' }}>
            <MessageCircle size={20} style={{ color: '#e10f1f' }} />
          </div>
          <div className="text-center">
            <div className="text-[13.5px] font-semibold text-ink mb-0.5">No inquiries yet</div>
            <div className="text-[11.5px] text-dim">Find a listing and reach out to get started.</div>
          </div>
          <a
            href={`${LANDING_URL}/search`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 py-1.75 px-4 rounded-full text-[12.5px] font-bold cursor-pointer border-0 text-white"
            style={{ background: '#e10f1f' }}
          >
            <Search size={13} strokeWidth={2.5} /> Browse listings
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Property', 'Message', 'Sent', 'Status'].map((h, i) => (
                  <th key={i} className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-[.07em] text-dim text-left border-b border-line">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq, i) => (
                <tr key={inq.id}>
                  <td className={`px-5 py-3 text-[13px] text-ink font-semibold max-w-45 truncate ${i < inquiries.length - 1 ? 'border-b border-line' : ''}`}>
                    {inq.property_title ?? 'General inquiry'}
                  </td>
                  <td className={`px-5 py-3 text-[13px] text-ink2 max-w-55 truncate ${i < inquiries.length - 1 ? 'border-b border-line' : ''}`}>
                    {inq.message ?? '—'}
                  </td>
                  <td className={`px-5 py-3 text-[13px] text-dim whitespace-nowrap ${i < inquiries.length - 1 ? 'border-b border-line' : ''}`}>
                    {fmtRelative(inq.created_at)}
                  </td>
                  <td className={`px-5 py-3 ${i < inquiries.length - 1 ? 'border-b border-line' : ''}`}>
                    <span
                      className="inline-flex items-center px-2.5 py-0.75 rounded-full text-[11.5px] font-semibold capitalize"
                      style={{
                        background: `${STATUS_COLOR[inq.status] ?? '#64748b'}15`,
                        color: STATUS_COLOR[inq.status] ?? '#64748b',
                      }}
                    >
                      {inq.status === 'new' ? 'Pending' : inq.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
