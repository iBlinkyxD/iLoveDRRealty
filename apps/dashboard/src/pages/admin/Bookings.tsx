import { useEffect, useState } from 'react'
import { Bell, CalendarDays, Users, CreditCard, Search } from 'lucide-react'
import { getAdminBookings, releasePayout, type Booking } from '../../api/bookings'
import { fmtPrice } from '../../components/dashboard/shared'
import { BookingDetailPanel } from '../../components/dashboard/BookingDetailPanel'
import { TONE, FilterPills } from './shared'

const COLS = 'grid-cols-[32px_1.5fr_1.3fr_155px_95px_145px_108px]'

const PAYMENT_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  authorized: { bg: '#fef3c718', text: '#b45309', label: 'Authorized' },
  captured:   { bg: '#dcfce718', text: '#16a34a', label: 'Paid'       },
  voided:     { bg: '#f1f5f918', text: '#64748b', label: 'Voided'     },
  refunded:   { bg: '#dbeafe18', text: '#1d4ed8', label: 'Refunded'   },
  unpaid:     { bg: '#f1f5f918', text: '#94a3b8', label: 'Unpaid'     },
}

const STATUS_COLOR: Record<string, string> = {
  pending:   '#d97706',
  confirmed: '#16a34a',
  cancelled: '#64748b',
}

const PAYOUT_STYLE: Record<string, { label: string; color: string }> = {
  pending: { label: 'Payout pending', color: '#64748b' },
  paid:    { label: 'Payout sent',    color: '#16a34a' },
  failed:  { label: 'Payout failed',  color: '#dc2626' },
}

function avatarTone(name: string): string {
  const tones = ['#e10f1f', '#0b63ab', '#f0a800', '#7884a0', '#1f7a3d', '#9333ea']
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff
  return tones[h % tones.length]
}

