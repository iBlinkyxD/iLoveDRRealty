import { useEffect, useState } from 'react'
import { CalendarDays, MapPin, Search, X } from 'lucide-react'
import { StatusPill, fmtPrice } from '../../components/dashboard/shared'
import { getMyBookings, cancelBooking, type Booking } from '../../api/bookings'

const TONE = '#e10f1f'
const LANDING_URL = import.meta.env.VITE_LANDING_URL ?? 'https://ilovedrrealty.com'

type Tab = 'all' | 'upcoming' | 'past' | 'cancelled'

const TABS: { key: Tab; label: string }[] = [
  { key: 'all',       label: 'All'       },
  { key: 'upcoming',  label: 'Upcoming'  },
  { key: 'past',      label: 'Past'      },
  { key: 'cancelled', label: 'Cancelled' },
]

function fmtDate(s: string): string {
  return new Date(s + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function nightsBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

function filterBookings(bookings: Booking[], tab: Tab): Booking[] {
  const today = new Date().toISOString().slice(0, 10)
  if (tab === 'upcoming')  return bookings.filter(b => b.check_in >= today && b.status !== 'cancelled')
  if (tab === 'past')      return bookings.filter(b => b.check_out < today && b.status !== 'cancelled')
  if (tab === 'cancelled') return bookings.filter(b => b.status === 'cancelled')
  return bookings
}

export function BuyerBookings() {
  const [bookings, setBookings]   = useState<Booking[]>([])
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState<Tab>('all')
  const [cancelling, setCancelling] = useState<string | null>(null)

  useEffect(() => {
    getMyBookings()
      .then(data => setBookings(data.sort((a, b) => b.check_in.localeCompare(a.check_in))))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleCancel(id: string) {
    setCancelling(id)
    try {
      await cancelBooking(id)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
    } catch {
    } finally {
      setCancelling(null)
    }
  }

  const visible = filterBookings(bookings, tab)

  const tabCounts: Record<Tab, number> = {
    all:       bookings.length,
    upcoming:  filterBookings(bookings, 'upcoming').length,
    past:      filterBookings(bookings, 'past').length,
    cancelled: filterBookings(bookings, 'cancelled').length,
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-paper border border-line rounded-xl px-2 py-1.5 w-fit">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold border-0 cursor-pointer transition-colors ${
              tab === t.key ? 'text-white' : 'bg-transparent text-dim hover:text-ink'
            }`}
            style={tab === t.key ? { background: TONE } : undefined}
          >
            {t.label}
            {tabCounts[t.key] > 0 && (
              <span className={`ml-1.5 text-[11px] font-bold ${tab === t.key ? 'opacity-80' : 'text-dim'}`}>
                {tabCounts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking list */}
      <div className="bg-paper border border-line rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col divide-y divide-line">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-16 h-12 rounded-lg bg-line-soft shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-line-soft rounded w-2/3" />
                  <div className="h-3 bg-line-soft rounded w-1/2" />
                </div>
                <div className="h-6 w-20 bg-line-soft rounded-full" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${TONE}18` }}>
              <CalendarDays size={20} style={{ color: TONE }} />
            </div>
            <div className="text-center">
              <div className="text-[13.5px] font-semibold text-ink mb-0.5">
                {tab === 'all' ? 'No bookings yet' : `No ${tab} bookings`}
              </div>
              <div className="text-[11.5px] text-dim">
                {tab === 'upcoming' ? 'Book a property to see your upcoming trips here.'
                  : tab === 'past' ? 'Completed stays will appear here.'
                  : tab === 'cancelled' ? 'No cancelled bookings.'
                  : 'Find a rental property and request to book.'}
              </div>
            </div>
            {(tab === 'all' || tab === 'upcoming') && (
              <a
                href={`${LANDING_URL}/search`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 py-1.75 px-4 rounded-full text-[12.5px] font-bold cursor-pointer border-0 text-white"
                style={{ background: TONE }}
              >
                <Search size={13} strokeWidth={2.5} /> Browse rentals
              </a>
            )}
          </div>
        ) : (
          <div className="divide-y divide-line">
            {visible.map(b => {
              const thumb = b.listing_images?.[0]
              const nights = nightsBetween(b.check_in, b.check_out)
              const isCancellable = b.status === 'pending' || b.status === 'confirmed'
              const today = new Date().toISOString().slice(0, 10)
              const isFuture = b.check_in >= today

              return (
                <div key={b.id} className="flex items-start gap-4 px-5 py-4">
                  {/* Thumbnail */}
                  {thumb ? (
                    <div
                      className="w-16 h-12 rounded-lg shrink-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${thumb})` }}
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-lg shrink-0 bg-paper2 border border-line flex items-center justify-center">
                      <CalendarDays size={18} className="text-dim" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-ink truncate">
                      {b.listing_title ?? 'Rental Property'}
                    </div>
                    <div className="flex items-center gap-1 text-[11.5px] text-dim mt-0.5 flex-wrap">
                      {b.listing_location && (
                        <><MapPin size={10} className="shrink-0" /><span>{b.listing_location} ·</span></>
                      )}
                      <span>{fmtDate(b.check_in)} – {fmtDate(b.check_out)}</span>
                      <span>· {nights} night{nights !== 1 ? 's' : ''}</span>
                      <span>· {b.guests} guest{b.guests !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center gap-2">
                      {b.total_price != null && (
                        <span className="text-[13px] font-bold text-ink">{fmtPrice(b.total_price)}</span>
                      )}
                      <StatusPill label={b.status.charAt(0).toUpperCase() + b.status.slice(1)} />
                    </div>
                    {isCancellable && isFuture && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        disabled={cancelling === b.id}
                        className="flex items-center gap-1 text-[11.5px] font-semibold text-red-500 bg-transparent border border-red-200 rounded-lg px-2.5 py-1 cursor-pointer hover:bg-red-50 disabled:opacity-50"
                      >
                        <X size={11} strokeWidth={2.5} />
                        {cancelling === b.id ? 'Cancelling…' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
