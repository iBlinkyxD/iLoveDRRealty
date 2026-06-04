import { useNavigate } from 'react-router-dom'
import { c, fontSans, fontSerif } from '../../design'
import logo from '../../assets/ILoveDRRealty_Logo.png'
import type { Role } from '../../App'

const ROLES_CONFIG: { key: Role; icon: string; desc: string; tone: string; email: string }[] = [
  { key: 'Buyer',    icon: '🔍', desc: 'Browse listings, save favorites, manage inquiries', tone: c.coral, email: 'buyer@demo.do'    },
  { key: 'Investor', icon: '📈', desc: 'Portfolio analytics, ROI tools, deal pipeline',     tone: c.sea,   email: 'investor@demo.do' },
  { key: 'Owner',    icon: '🔑', desc: 'Manage listings, bookings, and rental calendar',    tone: c.gold,  email: 'owner@demo.do'    },
  { key: 'Realtor',  icon: '🏘️', desc: 'Clients, listings, CRM pipeline, referrals',       tone: c.green, email: 'realtor@demo.do'  },
  { key: 'Admin',    icon: '🛡️', desc: 'Platform oversight, approvals, user management',    tone: c.ink,   email: 'admin@demo.do'    },
]

export default function RoleSelect() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(155deg, ${c.sidebar} 0%, #1a3a6e 50%, ${c.seaDeep} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: fontSans }}>
      <div style={{ width: '100%', maxWidth: 680 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ marginBottom: 28 }}>
            <img src={logo} alt="I Love DR Realty" style={{ height: 44, width: 'auto', display: 'block', margin: '0 auto' }} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: c.gold, marginBottom: 12 }}>
            Demo Dashboard
          </div>
          <h1 style={{ fontFamily: fontSerif, fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-.02em', margin: '0 0 12px' }}>
            Explore by role
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.6)', lineHeight: 1.65 }}>
            Tap a role to preview its dashboard — no account needed.
          </p>
        </div>

        {/* Role cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ROLES_CONFIG.map(r => (
            <button key={r.key} onClick={() => navigate(`/${r.key.toLowerCase()}`)} style={{
              background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
              borderRadius: 14, padding: '16px 20px', cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 16, transition: 'all .15s',
              fontFamily: fontSans,
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: r.tone, display: 'grid', placeItems: 'center', fontSize: 22, flexShrink: 0 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{r.key}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)', lineHeight: 1.4 }}>{r.desc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.35)', fontFamily: 'monospace', marginBottom: 6 }}>{r.email}</div>
                <span style={{ fontSize: 12, fontWeight: 700, color: r.tone }}>Enter →</span>
              </div>
            </button>
          ))}
        </div>

        <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,.3)', textAlign: 'center', marginTop: 24, lineHeight: 1.5 }}>
          Demo accounts are illustrative — no real login required. All data is placeholder.
        </p>
      </div>
    </div>
  )
}
