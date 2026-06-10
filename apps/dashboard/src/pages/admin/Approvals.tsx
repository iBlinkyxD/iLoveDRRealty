import { useState } from 'react'
import { APPROVALS, FilterPills, ApprovalRow } from './shared'

export function Approvals() {
  const [filter, setFilter] = useState<'All' | 'Listing' | 'User'>('All')
  const filtered = APPROVALS.filter(a => filter === 'All' || a.type === filter)

  return (
    <div className="bg-paper border border-line rounded-2xl overflow-hidden">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-line">
        {[
          { label: 'Total pending', value: '8', color: '#c07800' },
          { label: 'Listings',      value: '5', color: '#0b63ab' },
          { label: 'Users',         value: '3', color: '#f0a800' },
          { label: 'Flagged',       value: '2', color: '#e10f1f' },
        ].map(({ label, value, color }, i) => (
          <div key={i} className={`px-4 sm:px-5.5 py-4 border-line ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b sm:border-b-0' : ''} ${i === 1 || i === 2 ? 'sm:border-r' : ''}`}>
            <div className="font-sans text-2xl font-bold" style={{ color }}>{value}</div>
            <div className="text-[11.5px] text-dim mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter + actions bar */}
      <div className="flex flex-wrap justify-between items-center gap-2 px-4 sm:px-5.5 py-3.5 border-b border-line bg-line-soft">
        <FilterPills options={['All', 'Listing', 'User']} value={filter} onChange={v => setFilter(v as typeof filter)} />
        <div className="flex gap-2">
          <button className="text-xs font-bold px-3.5 py-1.5 rounded-lg border-0 cursor-pointer" style={{ background: '#1f7a3d', color: '#fff' }}>
            Approve all
          </button>
          <button className="text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer bg-paper border border-line text-ink2">
            Export
          </button>
        </div>
      </div>

      {/* All rows */}
      <div className="flex flex-col">
        {filtered.map((item, i) => (
          <ApprovalRow key={i} item={item} last={i === filtered.length - 1} />
        ))}
        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-dim">No {filter.toLowerCase()} items pending.</div>
        )}
      </div>
    </div>
  )
}
