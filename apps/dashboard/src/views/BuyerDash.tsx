import React, { useState } from 'react'
import { c, fontSans, fontSerif } from '../design'

const TONE = c.coral

function StatCard({ icon, label, value, sub, tone = TONE }: { icon: string; label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div style={{ background: c.paper, border: `1px solid ${c.line}`, borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily: fontSerif, fontSize: 26, fontWeight: 700, color: c.ink, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: c.ink2, marginTop: 5 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: c.muted, marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

const SAVED = [
  { id: 1, title: 'Oceanfront Villa — Cap Cana',       price: '$2.45M', type: 'Villa',  roi: '8.4%', tag: 'Luxury', tone: c.gold  },
  { id: 2, title: 'Penthouse Condo — Piantini',        price: '$389K',  type: 'Condo',  roi: '6.8%', tag: 'New',    tone: c.sea   },
  { id: 3, title: 'Cliffside Designer Villa — Sosúa',  price: '$1.65M', type: 'Villa',  roi: '8.9%', tag: 'Luxury', tone: c.gold  },
  { id: 4, title: 'Garden Condo — Cabarete',           price: '$245K',  type: 'Condo',  roi: '7.2%', tag: 'Invest', tone: c.coral },
]

const INQUIRIES = [
  { property: 'Oceanfront Villa — Cap Cana',      date: 'May 28',   status: 'Replied',  statusTone: c.green },
  { property: 'Tropical Golf Villa — Punta Cana', date: 'May 26',   status: 'Pending',  statusTone: c.gold  },
  { property: 'Penthouse Condo — Piantini',       date: 'May 24',   status: 'Replied',  statusTone: c.green },
  { property: 'Modern Beachfront — Las Terrenas', date: 'May 20',   status: 'Viewed',   statusTone: c.muted },
]

export default function BuyerDash({ go }: { go: (v: string) => void }) {
  return (
    <div style={{ fontFamily: fontSans, maxWidth: 1100 }}>

      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: TONE, marginBottom: 6 }}>Welcome back</div>
        <h1 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 800, color: c.ink, margin: '0 0 4px', letterSpacing: '-.02em' }}>Your search dashboard</h1>
        <p style={{ fontSize: 14, color: c.ink2 }}>You have <strong>8 new listing matches</strong> since your last visit.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard icon="❤️" label="Saved Listings"      value="12"  sub="+3 this week" />
        <StatCard icon="💬" label="Active Inquiries"    value="3"   sub="2 awaiting reply" />
        <StatCard icon="📅" label="Scheduled Viewings"  value="2"   sub="Next: Jun 4" />
        <StatCard icon="🔔" label="New Matches"         value="8"   sub="Based on your filters" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>

        {/* Saved listings */}
        <div style={{ background: c.paper, border: `1px solid ${c.line}`, borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ fontFamily: fontSerif, fontSize: 17, fontWeight: 700, color: c.ink }}>Saved listings</div>
            <button style={{ fontSize: 12.5, fontWeight: 600, color: TONE, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SAVED.map(l => (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 10, background: c.paper2, cursor: 'pointer' }}>
                <div style={{ width: 46, height: 46, borderRadius: 8, background: `linear-gradient(135deg, ${l.tone}40 0%, ${l.tone}20 100%)`, flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 20 }}>🏠</div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: c.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{l.type} · {l.roi} yield</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.ink, flexShrink: 0 }}>{l.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Inquiries */}
          <div style={{ background: c.paper, border: `1px solid ${c.line}`, borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ fontFamily: fontSerif, fontSize: 17, fontWeight: 700, color: c.ink, marginBottom: 16 }}>Recent inquiries</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {INQUIRIES.map((q, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: c.ink, lineHeight: 1.3 }}>{q.property}</div>
                    <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>{q.date}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: q.statusTone, background: `${q.statusTone}15`, padding: '3px 8px', borderRadius: 999, flexShrink: 0 }}>{q.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: `linear-gradient(135deg, ${c.ink} 0%, #1a3a6e 100%)`, borderRadius: 14, padding: '22px 22px' }}>
            <div style={{ fontSize: 18, marginBottom: 8 }}>🔔</div>
            <div style={{ fontFamily: fontSerif, fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Set up alerts</div>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)', lineHeight: 1.5, marginBottom: 14 }}>Get notified the moment a new listing matches your criteria.</p>
            <button style={{ fontFamily: fontSans, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', padding: '9px 18px', borderRadius: 999, background: TONE, color: '#fff', border: 'none' }}>
              Create alert
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
