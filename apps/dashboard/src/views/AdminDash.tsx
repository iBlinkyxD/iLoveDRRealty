import React, { useState } from 'react'
import { c, fontSans, fontSerif } from '../design'

const TONE = c.ink

const APPROVALS: { type: 'Listing' | 'User'; title: string; submittedBy: string; time: string; flag?: string }[] = [
  { type: 'Listing', title: 'Luxury Beachfront Villa — Las Terrenas',    submittedBy: 'Maria Cruz (Owner)',      time: '1h ago'    },
  { type: 'User',    title: 'New Realtor: Carlos Reyes',                 submittedBy: 'carlos@reyes.do',         time: '3h ago',   flag: 'License pending' },
  { type: 'Listing', title: 'Commercial Space — Zona Colonial',          submittedBy: 'Juan Peña (Realtor)',     time: '5h ago'    },
  { type: 'User',    title: 'New Owner: Isabelle Fontaine',              submittedBy: 'i.fontaine@email.com',    time: 'Yesterday' },
  { type: 'Listing', title: 'Penthouse — Naco, Santo Domingo',           submittedBy: 'DRLuxury Group (Realtor)', time: '2d ago'   },
]

const ACTIVITY = [
  { icon: '✅', text: 'Listing approved: Golf Villa — Punta Cana',   time: '12m ago',  tone: c.green },
  { icon: '👤', text: 'New user registered: tom.b@example.com',       time: '34m ago',  tone: c.sea   },
  { icon: '❌', text: 'Listing rejected: Incomplete floor plan',       time: '1h ago',   tone: c.coral },
  { icon: '💬', text: 'Contact form: Inquiry from buyer in Miami',    time: '2h ago',   tone: c.gold  },
  { icon: '✅', text: 'Realtor verified: Ana Peña',                   time: '3h ago',   tone: c.green },
  { icon: '🔔', text: 'Flag resolved: Duplicate listing removed',     time: '5h ago',   tone: c.muted },
]

const BAR_DATA = [
  { month: 'Dec', users: 640  },
  { month: 'Jan', users: 820  },
  { month: 'Feb', users: 970  },
  { month: 'Mar', users: 1140 },
  { month: 'Apr', users: 1380 },
  { month: 'May', users: 1620 },
]
const MAX_BAR = Math.max(...BAR_DATA.map(d => d.users))

export default function AdminDash({ go }: { go: (v: string) => void }) {
  const [filter, setFilter] = useState<'All' | 'Listing' | 'User'>('All')
  const filtered = APPROVALS.filter(a => filter === 'All' || a.type === filter)

  return (
    <div style={{ fontFamily: fontSans, maxWidth: 1200 }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: c.coral, marginBottom: 6 }}>Admin</div>
        <h1 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 800, color: c.ink, margin: '0 0 4px', letterSpacing: '-.02em' }}>Platform overview</h1>
        <p style={{ fontSize: 14, color: c.ink2 }}>8 items pending approval · Last sync 4m ago</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '⏳', label: 'Pending Approvals', value: '8',      sub: '5 listings · 3 users',    hl: true  },
          { icon: '👥', label: 'New Users Today',   value: '34',     sub: '+18% vs yesterday'                  },
          { icon: '🏠', label: 'Active Listings',   value: '4,847',  sub: '124 added this week'                },
          { icon: '💰', label: 'Platform Revenue',  value: '$124K',  sub: 'May 2026 · +9% MoM'                 },
        ].map((s, i) => (
          <div key={i} style={{ background: s.hl ? `linear-gradient(135deg, ${c.coral} 0%, ${c.coralDeep} 100%)` : c.paper, border: s.hl ? 'none' : `1px solid ${c.line}`, borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: fontSerif, fontSize: 24, fontWeight: 700, color: s.hl ? '#fff' : c.ink, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: s.hl ? 'rgba(255,255,255,.8)' : c.ink2, marginTop: 5 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: s.hl ? 'rgba(255,255,255,.55)' : c.muted, marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>

        {/* Approval queue */}
        <div style={{ background: c.paper, border: `1px solid ${c.line}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: `1px solid ${c.line}` }}>
            <div style={{ fontFamily: fontSerif, fontSize: 17, fontWeight: 700, color: c.ink }}>Approval queue</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['All', 'Listing', 'User'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '5px 12px', borderRadius: 999, border: `1px solid ${filter === f ? c.ink : c.line}`,
                  background: filter === f ? c.ink : 'transparent', color: filter === f ? '#fff' : c.ink2,
                  fontFamily: fontSans, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 22px', borderBottom: i < filtered.length - 1 ? `1px solid ${c.lineSoft}` : 'none' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: item.type === 'Listing' ? c.sea : c.gold, background: `${item.type === 'Listing' ? c.sea : c.gold}18`, padding: '3px 9px', borderRadius: 999, flexShrink: 0, marginTop: 2 }}>{item.type}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: c.ink }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{item.submittedBy} · {item.time}</div>
                  {item.flag && <div style={{ fontSize: 11.5, color: c.gold, marginTop: 4 }}>⚠️ {item.flag}</div>}
                </div>
                <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                  <button style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 8, border: 'none', background: c.green, color: '#fff', cursor: 'pointer' }}>Approve</button>
                  <button style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 8, border: `1px solid ${c.line}`, background: '#fff', color: c.ink2, cursor: 'pointer' }}>Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* User growth chart */}
          <div style={{ background: c.paper, border: `1px solid ${c.line}`, borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ fontFamily: fontSerif, fontSize: 17, fontWeight: 700, color: c.ink, marginBottom: 4 }}>User growth</div>
            <div style={{ fontSize: 12, color: c.muted, marginBottom: 16 }}>New registrations per month</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
              {BAR_DATA.map((d, i) => {
                const h = (d.users / MAX_BAR) * 80
                const isLast = i === BAR_DATA.length - 1
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 10, color: isLast ? c.ink : c.muted, fontWeight: isLast ? 700 : 400 }}>{d.users >= 1000 ? (d.users/1000).toFixed(1)+'K' : d.users}</div>
                    <div style={{ width: '100%', height: h, borderRadius: '4px 4px 0 0', background: isLast ? c.coral : `${c.sea}60` }} />
                    <div style={{ fontSize: 10, color: c.muted }}>{d.month}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Activity feed */}
          <div style={{ background: c.paper, border: `1px solid ${c.line}`, borderRadius: 14, padding: '20px 22px', flex: 1 }}>
            <div style={{ fontFamily: fontSerif, fontSize: 17, fontWeight: 700, color: c.ink, marginBottom: 16 }}>Recent activity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, color: c.ink, lineHeight: 1.35 }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
