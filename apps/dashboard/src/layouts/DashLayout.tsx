import React from 'react'
import { c, fontSans, fontSerif } from '../design'
import type { Role } from '../App'
import logo from '../assets/ILoveDRRealty_Logo.png'

const LANDING_URL = import.meta.env.VITE_LANDING_URL ?? 'https://ilovedrrealty.com'

const SIDEBAR_W = 232

const NAV: Record<Role, { icon: string; label: string; view: string }[]> = {
  Buyer: [
    { icon: '🏠', label: 'Home',         view: 'home'     },
    { icon: '🔍', label: 'Search',       view: 'search'   },
    { icon: '❤️', label: 'Saved',        view: 'saved'    },
    { icon: '💬', label: 'Inquiries',    view: 'inquiries'},
    { icon: '📅', label: 'Viewings',     view: 'viewings' },
    { icon: '⚙️', label: 'Settings',     view: 'settings' },
  ],
  Investor: [
    { icon: '📊', label: 'Overview',     view: 'home'      },
    { icon: '🏘️', label: 'Portfolio',   view: 'portfolio' },
    { icon: '🧮', label: 'ROI Calculator', view: 'calculator' },
    { icon: '📈', label: 'Market Data',  view: 'market'    },
    { icon: '🔔', label: 'Deal Alerts',  view: 'alerts'    },
    { icon: '⚙️', label: 'Settings',    view: 'settings'  },
  ],
  Owner: [
    { icon: '📊', label: 'Overview',     view: 'home'      },
    { icon: '🏠', label: 'My Listings',  view: 'listings'  },
    { icon: '📅', label: 'Calendar',     view: 'calendar'  },
    { icon: '💬', label: 'Leads',        view: 'leads'     },
    { icon: '💰', label: 'Revenue',      view: 'revenue'   },
    { icon: '⚙️', label: 'Settings',    view: 'settings'  },
  ],
  Realtor: [
    { icon: '📊', label: 'Overview',     view: 'home'      },
    { icon: '👥', label: 'Clients',      view: 'clients'   },
    { icon: '🏘️', label: 'Listings',    view: 'listings'  },
    { icon: '📋', label: 'Pipeline',     view: 'pipeline'  },
    { icon: '🤝', label: 'Referrals',    view: 'referrals' },
    { icon: '⚙️', label: 'Settings',    view: 'settings'  },
  ],
  Admin: [
    { icon: '📊', label: 'Overview',     view: 'home'       },
    { icon: '✅', label: 'Approvals',    view: 'approvals'  },
    { icon: '👥', label: 'Users',        view: 'users'      },
    { icon: '🏠', label: 'Listings',     view: 'listings'   },
    { icon: '📈', label: 'Analytics',    view: 'analytics'  },
    { icon: '⚙️', label: 'Settings',    view: 'settings'   },
  ],
}

const ROLE_TONE: Record<Role, string> = {
  Buyer: c.coral, Investor: c.sea, Owner: c.gold, Realtor: c.green, Admin: c.ink,
}
const ROLE_ICON: Record<Role, string> = {
  Buyer: '🔍', Investor: '📈', Owner: '🔑', Realtor: '🏘️', Admin: '🛡️',
}
const ROLE_EMAIL: Record<Role, string> = {
  Buyer: 'buyer@demo.do', Investor: 'investor@demo.do',
  Owner: 'owner@demo.do', Realtor: 'realtor@demo.do', Admin: 'admin@demo.do',
}

interface Props {
  role: Role
  view: string
  go: (v: string) => void
  onLogout: () => void
  children: React.ReactNode
}

export default function DashLayout({ role, view, go, onLogout, children }: Props) {
  const tone = ROLE_TONE[role]
  const navItems = NAV[role]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: fontSans }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: SIDEBAR_W, flexShrink: 0, background: c.sidebar,
        display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
      }}>
        {/* Logo */}
        <div style={{ padding: '22px 20px 18px' }}>
          <a href={LANDING_URL} style={{ display: 'block', lineHeight: 0 }}>
            <img src={logo} alt="I Love DR Realty" style={{ height: 32, width: 'auto', display: 'block' }} />
          </a>
        </div>

        {/* Role badge */}
        <div style={{ margin: '0 12px 20px', padding: '10px 12px', borderRadius: 10, background: `${tone}20`, border: `1px solid ${tone}40`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{ROLE_ICON[role]}</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: tone }}>{role}</div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.4)', fontFamily: 'monospace' }}>demo</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => {
            const active = view === item.view
            return (
              <button key={item.view} onClick={() => go(item.view)} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: active ? `${tone}25` : 'transparent',
                color: active ? tone : 'rgba(255,255,255,.6)',
                fontFamily: fontSans, fontSize: 13.5, fontWeight: active ? 700 : 500,
                transition: 'all .12s', textAlign: 'left',
              }}>
                <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
                {active && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: tone }} />}
              </button>
            )
          })}
        </nav>

        {/* Bottom — user + logout */}
        <div style={{ padding: '12px 12px 20px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 8px', marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: tone, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {role[0]}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Demo {role}</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.4)', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ROLE_EMAIL[role]}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{
            width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,.12)',
            background: 'transparent', color: 'rgba(255,255,255,.5)', fontFamily: fontSans, fontSize: 12.5,
            fontWeight: 500, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            ← Switch role
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ marginLeft: SIDEBAR_W, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <div style={{ height: 60, background: c.paper, borderBottom: `1px solid ${c.line}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16, position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: c.ink2 }}>
              {navItems.find(n => n.view === view)?.label ?? 'Dashboard'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: `${tone}15`, color: tone, fontWeight: 600 }}>
              {ROLE_ICON[role]} {role} · Demo
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: tone, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
              {role[0]}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: '28px 28px 40px', background: '#F8F9FC' }}>
          {children}
        </div>
      </main>

    </div>
  )
}
