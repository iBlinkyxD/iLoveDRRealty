import React, { useState } from 'react'
import {
  LayoutDashboard, Heart, Search, MessageCircle, CalendarDays, Calculator,
  BookOpen, User, TrendingUp, ClipboardList, Globe, Home, Bell, DollarSign,
  Building2, GitBranch, CircleCheck, Users, BarChart, Settings,
  Key, Shield, LogOut, Menu, X, type LucideIcon,
} from 'lucide-react'
import type { Role } from '../App'
import logo from '../assets/ILoveDRRealty_Logo.png'

const LANDING_URL = import.meta.env.VITE_LANDING_URL ?? 'https://ilovedrrealty.com'

const ROLE_TONE: Record<Role, string> = {
  Buyer: '#e10f1f', Investor: '#0b63ab', Owner: '#f0a800', Realtor: '#1f7a3d', Admin: '#0d9488',
}
const ROLE_ICON: Record<Role, LucideIcon> = {
  Buyer: Search, Investor: TrendingUp, Owner: Key, Realtor: Building2, Admin: Shield,
}
const ROLE_EMAIL: Record<Role, string> = {
  Buyer: 'buyer@demo.do', Investor: 'investor@demo.do',
  Owner: 'owner@demo.do', Realtor: 'realtor@demo.do', Admin: 'admin@demo.do',
}

