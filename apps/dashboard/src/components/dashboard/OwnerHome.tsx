import { useState, useEffect } from 'react'
import { Home, Calendar, DollarSign, Bell, MessageCircle, Clock, Star, Pencil, UserCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, StatusPill, RoleKpiCard, fmtPrice } from './shared'
import { getMyListings, type Listing } from '../../api/listings'
import { getOwnerBookings, type Booking } from '../../api/bookings'
import { getOwnerInquiries, type Inquiry } from '../../api/inquiries'
import { getMyAgent } from '../../api/auth'

export const OWNER_KPIS: { label: string; value: string; sub: string; accent?: string }[] = [
  { label: 'Active Listings',    value: '—', sub: '' },
  { label: 'Upcoming Bookings',  value: '—', sub: '' },
  { label: 'Open Leads',         value: '—', sub: '' },
  { label: 'Revenue This Month', value: '—', sub: '', accent: '#f0a800' },
]

const STATUS_TONE_MAP: Record<string, string> = {
  active: '#1f7a3d', pending_approval: '#f0a800', rejected: '#e10f1f', archived: '#9ca3af',
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function fmtRelative(dateStr: string, t: (key: string, opts?: Record<string, unknown>) => string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)   return t('rel.just_now')
  if (mins < 60)  return t('rel.mins_ago', { count: mins })
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return t('rel.hrs_ago', { count: hrs })
  const days = Math.floor(hrs / 24)
  if (days < 30)  return t('rel.days_ago', { count: days })
  return t('rel.months_ago', { count: Math.floor(days / 30) })
}

function buildRevenueBar(bookings: Booking[]) {
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return { month: MONTH_SHORT[d.getMonth()], year: d.getFullYear(), monthIdx: d.getMonth(), rev: 0 }
  })
  for (const b of bookings) {
    if (b.status !== 'confirmed' || !b.total_price) continue
    const d = new Date(b.check_in)
    const slot = months.find(m => m.monthIdx === d.getMonth() && m.year === d.getFullYear())
    if (slot) slot.rev += b.total_price
  }
  return months
}

function avatarTone(name: string): string {
  const tones = ['#e10f1f', '#0b63ab', '#f0a800', '#7884a0', '#1f7a3d', '#9333ea']
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff
  return tones[h % tones.length]
}

