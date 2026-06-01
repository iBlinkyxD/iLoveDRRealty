import React, { useState } from 'react'
import { c, fontSans, fontSerif } from '../design'

const TONE = c.gold

const LISTINGS = [
  { id: 1, name: 'Villa Palma — Sosúa',          status: 'Active', inquiries: 12, bookings: 3, price: '$3,200/mo', views: 847  },
  { id: 2, name: 'Condo 4B — Puerto Plata',       status: 'Active', inquiries: 7,  bookings: 1, price: '$1,800/mo', views: 423  },
  { id: 3, name: 'Studio Apt — Cabarete Beach',   status: 'Draft',  inquiries: 0,  bookings: 0, price: '$950/mo',   views: 0    },
]

const BOOKINGS = [
  { guest: 'James & Sara Wilson',   dates: 'Jun 6–13',  nights: 7, total: '$3,200', status: 'Confirmed', tone: c.green },
  { guest: 'Famille Lecomte',       dates: 'Jun 18–25', nights: 7, total: '$3,200', status: 'Pending',   tone: c.gold  },
  { guest: 'Marco Ferretti',        dates: 'Jul 1–8',   nights: 7, total: '$3,200', status: 'Confirmed', tone: c.green },
]

const LEADS = [
  { name: 'Carlos Méndez',    query: 'Interested in long-term lease',  time: '2h ago',  tone: c.coral },
  { name: 'Emily Thompson',   query: 'Asking about pet policy',         time: '5h ago',  tone: c.sea   },
  { name: 'Rui Barbosa',      query: 'Requesting video walkthrough',    time: 'Yesterday', tone: c.gold },
  { name: 'Marta Quispe',     query: 'Price negotiation inquiry',       time: '2d ago',  tone: c.muted },
]

export default function OwnerDash({ go }: { go: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings'>('listings')

  return (
    <div style={{ fontFamily: fontSans, maxWidth: 1100 }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: TONE, marginBottom: 6 }}>Property owner</div>
        <h1 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 800, color: c.ink, margin: '0 0 4px', letterSpacing: '-.02em' }}>Owner dashboard</h1>
        <p style={{ fontSize: 14, color: c.ink2 }}>3 listings · 2 active · 5 upcoming bookings</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '🏠', label: 'Active Listings',   value: '2',       sub: '1 draft'            },
          { icon: '📅', label: 'Upcoming Bookings', value: '5',       sub: 'Next: Jun 6'         },
          { icon: '💬', label: 'Open Leads',        value: '19',      sub: '4 new today'         },
          { icon: '💰', label: 'Revenue This Month', value: '$8,400', sub: '+12% vs last month'  },
        ].map((s, i) => (
          <div key={i} style={{ background: i === 3 ? `linear-gradient(135deg, ${c.green} 0%, #155c2e 100%)` : c.paper, border: i === 3 ? 'none' : `1px solid ${c.line}`, borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: fontSerif, fontSize: 24, fontWeight: 700, color: i === 3 ? '#fff' : c.ink, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: i === 3 ? 'rgba(255,255,255,.8)' : c.ink2, marginTop: 5 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: i === 3 ? 'rgba(255,255,255,.55)' : c.muted, marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>

        {/* Listings / bookings tabs */}
        <div style={{ background: c.paper, border: `1px solid ${c.line}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${c.line}` }}>
            {(['listings', 'bookings'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: '14px 0', border: 'none', cursor: 'pointer', fontFamily: fontSans,
                fontSize: 13.5, fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? TONE : c.ink2,
                background: activeTab === tab ? `${TONE}10` : 'transparent',
                borderBottom: `2px solid ${activeTab === tab ? TONE : 'transparent'}`,
                textTransform: 'capitalize',
              }}>{tab}</button>
            ))}
          </div>

          <div style={{ padding: '18px 20px' }}>
            {activeTab === 'listings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {LISTINGS.map(l => (
                  <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 10, background: c.paper2 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: `${TONE}25`, display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>🏠</div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: c.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                      <div style={{ fontSize: 11.5, color: c.muted, marginTop: 2 }}>{l.price} · {l.views.toLocaleString()} views</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: l.status === 'Active' ? c.green : c.muted, background: `${l.status === 'Active' ? c.green : c.muted}18`, padding: '3px 8px', borderRadius: 999, display: 'block', marginBottom: 4 }}>{l.status}</span>
                      <span style={{ fontSize: 11, color: c.muted }}>{l.inquiries} leads</span>
                    </div>
                  </div>
                ))}
                <button style={{ marginTop: 4, width: '100%', padding: '11px 0', borderRadius: 999, border: `1.5px solid ${TONE}`, background: 'transparent', color: TONE, fontFamily: fontSans, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  + Add new listing
                </button>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {BOOKINGS.map((b, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: c.paper2, border: `1px solid ${c.lineSoft}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: c.ink }}>{b.guest}</div>
                        <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{b.dates} · {b.nights} nights</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: b.tone, background: `${b.tone}18`, padding: '3px 8px', borderRadius: 999 }}>{b.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: c.green }}>{b.total}</span>
                      {b.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={{ fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 8, border: 'none', background: c.green, color: '#fff', cursor: 'pointer' }}>Accept</button>
                          <button style={{ fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 8, border: `1px solid ${c.line}`, background: '#fff', color: c.ink2, cursor: 'pointer' }}>Decline</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Leads */}
        <div style={{ background: c.paper, border: `1px solid ${c.line}`, borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: fontSerif, fontSize: 17, fontWeight: 700, color: c.ink }}>Recent leads</div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: c.coral, background: `${c.coral}15`, padding: '3px 9px', borderRadius: 999 }}>4 new</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {LEADS.map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingBottom: 12, borderBottom: i < LEADS.length - 1 ? `1px solid ${c.lineSoft}` : 'none' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: l.tone, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{l.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c.ink }}>{l.name}</div>
                  <div style={{ fontSize: 12, color: c.ink2, lineHeight: 1.35, margin: '2px 0 4px' }}>{l.query}</div>
                  <div style={{ fontSize: 11, color: c.muted }}>{l.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button style={{ marginTop: 14, width: '100%', padding: '11px 0', borderRadius: 999, border: `1.5px solid ${c.line}`, background: 'transparent', color: c.ink2, fontFamily: fontSans, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            View all leads
          </button>
        </div>
      </div>
    </div>
  )
}