const NAV: Record<Role, { Icon: LucideIcon; label: string; view: string }[]> = {
  Buyer: [
    { Icon: LayoutDashboard, label: 'Dashboard',      view: 'home'       },
    { Icon: Heart,           label: 'Saved Homes',    view: 'saved'      },
    { Icon: Search,          label: 'Saved Searches', view: 'searches'   },
    { Icon: MessageCircle,   label: 'Inquiries',      view: 'inquiries'  },
    { Icon: CalendarDays,    label: 'Bookings',       view: 'bookings'   },
    { Icon: Calculator,      label: 'ROI Calculator', view: 'calculator' },
    { Icon: BookOpen,        label: 'Resources',      view: 'resources'  },
    { Icon: User,            label: 'Profile',        view: 'profile'    },
  ],
  Investor: [
    { Icon: LayoutDashboard, label: 'Overview',       view: 'home'      },
    { Icon: Heart,           label: 'Watchlist',      view: 'watchlist' },
    { Icon: TrendingUp,      label: 'Deal Analyses',  view: 'deals'     },
    { Icon: ClipboardList,   label: 'Buyer Requests', view: 'requests'  },
    { Icon: Globe,           label: 'Market Data',    view: 'market'    },
    { Icon: User,            label: 'Profile',        view: 'profile'   },
  ],
  Owner: [
    { Icon: LayoutDashboard, label: 'Overview',  view: 'home'     },
    { Icon: Home,            label: 'Listings',  view: 'listings' },
    { Icon: CalendarDays,    label: 'Calendar',  view: 'calendar' },
    { Icon: Bell,            label: 'Bookings',  view: 'bookings' },
    { Icon: MessageCircle,   label: 'Leads',     view: 'leads'    },
    { Icon: DollarSign,      label: 'Earnings',  view: 'earnings' },
    { Icon: User,            label: 'Profile',   view: 'profile'  },
  ],
  Realtor: [
    { Icon: LayoutDashboard, label: 'Overview',  view: 'home'     },
    { Icon: Building2,       label: 'Listings',  view: 'listings' },
    { Icon: ClipboardList,   label: 'Leads',     view: 'leads'    },
    { Icon: GitBranch,       label: 'Pipeline',  view: 'pipeline' },
    { Icon: CalendarDays,    label: 'Calendar',  view: 'calendar' },
    { Icon: User,            label: 'Profile',   view: 'profile'  },
  ],
  Admin: [
    { Icon: LayoutDashboard, label: 'Overview',  view: 'home'      },
    { Icon: CircleCheck,     label: 'Approvals', view: 'approvals' },
    { Icon: Users,           label: 'Users',     view: 'users'     },
    { Icon: Home,            label: 'Listings',  view: 'listings'  },
    { Icon: BarChart,        label: 'Analytics', view: 'analytics' },
    { Icon: Settings,        label: 'Settings',  view: 'settings'  },
  ],
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
  const RoleIcon = ROLE_ICON[role]
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeNav = () => setSidebarOpen(false)

  return (
    <div className="flex min-h-screen font-sans">

      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeNav}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`w-58 shrink-0 bg-nav flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-200 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo */}
        <div className="px-5 pt-5.5 pb-4.5 flex items-center justify-between">
          <a href={LANDING_URL} className="block leading-none">
            <img src={logo} alt="I Love DR Realty" className="h-8 w-auto block" />
          </a>
          <button
            onClick={closeNav}
            className="md:hidden border-0 bg-transparent cursor-pointer p-1 text-white/50 hover:text-white/80"
          >
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        <div
          className="mx-3 mb-5 px-3 py-2.5 rounded-2.5 flex items-center gap-2 border"
          style={{ background: `${tone}20`, borderColor: `${tone}40` }}
        >
          <RoleIcon size={15} style={{ color: tone, flexShrink: 0 }} />
          <div>
            <div className="text-xs font-bold" style={{ color: tone }}>{role}</div>
            <div className="text-[10.5px] font-mono" style={{ color: 'rgba(255,255,255,.4)' }}>demo</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 flex flex-col gap-0.5">
          {navItems.map(item => {
            const active = view === item.view
            return (
              <button
                key={item.view}
                onClick={() => { go(item.view); closeNav() }}
                className="flex items-center gap-2.5 w-full px-3 py-2.25 rounded-lg border-0 cursor-pointer text-[13.5px] text-left transition-all duration-120"
                style={{
                  background: active ? `${tone}22` : 'transparent',
                  color: active ? tone : 'rgba(255,255,255,.6)',
                  fontWeight: active ? 700 : 500,
                }}
              >
                <item.Icon size={15} className="shrink-0" />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: tone }} />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom — user + logout */}
        <div className="px-3 pb-5 pt-3 border-t border-white/8">
          <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
            <div
              className="w-8 h-8 rounded-full grid place-items-center text-white text-[13px] font-bold shrink-0"
              style={{ background: tone }}
            >
              {role[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold text-white truncate">Demo {role}</div>
              <div className="text-[10.5px] font-mono truncate" style={{ color: 'rgba(255,255,255,.4)' }}>
                {ROLE_EMAIL[role]}
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full px-3 py-2 rounded-lg border border-white/12 bg-transparent cursor-pointer text-[12.5px] font-medium text-left flex items-center gap-2 transition-colors duration-120 hover:bg-white/6"
            style={{ color: 'rgba(255,255,255,.5)' }}
          >
            <LogOut size={13} />
            Switch role
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="md:ml-58 flex-1 flex flex-col min-h-screen">

        {/* Topbar */}
        <div className="h-15 bg-paper border-b border-line flex items-center px-4 md:px-7 gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden border-0 bg-transparent cursor-pointer p-1.5 -ml-1 text-ink2"
          >
            <Menu size={20} />
          </button>
          <span className="flex-1 text-[13.5px] font-semibold text-ink2 truncate">
            {navItems.find(n => n.view === view)?.label ?? 'Dashboard'}
          </span>
          <div className="flex items-center gap-2.5">
            <div
              className="text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5"
              style={{ background: `${tone}15`, color: tone }}
            >
              <RoleIcon size={12} />
              {role} · Demo
            </div>
            <div
              className="w-8 h-8 rounded-full grid place-items-center text-white text-[13px] font-bold"
              style={{ background: tone }}
            >
              {role[0]}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 pb-10 sm:p-7 bg-[#F8F9FC]">
          {children}
        </div>
      </main>

    </div>
  )
}
