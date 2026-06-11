import { useEffect, useState } from 'react'
import { Heart, MapPin, Trash2 } from 'lucide-react'
import { Card, CardLink, StatusPill, fmtPrice } from '../../components/dashboard/shared'
import { getMySavedHomes, unsaveHome, type SavedHome } from '../../api/savedHomes'

export function SavedHomes() {
  const [homes, setHomes] = useState<SavedHome[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    getMySavedHomes()
      .then(setHomes)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleUnsave = async (listingId: string) => {
    setRemoving(listingId)
    try {
      await unsaveHome(listingId)
      setHomes(prev => prev.filter(h => h.listing_id !== listingId))
    } catch {
      /* ignore */
    } finally {
      setRemoving(null)
    }
  }

  return (
    <Card
      title={<><Heart size={14} />Saved Homes ({homes.length})</>}
      action={<CardLink>Browse more →</CardLink>}
      padded={false}
    >
      {loading ? (
        <div className="px-5 py-8 text-[13px] text-dim text-center">Loading…</div>
      ) : homes.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <Heart size={28} className="text-dim mx-auto mb-2" />
          <p className="text-[13px] text-dim">No saved homes yet.</p>
          <p className="text-[12px] text-dim mt-0.5">Heart a property on the search page to save it here.</p>
        </div>
      ) : (
        <div className="px-3 sm:px-5">
          {homes.map((h, i) => {
            const thumb = h.listing_images[0]
            return (
              <div key={h.id} className={`flex items-center gap-3 py-3 ${i < homes.length - 1 ? 'border-b border-line' : ''}`}>
                {thumb ? (
                  <div className="w-13 h-10 rounded-lg shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${thumb})` }} />
                ) : (
                  <div className="w-13 h-10 rounded-lg shrink-0 bg-paper2 border border-line" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-ink truncate">
                    {h.listing_title.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                  </div>
                  <div className="text-[11px] text-dim mt-0.5 flex items-center gap-1">
                    <MapPin size={10} className="shrink-0" />
                    {h.listing_location}
                    {h.listing_bedrooms != null && ` · ${h.listing_bedrooms}bd`}
                    {h.listing_bathrooms != null && ` · ${h.listing_bathrooms}ba`}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="text-[13px] font-bold text-ink">{fmtPrice(h.listing_price)}</div>
                  <StatusPill label={h.listing_transaction === 'rent' ? 'For Rent' : 'For Sale'} />
                </div>
                <button
                  onClick={() => handleUnsave(h.listing_id)}
                  disabled={removing === h.listing_id}
                  className="ml-1 p-1.5 rounded-full text-dim hover:text-coral hover:bg-coral/10 transition-colors cursor-pointer bg-transparent border-0 disabled:opacity-40"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
