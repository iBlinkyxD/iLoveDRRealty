import type { UserInfo } from '../lib/auth'
import { AdminHome } from './admin/Home'
import { AdminUsers } from './admin/Users'
import { AdminListings } from './admin/Listings'
import { Analytics } from './admin/Analytics'
import { AdminSettings } from './admin/Settings'

const PAGE_TITLES: Record<string, string> = {
  home:      'Platform overview',
  users:     'User management',
  listings:  'Listings',
  analytics: 'Analytics',
  settings:  'Settings',
}
const PAGE_SUBS: Record<string, string> = {
  home:      'Listings, users, and platform activity',
  users:     'Manage users, roles, and upgrade requests',
  listings:  'Manage listings requests',
  analytics: 'Platform metrics · May 2026',
  settings:  'Platform configuration',
}

export default function AdminDash({ go, view = 'home', user, onUserUpdate }: { go: (v: string, openId?: string) => void; view?: string; user: UserInfo; onUserUpdate: (updates: Partial<UserInfo>) => void }) {
  function renderView() {
    switch (view) {
      case 'users':    return <AdminUsers />
      case 'listings': return <AdminListings />
      case 'analytics': return <Analytics />
      case 'settings': return <AdminSettings user={user} onUserUpdate={onUserUpdate} />
      default:         return <AdminHome go={go} />
    }
  }

  return (
    <div>
      <div className="mb-7">
        <div className="text-[11px] font-bold tracking-[.14em] uppercase text-coral mb-1.5">Admin</div>
        <h1 className="font-sans text-[22px] sm:text-[28px] font-extrabold text-ink tracking-[-0.02em] mb-1">
          {PAGE_TITLES[view] ?? 'Platform overview'}
        </h1>
        <p className="text-sm text-ink2">{PAGE_SUBS[view] ?? ''}</p>
      </div>
      {renderView()}
    </div>
  )
}
