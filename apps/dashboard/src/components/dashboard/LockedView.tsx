import { useState, useEffect } from 'react'
import { Lock, Clock } from 'lucide-react'
import type { Role } from '../../App'
import { OwnerHome } from './OwnerHome'
import { RealtorHome } from './RealtorHome'
import { submitUpgradeRequest, getMyUpgradeRequests } from '../../api/upgradeRequests'

const ROLE_API: Partial<Record<Role, 'owner' | 'realtor'>> = {
  Owner: 'owner',
  Realtor: 'realtor',
}

export function LockedView({ tab, tone }: { tab: Role; tone: string }) {
  const label = tab === 'Owner' ? 'Property Owner' : 'Realtor'
  const desc = tab === 'Owner'
    ? 'List your properties, manage bookings, track leads, and view earnings.'
    : 'Manage listings, run your sales pipeline, and close deals.'

  const [status, setStatus] = useState<'idle' | 'submitting' | 'pending'>('idle')

  useEffect(() => {
    const apiRole = ROLE_API[tab]
    if (!apiRole) return
    getMyUpgradeRequests().then(reqs => {
      if (reqs.some(r => r.requested_role === apiRole && r.status === 'pending')) {
        setStatus('pending')
      }
    }).catch(() => {})
  }, [tab])

  async function handleRequest() {
    const apiRole = ROLE_API[tab]
    if (!apiRole) return
    setStatus('submitting')
    try {
      await submitUpgradeRequest(apiRole)
      setStatus('pending')
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none select-none" style={{ opacity: 0.35 }}>
        {tab === 'Owner'   && <OwnerHome   go={() => {}} tone={tone} />}
        {tab === 'Realtor' && <RealtorHome go={() => {}} tone={tone} />}
      </div>

      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(248,249,252,0.72)' }}>
        <div className="text-center max-w-xs px-6 py-8">
          {status === 'pending' ? (
            <>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${tone}18` }}>
                <Clock size={24} style={{ color: tone }} />
              </div>
              <div className="font-sans text-xl font-bold text-ink mb-2">Request submitted</div>
              <p className="text-[13px] text-dim leading-[1.55]">
                Your {label} upgrade request is pending admin review. You'll have full access once approved.
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${tone}18` }}>
                <Lock size={24} style={{ color: tone }} />
              </div>
              <div className="font-sans text-xl font-bold text-ink mb-2">Unlock {label} Access</div>
              <p className="text-[13px] text-dim leading-[1.55] mb-5">{desc}</p>
              <button
                onClick={handleRequest}
                disabled={status === 'submitting'}
                className="px-6 py-2.5 rounded-full text-[13px] font-bold text-white border-none cursor-pointer disabled:opacity-60"
                style={{ background: tone }}
              >
                {status === 'submitting' ? 'Requesting…' : 'Request Upgrade →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
