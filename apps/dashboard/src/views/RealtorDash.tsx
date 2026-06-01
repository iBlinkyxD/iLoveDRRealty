import React, { useState } from 'react'
import { c, fontSans, fontSerif } from '../design'

const TONE = c.green

const PIPELINE: { name: string; property: string; value: string; stage: 'Prospect' | 'Showing' | 'Offer' }[] = [
  { name: 'James Wilson',   property: 'Oceanfront Villa — Cap Cana',     value: '$2.45M', stage: 'Offer'    },
  { name: 'Lucia Ferreira', property: 'Penthouse — Piantini',             value: '$389K',  stage: 'Showing'  },
  { name: 'David Park',     property: 'Golf Villa — Punta Cana',          value: '$875K',  stage: 'Showing'  },
  { name: 'Marie Dubois',   property: 'Cliffside Villa — Sosúa',          value: '$1.65M', stage: 'Prospect' },
  { name: 'Tom Bradley',    property: 'Garden Condo — Cabarete',          value: '$245K',  stage: 'Prospect' },
  { name: 'Ana González',   property: 'Commercial Building — Sto. Dgo.',  value: '$540K',  stage: 'Prospect' },
]

const LISTINGS = [
  { name: 'Oceanfront Villa — Cap Cana',     status: 'Active', leads: 8,  views: 1420, price: '$2.45M' },
  { name: 'Golf Villa — Punta Cana',         status: 'Active', leads: 5,  views: 892,  price: '$875K'  },
  { name: 'Garden Condo — Cabarete',         status: 'Active', leads: 3,  views: 554,  price: '$245K'  },
  { name: 'Beachfront Residence — Samaná',   status: 'Review', leads: 0,  views: 0,    price: '$1.2M'  },
]

const STAGE_TONE = { Prospect: c.muted, Showing: c.gold, Offer: c.coral }
const STAGES: ('Prospect' | 'Showing' | 'Offer')[] = ['Prospect', 'Showing', 'Offer']

export default function RealtorDash({ go }: { go: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'listings'>('pipeline')

  return (
    <div style={{ fontFamily: fontSans, maxWidth: 1100 }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: TONE, marginBottom: 6 }}>Realtor portal</div>
        <h1 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 800, color: c.ink, margin: '0 0 4px', letterSpacing: '-.02em' }}>Realtor dashboard</h1>
        <p style={{ fontSize: 14, color: c.ink2 }}>18 active clients · 3 pending closings this month</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '👥', label: 'Active Clients',    value: '18',     sub: '+4 this month'          },
          { icon: '🏘️', label: 'Listings',          value: '24',     sub: '4 pending review'       },
          { icon: '🤝', label: 'Pending Closings',  value: '3',      sub: 'Est. $4.1M total'       },
          { icon: '📋', label: 'Leads This Month',  value: '47',     sub: '+22% vs prior month'    },
        ].map((s, i) => (
          <div key={i} style={{ background: i === 2 ? `linear-gradient(135deg, ${TONE} 0%, #155c2e 100%)` : c.paper, border: i === 2 ? 'none' : `1px solid ${c.line}`, borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: fontSerif, fontSize: 24, fontWeight: 700, color: i === 2 ? '#fff' : c.ink, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: i === 2 ? 'rgba(255,255,255,.8)' : c.ink2, marginTop: 5 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: i === 2 ? 'rgba(255,255,255,.55)' : c.muted, marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>

        {/* Pipeline / listings tabs */}
        <div style={{ background: c.paper, border: `1px solid ${c.line}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${c.line}` }}>
            {(['pipeline', 'listings'] as const).map(tab => (
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
            {activeTab === 'pipeline' && (
              <div>
                {/* Stage columns */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                  {STAGES.map(stage => {
                    const items = PIPELINE.filter(p => p.stage === stage)
                    const tone = STAGE_TONE[stage]
                    return (
                      <div key={stage}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: tone, textTransform: 'uppercase', letterSpacing: '.1em' }}>{stage}</div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: tone, background: `${tone}18`, padding: '2px 7px', borderRadius: 999 }}>{items.length}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {items.map((item, j) => (
                            <div key={j} style={{ background: c.paper2, border: `1px solid ${c.lineSoft}`, borderRadius: 9, padding: '10px 12px', borderLeft: `3px solid ${tone}` }}>
                              <div style={{ fontSize: 12.5, fontWeight: 700, color: c.ink, marginBottom: 4 }}>{item.name}</div>
                              <div style={{ fontSize: 11, color: c.muted, lineHeight: 1.3, marginBottom: 5 }}>{item.property}</div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: TONE }}>{item.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {LISTINGS.map((l, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: c.paper2 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: `${TONE}20`, display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>🏠</div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: c.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                      <div style={{ fontSize: 11.5, color: c.muted, marginTop: 2 }}>{l.price} · {l.views.toLocaleString()} views · {l.leads} leads</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: l.status === 'Active' ? c.green : c.gold, background: `${l.status === 'Active' ? c.green : c.gold}18`, padding: '3px 8px', borderRadius: 999, flexShrink: 0 }}>{l.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Commission tracker */}
          <div style={{ background: c.paper, border: `1px solid ${c.line}`, borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ fontFamily: fontSerif, fontSize: 17, fontWeight: 700, color: c.ink, marginBottom: 16 }}>Commissions</div>
            {[
              { label: 'Earned YTD',     value: '$62,400', tone: c.green },
              { label: 'Pending',        value: '$18,700', tone: c.gold  },
              { label: 'Referral share', value: '$4,200',  tone: c.sea   },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: i < 2 ? `1px solid ${c.lineSoft}` : 'none' }}>
                <span style={{ fontSize: 13.5, color: c.ink2 }}>{row.label}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: row.tone, fontFamily: fontSerif }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ background: `linear-gradient(135deg, ${c.ink} 0%, #1a3a6e 100%)`, borderRadius: 14, padding: '22px 22px' }}>
            <div style={{ fontFamily: fontSerif, fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Quick actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['+ Add new listing', '+ Add client', 'Share social kit', 'Request co-listing'].map((label, i) => (
                <button key={i} style={{ padding: '10px 14px', borderRadius: 9, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.8)', fontFamily: fontSans, fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
