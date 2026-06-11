import { useEffect, useState } from 'react'
import { CalendarDays, MapPin } from 'lucide-react'
import { Card, StatusPill, fmtPrice } from '../../components/dashboard/shared'
import { getMyBookings, type Booking } from '../../api/bookings'

function fmtDateRange(checkIn: string, checkOut: string): string {
  const fmt = (s: string) => {
    const d = new Date(s + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  return `${fmt(checkIn)} – ${fmt(checkOut)}`
}

export function BuyerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyBookings()
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card title={<><CalendarDays size={14} />Bookings</>}>
      {loading ? (
        <div className="py-6 text-[13px] text-dim text-center">Loading…</div>
      ) : bookings.length === 0 ? (
        <div className="py-8 text-center">
          <CalendarDays size={28} className="text-dim mx-auto mb-2" />
          <p className="text-[13px] text-dim">No bookings yet.</p>
          <p className="text-[12px] text-dim mt-0.5">Find a rental property and request to book.</p>
          <button className="bg-transparent border-0 text-sea font-bold cursor-pointer text-[13px] mt-3">
            Find a rental →
          </button>
        </div>
      ) : (
        <div>
          {bookings.map((b, i) => {
            const thumb = b.listing_images[0]
            return (
              <div key={b.id} className={`flex items-center gap-3.5 py-3 ${i < bookings.length - 1 ? 'border-b border-line' : ''}`}>
                {thumb ? (
                  <div className="w-13 h-10 rounded-lg shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${thumb})` }} />
                ) : (
                  <div className="w-13 h-10 rounded-lg shrink-0 bg-paper2 border border-line" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink truncate">
                    {(b.listing_title ?? 'Rental Property').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                  </div>
                  <div className="text-[11.5px] text-dim flex items-center gap-1 mt-0.5">
                    {b.listing_location && <><MapPin size={10} className="shrink-0" />{b.listing_location} · </>}
                    {fmtDateRange(b.check_in, b.check_out)} · {b.guests} guest{b.guests !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {b.total_price != null && (
                    <div className="font-sans font-bold text-ink">{fmtPrice(b.total_price)}</div>
                  )}
                  <StatusPill label={b.status.charAt(0).toUpperCase() + b.status.slice(1)} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
