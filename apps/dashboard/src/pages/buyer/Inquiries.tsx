import { useEffect, useState } from 'react'
import { MessageCircle, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/dashboard/shared'
import { getMyLeads, type Lead } from '../../api/leads'

const LANDING_URL = import.meta.env.VITE_LANDING_URL ?? 'https://ilovedrrealty.com'

const STATUS_COLOR: Record<string, string> = {
  new: '#64748b',
  assigned: '#0d9488',
  contacted: '#1f7a3d',
  closed: '#94a3b8',
}

function fmtRelative(iso: string, t: (key: string, opts?: Record<string, unknown>) => string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return t('rel.just_now')
  if (m < 60) return t('rel.mins_ago', { count: m })
  const h = Math.floor(m / 60)
  if (h < 24) return t('rel.hrs_ago', { count: h })
  const d = Math.floor(h / 24)
  if (d < 30) return t('rel.days_ago', { count: d })
  return t('rel.months_ago', { count: Math.floor(d / 30) })
}

export function Inquiries() {
  const { t } = useTranslation('buyer')
  const [inquiries, setInquiries] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyLeads()
      .then(data => setInquiries(data.filter(l => l.type === 'property_inquiry')))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card title={<><MessageCircle size={14} />{t('inquiries_page.title')}</>} padded={false}>
      {loading ? (
        <div className="px-5 py-8 text-[13px] text-dim text-center">{t('inquiries_page.loading')}</div>
      ) : inquiries.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: '#e10f1f18' }}>
            <MessageCircle size={20} style={{ color: '#e10f1f' }} />
          </div>
          <div className="text-center">
            <div className="text-[13.5px] font-semibold text-ink mb-0.5">{t('inquiries_page.empty_title')}</div>
            <div className="text-[11.5px] text-dim">{t('inquiries_page.empty_sub')}</div>
          </div>
          <a
            href={`${LANDING_URL}/search`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 py-1.75 px-4 rounded-full text-[12.5px] font-bold cursor-pointer border-0 text-white"
            style={{ background: '#e10f1f' }}
          >
            <Search size={13} strokeWidth={2.5} /> {t('inquiries.browse')}
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[t('inquiries_page.table_property'), t('inquiries_page.table_message'), t('inquiries_page.table_sent'), t('inquiries_page.table_status')].map((h, i) => (
                  <th key={i} className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-[.07em] text-dim text-left border-b border-line">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq, i) => (
                <tr key={inq.id}>
                  <td className={`px-5 py-3 text-[13px] text-ink font-semibold max-w-45 truncate ${i < inquiries.length - 1 ? 'border-b border-line' : ''}`}>
                    {inq.property_title ?? t('inquiries.general_inquiry')}
                  </td>
                  <td className={`px-5 py-3 text-[13px] text-ink2 max-w-55 truncate ${i < inquiries.length - 1 ? 'border-b border-line' : ''}`}>
                    {inq.message ?? '—'}
                  </td>
                  <td className={`px-5 py-3 text-[13px] text-dim whitespace-nowrap ${i < inquiries.length - 1 ? 'border-b border-line' : ''}`}>
                    {fmtRelative(inq.created_at, t)}
                  </td>
                  <td className={`px-5 py-3 ${i < inquiries.length - 1 ? 'border-b border-line' : ''}`}>
                    <span
                      className="inline-flex items-center px-2.5 py-0.75 rounded-full text-[11.5px] font-semibold capitalize"
                      style={{
                        background: `${STATUS_COLOR[inq.status] ?? '#64748b'}15`,
                        color: STATUS_COLOR[inq.status] ?? '#64748b',
                      }}
                    >
                      {inq.status === 'new' ? t('inquiries_page.status_pending') : inq.status}
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