export function OwnerHome({ go, tone }: { go: (v: string) => void; tone: string }) {
  const { t } = useTranslation('owner')
  const { t: tCommon } = useTranslation('common')

  const [myListings, setMyListings]   = useState<Listing[]>([])
  const [bookings, setBookings]       = useState<Booking[]>([])
  const [inquiries, setInquiries]     = useState<Inquiry[]>([])
  const [agent, setAgent] = useState<{ name: string; email: string; phone: string | null } | null>(null)
  const [loadingListings, setLoadingListings] = useState(true)
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [loadingInquiries, setLoadingInquiries] = useState(true)
  const [loadingAgent, setLoadingAgent] = useState(true)

  useEffect(() => {
    getMyListings().then(setMyListings).catch(() => {}).finally(() => setLoadingListings(false))
    getOwnerBookings().then(setBookings).catch(() => {}).finally(() => setLoadingBookings(false))
    getOwnerInquiries().then(setInquiries).catch(() => {}).finally(() => setLoadingInquiries(false))
    getMyAgent().then(d => {
      if (d.realtor_name) setAgent({ name: d.realtor_name, email: d.realtor_email ?? '', phone: d.realtor_phone ?? null })
    }).catch(() => {}).finally(() => setLoadingAgent(false))
  }, [])

  const activeCount = myListings.filter(l => l.status === 'active').length
  const today = new Date().toISOString().slice(0, 10)
  const upcomingBookings = bookings.filter(b => b.check_in >= today && b.status !== 'cancelled')
  const revenueBar = buildRevenueBar(bookings)
  const maxRev = Math.max(...revenueBar.map(d => d.rev), 1)
  const thisMonthRev = revenueBar[revenueBar.length - 1].rev

  const loading = loadingListings || loadingBookings || loadingInquiries
  const kpis = [
    {
      label: t('kpis.active_listings'),
      value: loading ? '…' : String(activeCount),
      sub:   loading ? '' : activeCount === 1 ? t('kpis.active_one') : t('kpis.active_many', { count: activeCount }),
    },
    {
      label: t('kpis.upcoming_bookings'),
      value: loading ? '…' : String(upcomingBookings.length),
      sub:   loading ? '' : upcomingBookings.length ? t('kpis.bookings_next', { date: upcomingBookings[0].check_in }) : t('kpis.bookings_none'),
    },
    {
      label: t('kpis.open_leads'),
      value: loading ? '…' : String(inquiries.length),
      sub:   loading ? '' : inquiries.length ? t('kpis.leads_count', { count: inquiries.length }) : t('kpis.leads_none'),
    },
    {
      label: t('kpis.revenue_month'),
      value: loading ? '…' : thisMonthRev ? `$${thisMonthRev.toLocaleString()}` : '$0',
      sub:   loading ? '' : t('kpis.revenue_sub'),
      accent: '#f0a800',
    },
  ]

  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-5 lg:grid-cols-4 lg:gap-4 lg:mb-6">
        {kpis.map((k, i) => <RoleKpiCard key={i} {...k} />)}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          <Card title={<><Home size={14} /> {t('listings.title')}</>} padded={false}
            action={<button onClick={() => go('listings')} className="text-xs font-bold bg-transparent border-none cursor-pointer" style={{ color: tone }}>{t('listings.manage')}</button>}>
            {loadingListings ? (
              <div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`flex items-center gap-3.5 py-3 px-5.5 animate-pulse ${i < 2 ? 'border-b border-line' : ''}`}>
                    <div className="w-11 h-11 rounded-lg bg-line-soft shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-line-soft rounded w-3/4" />
                      <div className="h-3 bg-line-soft rounded w-1/2" />
                    </div>
                    <div className="h-5 w-14 bg-line-soft rounded-full" />
                  </div>
                ))}
              </div>
            ) : myListings.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${tone}18` }}>
                  <Home size={20} style={{ color: tone }} />
                </div>
                <div className="text-center">
                  <div className="text-[13.5px] font-semibold text-ink mb-0.5">{t('listings.empty_heading')}</div>
                  <div className="text-[11.5px] text-dim">{t('listings.empty_sub')}</div>
                </div>
              </div>
            ) : (
              <div>
                {myListings.map((l, i) => (
                  <div key={l.id} className={`flex items-center gap-3.5 py-3 px-5.5 ${i < myListings.length - 1 ? 'border-b border-line' : ''}`}>
                    <div className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `${tone}25` }}>
                      <Home size={18} style={{ color: tone }} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[13.5px] font-semibold text-ink truncate">{l.title}</div>
                      <div className="text-[11.5px] text-dim mt-0.5">
                        {fmtPrice(l.price)} · {l.view_count.toLocaleString()} {t('listings.views')} · {l.leads_count} {t('listings.leads')}
                        {l.submitted_by_name && <span className="ml-1" style={{ color: tone }}>· {l.submitted_by_name}</span>}
                      </div>
                    </div>
                    <StatusPill label={tCommon(`status_labels.${l.status}`, { defaultValue: l.status })} tone={STATUS_TONE_MAP[l.status]} />
                  </div>
                ))}
                <div className="py-3 px-5.5">
                  <button onClick={() => go('listings')} className="text-[12.5px] font-bold bg-transparent border-none cursor-pointer p-0" style={{ color: tone }}>{t('listings.view_all')}</button>
                </div>
              </div>
            )}
          </Card>

          <Card title={<><DollarSign size={14} /> {t('revenue.title')}</>} sub={t('revenue.sub')}>
            {loadingBookings ? (
              <div className="flex items-end gap-2 h-27.5 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="h-3 w-full bg-line-soft rounded" />
                    <div className="w-full rounded-t-lg bg-line-soft" style={{ height: 40 }} />
                    <div className="h-3 w-4 bg-line-soft rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-end gap-2 h-27.5">
                {revenueBar.map((d, i) => {
                  const h = Math.max((d.rev / maxRev) * 80, d.rev > 0 ? 4 : 2)
                  const isLast = i === revenueBar.length - 1
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className={`text-[10px] ${isLast ? 'text-ink font-bold' : 'text-dim'}`}>
                        {d.rev > 0 ? `$${(d.rev / 1000).toFixed(1)}K` : '—'}
                      </div>
                      <div className="w-full rounded-t-lg" style={{ height: h, background: isLast ? tone : `${tone}50` }} />
                      <div className="text-[10px] text-dim">{d.month}</div>
                    </div>
                  )
                })}
              </div>
            )}
            <button onClick={() => go('earnings')} className="mt-3 text-[12.5px] font-semibold bg-transparent border-none cursor-pointer p-0" style={{ color: tone }}>
              {t('revenue.view_breakdown')}
            </button>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title={<><UserCircle size={14} /> {t('agent.title')}</>}>
            {loadingAgent ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-line-soft shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-line-soft rounded w-1/2" />
                  <div className="h-3 bg-line-soft rounded w-1/3" />
                </div>
              </div>
            ) : agent ? (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full shrink-0 grid place-items-center font-bold text-[15px] text-white"
                  style={{ background: tone }}
                >
                  {agent.name[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-[13.5px] font-bold text-ink">{agent.name}</div>
                  <div className="text-[11.5px] text-dim">{agent.email}</div>
                  {agent.phone && <div className="text-[11.5px] text-dim">{agent.phone}</div>}
                </div>
              </div>
            ) : (
              <div className="py-2 text-center">
                <UserCircle size={28} className="mx-auto mb-1.5 text-dim" />
                <div className="text-[13px] font-semibold text-ink mb-0.5">{t('agent.none_heading')}</div>
                <div className="text-[11.5px] text-dim">{t('agent.none_sub')}</div>
              </div>
            )}
          </Card>

          {!loadingListings && myListings.some(l => l.has_pending_deal_request || l.has_pending_edit) && (
            <Card title={<><Clock size={14} /> {t('pending_reviews.title')}</>} padded={false}
              action={<button onClick={() => go('listings')} className="text-xs font-bold bg-transparent border-none cursor-pointer" style={{ color: tone }}>{t('pending_reviews.all_listings')}</button>}>
              {myListings.filter(l => l.has_pending_deal_request || l.has_pending_edit).map((l, i, arr) => (
                <div key={l.id} className={`flex items-center gap-3 py-3 px-5.5 ${i < arr.length - 1 ? 'border-b border-line' : ''}`}>
                  <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `${tone}18` }}>
                    <Home size={16} style={{ color: tone }} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-[13px] font-semibold text-ink truncate">{l.title}</div>
                    <div className="flex gap-1.5 mt-0.75 flex-wrap">
                      {l.has_pending_deal_request && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-1.75 py-0.5 rounded-full" style={{ background: '#f0a80018', color: '#c07800' }}>
                          <Star size={9} fill="#f0a800" style={{ color: '#f0a800' }} /> {t('pending_reviews.deal_request')}
                        </span>
                      )}
                      {l.has_pending_edit && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-1.75 py-0.5 rounded-full" style={{ background: '#7c3aed18', color: '#7c3aed' }}>
                          <Pencil size={9} /> {t('pending_reviews.edit')}
                        </span>
                      )}
                    </div>
                  </div>
                  <Clock size={13} className="text-dim shrink-0" />
                </div>
              ))}
            </Card>
          )}

          <Card title={<><Bell size={14} /> {t('bookings.title')}</>} sub={t('bookings.sub')}
            action={<button onClick={() => go('bookings')} className="text-xs font-bold bg-transparent border-none cursor-pointer" style={{ color: tone }}>{t('bookings.all')}</button>}>
            {loadingBookings ? (
              <div className="flex flex-col gap-2.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="py-3 px-3.5 rounded-[10px] bg-[#F8F9FC] border border-line animate-pulse">
                    <div className="h-3.5 bg-line-soft rounded w-2/3 mb-2" />
                    <div className="h-3 bg-line-soft rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="py-8 flex flex-col items-center gap-2 text-center">
                <Calendar size={22} className="text-dim" />
                <div className="text-[13px] font-semibold text-ink">{t('bookings.empty_heading')}</div>
                <div className="text-[11.5px] text-dim">{t('bookings.empty_sub')}</div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {upcomingBookings.slice(0, 3).map((b, i) => (
                  <div key={i} className="py-3 px-3.5 rounded-[10px] bg-[#F8F9FC] border border-line">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-[13px] font-bold text-ink">{b.guest_name ?? t('bookings.guest_fallback')}</div>
                      <StatusPill label={t(`bookings_page.status_${b.status}`, { defaultValue: b.status.charAt(0).toUpperCase() + b.status.slice(1) })} />
                    </div>
                    <div className="text-[11.5px] text-dim truncate">{b.listing_title} · {b.check_in} → {b.check_out}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title={<><MessageCircle size={14} /> {t('leads_card.title')}</>}
            action={inquiries.length > 0 ? <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full" style={{ color: tone, background: `${tone}18` }}>{t('leads_card.total', { count: inquiries.length })}</span> : undefined}>
            {loadingInquiries ? (
              <div className="flex flex-col gap-2.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`flex items-start gap-2.5 pb-2.5 ${i < 2 ? 'border-b border-line' : ''} animate-pulse`}>
                    <div className="w-8.5 h-8.5 rounded-full bg-line-soft shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 bg-line-soft rounded w-1/2" />
                      <div className="h-3 bg-line-soft rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : inquiries.length === 0 ? (
              <div className="py-8 flex flex-col items-center gap-2 text-center">
                <MessageCircle size={22} className="text-dim" />
                <div className="text-[13px] font-semibold text-ink">{t('leads_card.empty_heading')}</div>
                <div className="text-[11.5px] text-dim">{t('leads_card.empty_sub')}</div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {inquiries.slice(0, 4).map((l, i) => (
                  <div key={i} className={`flex items-start gap-2.5 pb-2.5 ${i < Math.min(inquiries.length, 4) - 1 ? 'border-b border-line' : ''}`}>
                    <div className="w-8.5 h-8.5 rounded-full shrink-0 grid place-items-center font-bold text-[13px] text-white" style={{ background: avatarTone(l.name) }}>{l.name[0]}</div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[13px] font-bold text-ink">{l.name}</div>
                      <div className="text-xs text-ink2 leading-[1.35] mt-0.5 mb-0.75 line-clamp-2">{l.message}</div>
                      <div className="text-[11px] text-dim">{fmtRelative(l.created_at, t)}</div>
                    </div>
                  </div>
                ))}
                <button onClick={() => go('leads')} className="text-[12.5px] font-semibold bg-transparent border-none cursor-pointer p-0 text-left" style={{ color: tone }}>
                  {t('leads_card.view_all', { count: inquiries.length })}
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
