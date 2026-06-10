import { Search } from 'lucide-react'
import { Card, CardLink, StatusPill } from '../../components/dashboard/shared'

export function SavedSearches() {
  return (
    <Card title={<><Search size={14} />Saved Searches</>} action={<CardLink>+ New search</CardLink>}>
      {[
        ['Punta Cana · 2BR+ · under $300K', 'Daily email', '3 new'],
        ['Beachfront condos · Las Terrenas',  'Weekly',      '1 new'],
        ['Commercial · Santo Domingo',         'Paused',      '—'   ],
      ].map(([s, freq, n], i) => (
        <div key={i} className={`flex items-center gap-3 py-3.5 ${i < 2 ? 'border-b border-line' : ''}`}>
          <div className="w-9 h-9 rounded-full shrink-0 grid place-items-center text-white" style={{ background: 'linear-gradient(135deg,#e10f1f,#a50f28)' }}>
            <Search size={14} />
          </div>
          <div className="flex-1">
            <div className="text-[13.5px] font-semibold text-ink">{s}</div>
            <div className="text-[11.5px] text-dim">Alerts: {freq}</div>
          </div>
          {n !== '—' ? <StatusPill label={n} tone="#0b63ab" /> : <StatusPill label="Paused" />}
        </div>
      ))}
    </Card>
  )
}
