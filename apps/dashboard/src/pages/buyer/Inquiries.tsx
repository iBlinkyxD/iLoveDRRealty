import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Card, StatusPill } from '../../components/dashboard/shared'
import { getMyInquiries, type Inquiry } from '../../api/inquiries'

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
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyInquiries()
      .then(setInquiries)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card title={<><MessageCircle size={14} />My Inquiries</>} padded={false}>
      {loading ? (
        <div className="px-5 py-8 text-[13px] text-dim text-center">Loading…</div>
      ) : inquiries.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <MessageCircle size={28} className="text-dim mx-auto mb-2" />
          <p className="text-[13px] text-dim">No inquiries yet.</p>
          <p className="text-[12px] text-dim mt-0.5">Message an agent from any property page to get started.</p>
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
                    {inq.listing_title ?? 'General inquiry'}
                  </td>
                  <td className={`px-5 py-3 text-[13px] text-ink2 max-w-55 truncate ${i < inquiries.length - 1 ? 'border-b border-line' : ''}`}>
                    {inq.message}
                  </td>
                  <td className={`px-5 py-3 text-[13px] text-dim whitespace-nowrap ${i < inquiries.length - 1 ? 'border-b border-line' : ''}`}>
                    {fmtRelative(inq.created_at)}
                  </td>
                  <td className={`px-5 py-3 ${i < inquiries.length - 1 ? 'border-b border-line' : ''}`}>
                    <StatusPill label="Pending" />
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
