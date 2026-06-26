import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/dashboard/shared'
import { getOwnerInquiries, type Inquiry } from '../../api/inquiries'

const TONE = '#f0a800'

const AVATAR_TONES = ['#e10f1f', '#0b63ab', '#f0a800', '#7884a0', '#1f7a3d', '#9333ea']
function avatarTone(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff
  return AVATAR_TONES[h % AVATAR_TONES.length]
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

export function OwnerLeads({ tone, go }: { tone: string; go?: (v: string) => void }) {
  const { t } = useTranslation('owner')
  const [leads, setLeads] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOwnerInquiries()
      .then(data => setLeads(data.sort((a, b) => b.created_at.localeCompare(a.created_at))))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card
      title={<><MessageCircle size={14} /> {t('leads_page.title')}{!loading && leads.length > 0 && ` (${leads.length})`}</>}
      padded={false}
    >
      {loading ? (
        <div className="divide-y divide-line">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 py-3.5 px-5.5 animate-pulse">
              <div className="w-9.5 h-9.5 rounded-full bg-line-soft shrink-0" />
              <div className="flex-1 space-y-2 py-0.5">
                <div className="h-3.5 bg-line-soft rounded w-1/3" />
                <div className="h-3 bg-line-soft rounded w-3/4" />
                <div className="h-3 bg-line-soft rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="py-12 flex flex-col items-center gap-3 text-center px-6">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${TONE}18` }}>
            <MessageCircle size={20} style={{ color: TONE }} />
          </div>
          <div>
            <div className="text-[13.5px] font-semibold text-ink mb-0.5">{t('leads_page.empty_title')}</div>
            <div className="text-[11.5px] text-dim">{t('leads_page.empty_sub')}</div>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {leads.map((l) => (
            <div key={l.id} className="flex items-start gap-3 py-3.5 px-5.5">
              <div
                className="w-9.5 h-9.5 rounded-full shrink-0 grid place-items-center font-bold text-sm text-white"
                style={{ background: avatarTone(l.name) }}
              >
                {l.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold text-ink">{l.name}</div>
                    <div className="text-[12.5px] text-ink2 leading-[1.35] my-0.75 line-clamp-2">{l.message}</div>
                    <div className="text-[11.5px] text-dim truncate">
                      {l.listing_title ?? t('leads_page.general_inquiry')} · {fmtRelative(l.created_at, t)}
                    </div>
                  </div>
                  <a
                    href={`mailto:${l.email}`}
                    className="text-xs font-bold py-1.5 px-3.5 rounded-lg border-none text-white cursor-pointer shrink-0 no-underline"
                    style={{ background: tone }}
                  >
                    {t('leads_page.reply')}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
