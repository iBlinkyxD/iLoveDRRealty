import { AdminHome } from './admin/Home'
import { UpgradeRequests } from './admin/UpgradeRequests'
import { AdminUsers } from './admin/Users'
import { AdminListings } from './admin/Listings'
import { Analytics } from './admin/Analytics'
import { AdminSettings } from './admin/Settings'

const PAGE_TITLES: Record<string, string> = {
  home:             'Platform overview',
  'upgrade-requests': 'Upgrade Requests',
  users:            'User management',
  listings:         'Listings',
  analytics:        'Analytics',
  settings:         'Settings',
}
const PAGE_SUBS: Record<string, string> = {
  home:             '8 items pending approval · Last sync 4m ago',
  'upgrade-requests': 'Review and action role upgrade requests',
  users:            '1,284 total users · 2 pending verification',
  listings:         '4,847 active listings · 3 pending review',
  analytics:        'Platform metrics · May 2026',
  settings:         'Platform configuration',
}

export default function AdminDash({ go, view = 'home' }: { go: (v: string) => void; view?: string }) {
  function renderView() {
    switch (view) {
      case 'upgrade-requests': return <UpgradeRequests />
      case 'users':            return <AdminUsers />
      case 'listings':  return <AdminListings />
      case 'analytics': return <Analytics />
      case 'settings':  return <AdminSettings />
      default:          return <AdminHome go={go} />
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