function fmtDate(s: string): string {
  return new Date(s + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtDateShort(s: string): string {
  return new Date(s + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fmtTimestamp(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function nightsBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

function GuestAvatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <div
      className="rounded-full grid place-items-center text-white font-bold shrink-0"
      style={{ background: avatarTone(name), width: size, height: size, fontSize: size * 0.4 }}
    >
      {name[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

const FILTER_OPTIONS = ['All', 'Pending', 'Confirmed', 'Cancelled', 'Failed Payout']

export function AdminBookings() {
  const [bookings,       setBookings]       = useState<Booking[]>([])
  const [loading,        setLoading]        = useState(true)
  const [acting,         setActing]         = useState<string | null>(null)
  const [filter,         setFilter]         = useState('All')
  const [query,          setQuery]          = useState('')
  const [selectedId,     setSelectedId]     = useState<string | null>(null)
  const [confirmPayoutId, setConfirmPayoutId] = useState<string | null>(null)
  const panelBooking = selectedId ? (bookings.find(b => b.id === selectedId) ?? null) : null

  useEffect(() => {
    getAdminBookings()
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleReleasePayout(id: string) {
    setActing(id)
    try {
      await releasePayout(id)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, payout_status: 'paid' } : b))
    } catch {
    } finally {
      setActing(null)
    }
  }

  const filtered = bookings.filter(b => {
    if (filter === 'Pending')      { if (b.status !== 'pending')   return false }
    else if (filter === 'Confirmed')    { if (b.status !== 'confirmed') return false }
    else if (filter === 'Cancelled')    { if (b.status !== 'cancelled') return false }
    else if (filter === 'Failed Payout') { if (b.payout_status !== 'failed') return false }
    if (query.trim()) {
      const q = query.toLowerCase()
      return (
        (b.guest_name ?? '').toLowerCase().includes(q) ||
        (b.guest_email ?? '').toLowerCase().includes(q) ||
        (b.listing_title ?? '').toLowerCase().includes(q) ||
        (b.owner_name ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })

  const kpis = [
    { label: 'Total',        value: bookings.length,                                          sub: 'All time bookings',        accent: undefined as string | undefined },
    { label: 'Pending',      value: bookings.filter(b => b.status === 'pending').length,      sub: 'Awaiting acceptance',      accent: bookings.some(b => b.status === 'pending') ? '#d97706' : undefined },
    { label: 'Confirmed',    value: bookings.filter(b => b.status === 'confirmed').length,    sub: 'Accepted & active',        accent: undefined },
    { label: 'Failed Payout',value: bookings.filter(b => b.payout_status === 'failed').length,sub: 'Need manual action',       accent: bookings.some(b => b.payout_status === 'failed') ? '#dc2626' : undefined },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-paper border border-line rounded-xl px-4 py-4 animate-pulse space-y-2">
                <div className="h-2.5 bg-line-soft rounded w-2/3" />
                <div className="h-7 bg-line-soft rounded w-1/2" />
                <div className="h-2.5 bg-line-soft rounded w-3/4" />
              </div>
            ))
          : kpis.map(k => (
              <div key={k.label} className="bg-paper border border-line rounded-xl px-4 py-4">
                <div className="text-[11px] font-bold uppercase tracking-[.07em] text-dim mb-2">{k.label}</div>
                <div className="text-[28px] font-bold leading-none" style={{ color: k.accent ?? 'var(--ink, #1a1e2e)' }}>
                  {k.value}
                </div>
                <div className="text-[11px] text-dim mt-1.5 truncate">{k.sub}</div>
              </div>
            ))
        }
      </div>

      {/* Main card */}
      <div className="bg-paper border border-line rounded-2xl overflow-hidden">

        {/* Toolbar */}
        <div className="px-4 sm:px-5 py-4 border-b border-line space-y-3">
          <div className="font-sans text-[17px] font-bold text-ink">
            Bookings
            {!loading && bookings.length > 0 && (
              <span className="ml-2 text-[13px] font-normal text-dim">({filtered.length})</span>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-white w-55">
              <Search size={13} className="text-dim shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search guest, property, owner…"
                className="text-[12.5px] border-0 outline-none bg-transparent text-ink placeholder:text-dim flex-1 min-w-0"
              />
            </div>
            <div className="ml-auto">
              <FilterPills options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
            </div>
          </div>
        </div>

        {/* Table header — desktop only */}
        <div className={`hidden lg:grid ${COLS} gap-3 py-2.5 px-5 border-b border-line bg-nav/5`}>
          {['', 'Guest', 'Property', 'Stay', 'Requested', 'Status', 'Amount'].map((h, i) => (
            <div key={i} className="text-[11px] font-bold text-dim uppercase tracking-[.06em]">{h}</div>
          ))}
        </div>

        {/* Body */}
        {loading ? (
          <>
            {/* Desktop skeleton */}
            <div className="hidden lg:block divide-y divide-line-soft">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`grid ${COLS} gap-3 py-3.5 px-5 animate-pulse items-center`}>
                  <div className="w-8 h-8 bg-line-soft rounded-full" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 bg-line-soft rounded w-3/4" />
                    <div className="h-2.5 bg-line-soft rounded w-1/2" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 bg-line-soft rounded w-4/5" />
                    <div className="h-2.5 bg-line-soft rounded w-1/2" />
                  </div>
                  <div className="h-3 bg-line-soft rounded w-3/4" />
                  <div className="h-3 bg-line-soft rounded w-2/3" />
                  <div className="space-y-1.5">
                    <div className="h-5 bg-line-soft rounded-full w-20" />
                    <div className="h-5 bg-line-soft rounded-full w-16" />
                  </div>
                  <div className="h-3.5 bg-line-soft rounded w-14" />
                </div>
              ))}
            </div>
            {/* Mobile skeleton */}
            <div className="lg:hidden divide-y divide-line-soft">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-4 py-4 flex flex-col gap-2 animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-line-soft rounded-full" />
                    <div className="h-3.5 bg-line-soft rounded w-1/3" />
                  </div>
                  <div className="h-3 bg-line-soft rounded w-2/3" />
                  <div className="h-3 bg-line-soft rounded w-1/2" />
                </div>
              ))}
            </div>
          </>
        ) : filtered.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-3 text-center px-6">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${TONE}18` }}>
              <Bell size={20} style={{ color: TONE }} />
            </div>
            <div>
              <div className="text-[13.5px] font-semibold text-ink mb-0.5">No bookings found</div>
              <div className="text-[11.5px] text-dim">
                {query.trim() ? 'No bookings match your search.' : filter !== 'All' ? 'No bookings match this filter.' : 'No bookings have been made yet.'}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block divide-y divide-line-soft">
              {filtered.map(b => {
                const name       = b.guest_name ?? 'Guest'
                const nights     = nightsBetween(b.check_in, b.check_out)
                const payStyle   = b.payment_status ? PAYMENT_STYLE[b.payment_status] : null
                const statusColor = STATUS_COLOR[b.status] ?? '#64748b'
                const payoutInfo = b.payout_status ? PAYOUT_STYLE[b.payout_status] : null
                const showRelease = b.payment_status === 'captured' && b.payout_status !== 'paid'

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedId(b.id)}
                    className={`grid ${COLS} gap-3 py-3.5 px-5 items-center hover:bg-line-soft/40 transition-colors cursor-pointer`}
                  >
                    {/* Avatar */}
                    <GuestAvatar name={name} size={32} />

                    {/* Guest */}
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-ink truncate">{name}</div>
                      {b.guest_email && (
                        <div className="text-[11px] text-dim truncate">{b.guest_email}</div>
                      )}
                    </div>

                    {/* Property */}
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-medium text-ink truncate">{b.listing_title ?? '—'}</div>
                      {b.owner_name && (
                        <div className="text-[11px] text-dim truncate">Owner: {b.owner_name}</div>
                      )}
                    </div>

                    {/* Stay */}
                    <div>
                      <div className="flex items-center gap-1 text-[11.5px] text-ink2">
                        <CalendarDays size={10} className="shrink-0 text-dim" />
                        <span>{fmtDateShort(b.check_in)} – {fmtDateShort(b.check_out)}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-[11px] text-dim">
                        <Users size={10} className="shrink-0" />
                        <span>{nights}n · {b.guests} guest{b.guests !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Requested */}
                    <div className="text-[11.5px] text-dim">{fmtTimestamp(b.created_at)}</div>

                    {/* Status + payment badges */}
                    <div className="flex flex-col gap-1">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold w-fit"
                        style={{ background: `${statusColor}18`, color: statusColor }}
                      >
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                      {payStyle && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold w-fit"
                          style={{ background: payStyle.bg, color: payStyle.text }}
                        >
                          <CreditCard size={9} />
                          {payStyle.label}
                        </span>
                      )}
                      {payoutInfo && b.payout_status !== 'pending' && (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold w-fit"
                          style={{ background: `${payoutInfo.color}18`, color: payoutInfo.color }}
                        >
                          {payoutInfo.label}
                        </span>
                      )}
                    </div>

                    {/* Amount + Release Payout */}
                    <div className="flex flex-col items-end gap-1.5" onClick={e => e.stopPropagation()}>
                      {b.payout_amount != null ? (
                        <div className="text-right">
                          <div className="text-[13px] font-bold text-ink">{fmtPrice(b.payout_amount)}</div>
                          {b.platform_fee != null && (
                            <div className="text-[10px] text-dim">of {fmtPrice(b.total_price ?? 0)}</div>
                          )}
                        </div>
                      ) : b.total_price != null ? (
                        <div className="text-[13px] font-bold text-ink">{fmtPrice(b.total_price)}</div>
                      ) : (
                        <div className="text-[12px] text-dim">—</div>
                      )}
                      {showRelease && confirmPayoutId !== b.id && (
                        <button
                          onClick={e => { e.stopPropagation(); setConfirmPayoutId(b.id) }}
                          disabled={acting === b.id}
                          className="text-[11px] font-bold py-1 px-2.5 rounded-lg border-0 bg-red-50 text-red-600 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                        >
                          Release Payout
                        </button>
                      )}
                      {showRelease && confirmPayoutId === b.id && (
                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => { setConfirmPayoutId(null); handleReleasePayout(b.id) }}
                            disabled={acting === b.id}
                            className="text-[11px] font-bold py-1 px-2 rounded-lg border-0 bg-red-600 text-white cursor-pointer disabled:opacity-50 whitespace-nowrap"
                          >
                            {acting === b.id ? '…' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setConfirmPayoutId(null)}
                            className="text-[11px] font-bold py-1 px-2 rounded-lg border border-line bg-white text-dim cursor-pointer whitespace-nowrap"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-line-soft">
              {filtered.map(b => {
                const name       = b.guest_name ?? 'Guest'
                const nights     = nightsBetween(b.check_in, b.check_out)
                const payStyle   = b.payment_status ? PAYMENT_STYLE[b.payment_status] : null
                const statusColor = STATUS_COLOR[b.status] ?? '#64748b'
                const showRelease = b.payment_status === 'captured' && b.payout_status !== 'paid'

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedId(b.id)}
                    className="px-4 py-4 cursor-pointer hover:bg-line-soft/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <GuestAvatar name={name} size={34} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-semibold text-ink truncate">{name}</span>
                          <span
                            className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
                            style={{ background: `${statusColor}18`, color: statusColor }}
                          >
                            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-[11.5px] text-ink2 mt-0.5 truncate">{b.listing_title ?? '—'}</div>
                        {b.owner_name && <div className="text-[11px] text-dim">Owner: {b.owner_name}</div>}
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-dim flex-wrap">
                          <span className="flex items-center gap-1">
                            <CalendarDays size={10} />
                            {fmtDate(b.check_in)} – {fmtDate(b.check_out)} · {nights}n
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={10} />
                            {b.guests} guest{b.guests !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {payStyle && (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold"
                                style={{ background: payStyle.bg, color: payStyle.text }}
                              >
                                <CreditCard size={9} />{payStyle.label}
                              </span>
                            )}
                            <span className="text-[10.5px] text-dim">Req. {fmtTimestamp(b.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-ink">
                              {b.payout_amount != null ? fmtPrice(b.payout_amount) : b.total_price != null ? fmtPrice(b.total_price) : '—'}
                            </span>
                            {showRelease && confirmPayoutId !== b.id && (
                              <button
                                onClick={e => { e.stopPropagation(); setConfirmPayoutId(b.id) }}
                                disabled={acting === b.id}
                                className="text-[11px] font-bold py-1 px-2.5 rounded-lg border-0 bg-red-50 text-red-600 cursor-pointer disabled:opacity-50"
                              >
                                Release
                              </button>
                            )}
                            {showRelease && confirmPayoutId === b.id && (
                              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => { setConfirmPayoutId(null); handleReleasePayout(b.id) }}
                                  disabled={acting === b.id}
                                  className="text-[11px] font-bold py-1 px-2 rounded-lg border-0 bg-red-600 text-white cursor-pointer disabled:opacity-50"
                                >
                                  {acting === b.id ? '…' : 'Confirm'}
                                </button>
                                <button
                                  onClick={() => setConfirmPayoutId(null)}
                                  className="text-[11px] font-bold py-1 px-2 rounded-lg border border-line bg-white text-dim cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <BookingDetailPanel
        booking={panelBooking}
        onClose={() => setSelectedId(null)}
        accentColor={TONE}
        isAdmin
        onReleasePayout={
          panelBooking?.payment_status === 'captured' && panelBooking?.payout_status !== 'paid'
            ? () => handleReleasePayout(panelBooking.id)
            : undefined
        }
      />
    </div>
  )
}
