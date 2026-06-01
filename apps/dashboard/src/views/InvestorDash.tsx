import React, { useState, useMemo } from 'react'
import { c, fontSans, fontSerif } from '../design'

const TONE = c.sea

const PORTFOLIO = [
  { name: 'Cliffside Villa — Sosúa',        price: 1_650_000, value: 1_820_000, rent: 14_200, roi: 8.9, occ: 82, months: 14 },
  { name: 'Garden Condo — Cabarete',        price:   245_000, value:   268_000, rent:  1_750, roi: 7.2, occ: 75, months: 8  },
]

const REGIONS = [
  { name: 'Cap Cana',       yield: 9.8, growth: 12.3, price: '$1.8M avg',  trend: '↑' },
  { name: 'Punta Cana',     yield: 8.4, growth: 9.1,  price: '$875K avg',  trend: '↑' },
  { name: 'Las Terrenas',   yield: 7.6, growth: 7.8,  price: '$920K avg',  trend: '→' },
  { name: 'Puerto Plata',   yield: 8.9, growth: 8.5,  price: '$640K avg',  trend: '↑' },
  { name: 'Santo Domingo',  yield: 6.8, growth: 5.2,  price: '$389K avg',  trend: '→' },
]

function fmt(n: number) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'K'
  return '$' + n.toLocaleString()
}

export default function InvestorDash({ go }: { go: (v: string) => void }) {
  const totalInvested = PORTFOLIO.reduce((s, p) => s + p.price, 0)
  const totalValue    = PORTFOLIO.reduce((s, p) => s + p.value, 0)
  const monthlyRent   = PORTFOLIO.reduce((s, p) => s + p.rent, 0)
  const avgROI        = (PORTFOLIO.reduce((s, p) => s + p.roi, 0) / PORTFOLIO.length).toFixed(1)
  const gain          = totalValue - totalInvested

  return (
    <div style={{ fontFamily: fontSans, maxWidth: 1100 }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: TONE, marginBottom: 6 }}>Portfolio overview</div>
        <h1 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 800, color: c.ink, margin: '0 0 4px', letterSpacing: '-.02em' }}>Investment dashboard</h1>
        <p style={{ fontSize: 14, color: c.ink2 }}>2 active properties · Last updated today</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '🏘️', label: 'Total Invested',    value: fmt(totalInvested), sub: '2 properties'         },
          { icon: '📈', label: 'Current Value',     value: fmt(totalValue),    sub: `+${fmt(gain)} gain`    },
          { icon: '💰', label: 'Monthly Cash Flow', value: '+' + fmt(monthlyRent / 12 * 0.6), sub: 'After expenses' },
          { icon: '📊', label: 'Avg ROI',           value: avgROI + '%',        sub: 'Gross rental yield'   },
        ].map((s, i) => (
          <div key={i} style={{ background: i === 0 ? `linear-gradient(135deg, ${c.ink} 0%, #1a3a6e 100%)` : c.paper, border: i === 0 ? 'none' : `1px solid ${c.line}`, borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: fontSerif, fontSize: 24, fontWeight: 700, color: i === 0 ? '#fff' : c.ink, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: i === 0 ? 'rgba(255,255,255,.7)' : c.ink2, marginTop: 5 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: i === 0 ? 'rgba(255,255,255,.45)' : c.muted, marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>

        {/* Portfolio table */}
        <div style={{ background: c.paper, border: `1px solid ${c.line}`, borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ fontFamily: fontSerif, fontSize: 17, fontWeight: 700, color: c.ink, marginBottom: 18 }}>Properties</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PORTFOLIO.map((p, i) => (
              <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: c.paper2, border: `1px solid ${c.lineSoft}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c.ink, marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: 11.5, color: c.muted }}>Purchased {p.months} months ago</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.green }}>+{p.roi}% ROI</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {[
                    { label: 'Purchase',    v: fmt(p.price)  },
                    { label: 'Current val', v: fmt(p.value)  },
                    { label: 'Rent/mo',     v: fmt(p.rent)   },
                  ].map((m, j) => (
                    <div key={j} style={{ textAlign: 'center', padding: '8px 0', background: '#fff', borderRadius: 8 }}>
                      <div style={{ fontFamily: fontSerif, fontSize: 15, fontWeight: 700, color: c.ink }}>{m.v}</div>
                      <div style={{ fontSize: 10.5, color: c.muted, marginTop: 2 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                {/* occupancy bar */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: c.muted, marginBottom: 5 }}>
                    <span>Occupancy</span><span>{p.occ}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: c.lineSoft }}>
                    <div style={{ height: 6, borderRadius: 999, width: p.occ + '%', background: `linear-gradient(90deg, ${TONE}, ${c.green})` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button style={{ marginTop: 14, width: '100%', padding: '11px 0', borderRadius: 999, border: `1.5px solid ${TONE}`, background: 'transparent', color: TONE, fontFamily: fontSans, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            + Add property to portfolio
          </button>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Regional yields */}
          <div style={{ background: c.paper, border: `1px solid ${c.line}`, borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ fontFamily: fontSerif, fontSize: 17, fontWeight: 700, color: c.ink, marginBottom: 14 }}>Regional yields</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {REGIONS.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: r.trend === '↑' ? c.green : c.muted, fontWeight: 700, width: 14 }}>{r.trend}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: c.ink }}>{r.name}</span>
                      <span style={{ fontWeight: 700, color: c.green }}>{r.yield}%</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 999, background: c.lineSoft }}>
                      <div style={{ height: 5, borderRadius: 999, width: (r.yield / 10 * 100) + '%', background: TONE }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROI Calculator shortcut */}
          <div style={{ background: `linear-gradient(135deg, ${TONE} 0%, ${c.seaDeep} 100%)`, borderRadius: 14, padding: '22px 22px' }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>🧮</div>
            <div style={{ fontFamily: fontSerif, fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>ROI Calculator</div>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.65)', lineHeight: 1.5, marginBottom: 14 }}>Model a new deal — scenario analysis, break-even, 10-year projections.</p>
            <button onClick={() => go('calculator')} style={{ fontFamily: fontSans, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', padding: '9px 18px', borderRadius: 999, background: '#fff', color: TONE, border: 'none' }}>
              Open calculator →
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
