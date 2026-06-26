import { useEffect, useState } from 'react'
import { DollarSign } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, RoleKpiCard } from '../../components/dashboard/shared'
import { getOwnerBookings, type Booking } from '../../api/bookings'

const TONE = '#f0a800'

function fmtMoney(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`
  return `$${n.toLocaleString()}`
}

function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7) // "YYYY-MM"
}

function last6Months(): { key: string; label: string }[] {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-US', { month: 'short' }),
    }
  })
}

function deriveStats(bookings: Booking[]) {
  const confirmed = bookings.filter(b => b.status === 'confirmed' && b.total_price != null)
  const now = new Date()
  const thisYear = now.getFullYear().toString()
  const thisMonthKey = monthKey(now.toISOString())
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthKey = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`

  const totalThisYear = confirmed
    .filter(b => b.check_in.startsWith(thisYear))
    .reduce((s, b) => s + (b.total_price ?? 0), 0)

  const thisMonth = confirmed
    .filter(b => monthKey(b.check_in) === thisMonthKey)
    .reduce((s, b) => s + (b.total_price ?? 0), 0)

  const lastMonth = confirmed
    .filter(b => monthKey(b.check_in) === lastMonthKey)
    .reduce((s, b) => s + (b.total_price ?? 0), 0)

  const uniqueProperties = new Set(confirmed.map(b => b.listing_id)).size
  const perProperty = uniqueProperties > 0 ? Math.round(totalThisYear / uniqueProperties) : 0

  const months = last6Months()
  const byMonth: Record<string, number> = {}
  confirmed.forEach(b => { byMonth[monthKey(b.check_in)] = (byMonth[monthKey(b.check_in)] ?? 0) + (b.total_price ?? 0) })
  const bars = months.map(m => ({ ...m, rev: byMonth[m.key] ?? 0 }))

  const momPct = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : null

  return { totalThisYear, thisMonth, perProperty, bars, momPct, hasAny: confirmed.length > 0 }
}

export function Earnings({ tone, go }: { tone: string; go?: (v: string) => void }) {
  const { t } = useTranslation('owner')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOwnerBookings()
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-paper border border-line rounded-xl p-4 animate-pulse space-y-2">
              <div className="h-3 bg-line-soft rounded w-1/2" />
              <div className="h-6 bg-line-soft rounded w-2/3" />
              <div className="h-3 bg-line-soft rounded w-1/3" />
            </div>
          ))}
        </div>
        <div className="bg-paper border border-line rounded-xl p-5 animate-pulse">
          <div className="h-32 bg-line-soft rounded" />
        </div>
      </div>
    )
  }

  const { totalThisYear, thisMonth, perProperty, bars, momPct, hasAny } = deriveStats(bookings)
  const maxRev = Math.max(...bars.map(b => b.rev), 1)
  const now = new Date()
  const rangeLabel = `${bars[0]?.label} – ${bars[bars.length - 1]?.label} ${now.getFullYear()}`

  if (!hasAny) {
    return (
      <div className="bg-paper border border-line rounded-xl py-16 flex flex-col items-center gap-3 text-center px-6">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${TONE}18` }}>
          <DollarSign size={20} style={{ color: TONE }} />
        </div>
        <div>
          <div className="text-[13.5px] font-semibold text-ink mb-0.5">{t('earnings_page.empty_title')}</div>
          <div className="text-[11.5px] text-dim">{t('earnings_page.empty_sub')}</div>
        </div>
      </div>
    )
  }

  const momSub = momPct != null
    ? t('earnings_page.mom_vs', { pct: `${momPct >= 0 ? '+' : ''}${momPct}` })
    : t('earnings_page.no_data_last_month')

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {([
          { label: t('earnings_page.kpi_total_year'), value: fmtMoney(totalThisYear), sub: `Jan–${now.toLocaleDateString('en-US', { month: 'short' })} ${now.getFullYear()}`, accent: tone },
          { label: t('earnings_page.kpi_this_month'), value: fmtMoney(thisMonth),     sub: momSub },
          { label: t('earnings_page.kpi_per_property'), value: fmtMoney(perProperty), sub: t('earnings_page.kpi_avg') },
        ] as const).map((k, i) => <RoleKpiCard key={i} {...k} />)}
      </div>
      <Card title={<><DollarSign size={14} /> {t('earnings_page.chart_title')}</>} sub={rangeLabel}>
        <div className="flex items-end gap-2.5 h-32.5">
          {bars.map((d, i) => {
            const h = (d.rev / maxRev) * 100
            const isLast = i === bars.length - 1
            return (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1.75">
                <div className={`text-[11px] ${isLast ? 'text-ink font-bold' : 'text-dim'}`}>
                  {d.rev > 0 ? fmtMoney(d.rev) : '—'}
                </div>
                <div
                  className="w-full rounded-t-lg"
                  style={{ height: `${Math.max(h, d.rev > 0 ? 4 : 0)}%`, background: isLast ? tone : `${tone}50` }}
                />
                <div className="text-[11px] text-dim">{d.label}</div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
