import { useEffect, useState } from 'react'
import { Bell, CalendarDays, Home, Users } from 'lucide-react'
import { StatusPill, fmtPrice } from '../../components/dashboard/shared'
import { getOwnerBookings, acceptBooking, declineBooking, type Booking } from '../../api/bookings'

function fmtDate(s: string): string {
  return new Date(s + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function nightsBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

function avatarTone(name: string): string {
  const tones = ['#e10f1f', '#0b63ab', '#f0a800', '#7884a0', '#1f7a3d', '#9333ea']
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff
  return tones[h % tones.length]
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 px-5 py-2.5 bg-paper2 border-b border-line">
      <span className="text-[11.5px] font-bold uppercase tracking-[.07em] text-dim">{label}</span>
      <span className="text-[11px] font-bold px-1.75 py-px rounded-full bg-line text-dim">{count}</span>
    </div>
  )
}

function BookingRow({
  booking,
  actionable,
  onAccept,
  onDecline,
  acting,
}: {
  booking: Booking
  actionable: boolean
  onAccept?: () => void
  onDecline?: () => void
  acting: boolean
}) {
  const name = booking.guest_name ?? 'Guest'
  const nights = nightsBetween(booking.check_in, booking.check_out)

  return (
    <div className={`flex items-start gap-4 px-5 py-4 ${actionable ? 'bg-amber-50/40' : ''}`}>
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full shrink-0 grid place-items-center font-bold text-[14px] text-white mt-0.5"
        style={{ background: avatarTone(name) }}
      >
        {name[0].toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13.5px] font-semibold text-ink">{name}</span>
          <StatusPill label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} />
          {actionable && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Action required</span>
          )}
        </div>
        <div className="text-[12px] text-ink2 mt-0.5 truncate font-medium">{booking.listing_title ?? 'Property'}</div>
        <div className="flex items-center gap-3 mt-1 text-[11.5px] text-dim flex-wrap">
          <span className="flex items-center gap-1">
            <CalendarDays size={10} className="shrink-0" />
            {fmtDate(booking.check_in)} – {fmtDate(booking.check_out)} · {nights} night{nights !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Users size={10} className="shrink-0" />
            {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        {booking.total_price != null && (
          <span className="text-[13.5px] font-bold text-ink">{fmtPrice(booking.total_price)}</span>
        )}
        {actionable && (
          <div className="flex gap-1.5">
            <button
              onClick={onAccept}
              disabled={acting}
              className="text-[12px] font-bold py-1.5 px-3.5 rounded-lg border-0 bg-brand text-white cursor-pointer disabled:opacity-50"
            >
              {acting ? '…' : 'Accept'}
            </button>
            <button
              onClick={onDecline}
              disabled={acting}
              className="text-[12px] font-bold py-1.5 px-3.5 rounded-lg border border-line bg-white text-ink2 cursor-pointer disabled:opacity-50"
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const TONE = '#f0a800'

export function OwnerBookings({ go }: { go?: (v: string) => void }) {
  const [bookings, setBookings]   = useState<Booking[]>([])
  const [loading, setLoading]     = useState(true)
  const [acting, setActing]       = useState<string | null>(null)

  useEffect(() => {
    getOwnerBookings()
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleAccept(id: string) {
    setActing(id)
    try {
      await acceptBooking(id)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'confirmed' } : b))
    } catch {
    } finally {
      setActing(null)
    }
  }

  async function handleDecline(id: string) {
    setActing(id)
    try {
      await declineBooking(id)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
    } catch {
    } finally {
      setActing(null)
    }
  }

  const today = new Date().toISOString().slice(0, 10)
  const pending   = bookings.filter(b => b.status === 'pending')
  const upcoming  = bookings.filter(b => b.status === 'confirmed' && b.check_in >= today)
  const past      = bookings.filter(b => b.status === 'confirmed' && b.check_out < today)
  const cancelled = bookings.filter(b => b.status === 'cancelled')

  if (loading) {
    return (
      <div className="bg-paper border border-line rounded-xl overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-line last:border-0 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-line-soft shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-line-soft rounded w-1/2" />
              <div className="h-3 bg-line-soft rounded w-2/3" />
              <div className="h-3 bg-line-soft rounded w-1/3" />
            </div>
            <div className="h-7 w-24 bg-line-soft rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-paper border border-line rounded-xl py-16 flex flex-col items-center gap-3 text-center px-6">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${TONE}18` }}>
          <Bell size={20} style={{ color: TONE }} />
        </div>
        <div>
          <div className="text-[13.5px] font-semibold text-ink mb-0.5">No bookings yet</div>
          <div className="text-[11.5px] text-dim">Add a listing to start receiving booking requests from guests.</div>
        </div>
        <button
          onClick={() => go?.('listings')}
          className="flex items-center gap-1.5 py-1.75 px-4 rounded-full text-[12.5px] font-bold cursor-pointer border-0 text-white"
          style={{ background: TONE }}
        >
          <Home size={13} strokeWidth={2.5} /> Add a listing
        </button>
      </div>
    )
  }

  return (
    <div className="bg-paper border border-line rounded-xl overflow-hidden divide-y divide-line">
      {pending.length > 0 && (
        <div>
          <SectionHeader label="Pending — Action Required" count={pending.length} />
          <div className="divide-y divide-line">
            {pending.map(b => (
              <BookingRow
                key={b.id}
                booking={b}
                actionable
                onAccept={() => handleAccept(b.id)}
                onDecline={() => handleDecline(b.id)}
                acting={acting === b.id}
              />
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <SectionHeader label="Upcoming" count={upcoming.length} />
          <div className="divide-y divide-line">
            {upcoming.map(b => (
              <BookingRow key={b.id} booking={b} actionable={false} acting={false} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <SectionHeader label="Past" count={past.length} />
          <div className="divide-y divide-line">
            {past.map(b => (
              <BookingRow key={b.id} booking={b} actionable={false} acting={false} />
            ))}
          </div>
        </div>
      )}

      {cancelled.length > 0 && (
        <div>
          <SectionHeader label="Cancelled" count={cancelled.length} />
          <div className="divide-y divide-line">
            {cancelled.map(b => (
              <BookingRow key={b.id} booking={b} actionable={false} acting={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
