import { User } from 'lucide-react'
import type { Role } from '../App'
import type { UserInfo } from '../lib/auth'
import { Card } from '../components/dashboard/shared'

export function Profile({ user, role, tone }: { user: UserInfo; role: Role; tone: string }) {
  return (
    <Card title={<><User size={14} />Profile</>}>
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-14 h-14 rounded-full grid place-items-center text-white text-xl font-bold shrink-0"
          style={{ background: `linear-gradient(135deg,${tone},${tone}aa)` }}
        >
          {user.display_name[0].toUpperCase()}
        </div>
        <div>
          <div className="font-sans text-[18px] font-bold text-ink">{user.display_name}</div>
          <div className="text-[12.5px] text-dim">{role} · {user.email}</div>
        </div>
      </div>
      {[['Full name', user.display_name], ['Email', user.email], ['Role', role]].map(([label, val], i) => (
        <div key={i} className="flex justify-between py-3 border-b border-line text-[13px]">
          <span className="text-dim font-semibold">{label}</span>
          <span className="text-ink font-medium">{val}</span>
        </div>
      ))}
    </Card>
  )
}
