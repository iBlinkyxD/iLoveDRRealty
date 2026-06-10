import { MessageCircle } from 'lucide-react'
import { Card, StatusPill } from '../../components/dashboard/shared'

export function Inquiries() {
  return (
    <Card title={<><MessageCircle size={14} />My Inquiries</>} padded={false}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Property', 'Sent', 'Status'].map((h, i) => (
                <th key={i} className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-[.07em] text-dim text-left border-b border-line">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Oceanfront Villa with Infinity Pool', '2d ago', 'Pending'],
              ['Penthouse Condo — Piantini',           '5d ago', 'Replied'],
              ['Tropical Golf Community Villa',         '1w ago', 'Replied'],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className={`px-5 py-3 text-[13px] text-ink ${i < 2 ? 'border-b border-line' : ''}`}>
                    {j === 2 ? <StatusPill label={cell} /> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
