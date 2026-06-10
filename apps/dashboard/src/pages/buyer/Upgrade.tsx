import { useEffect, useState } from 'react'
import { Key, Building2, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitUpgradeRequest, getMyUpgradeRequests } from '../../api/upgradeRequests'
import type { UpgradeRequest } from '../../api/upgradeRequests'

const ROLES = [
  {
    key: 'owner' as const,
    label: 'Property Owner',
    Icon: Key,
    tone: '#f0a800',
    bg: '#fff9ed',
    desc: 'List your properties, manage bookings, track leads, and view earnings.',
  },
  {
    key: 'realtor' as const,
    label: 'Realtor',
    Icon: Building2,
    tone: '#1f7a3d',
    bg: '#f0faf4',
    desc: 'Manage listings, run your sales pipeline, and close deals.',
  },
]

export function Upgrade() {
  const [pending, setPending] = useState<UpgradeRequest | null>(null)
  const [submitting, setSubmitting] = useState<'owner' | 'realtor' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyUpgradeRequests()
      .then(reqs => {
        const existing = reqs.find(r => r.status === 'pending')
        if (existing) setPending(existing)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleRequest(role: 'owner' | 'realtor') {
    setSubmitting(role)
    try {
      const req = await submitUpgradeRequest(role)
      setPending(req)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      toast.error(msg ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) return null

  if (pending) {
    const role = ROLES.find(r => r.key === pending.requested_role)!
    return (
      <div className="max-w-md">
        <div className="bg-paper border border-line rounded-2xl p-7 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `${role.tone}18` }}>
            <Clock size={26} style={{ color: role.tone }} />
          </div>
          <div>
            <div className="font-sans text-[19px] font-bold text-ink mb-1">Request submitted</div>
            <p className="text-[13.5px] text-dim leading-[1.6]">
              Your request to become a <span className="font-semibold text-ink">{role.label}</span> is pending review.
              You'll have full access once an admin approves it.
            </p>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold"
            style={{ background: `${role.tone}14`, color: role.tone }}
          >
            <CheckCircle size={13} />
            Pending admin review
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[14px] text-dim mb-6 max-w-lg leading-[1.6]">
        Expand your access by requesting a role upgrade. Once an admin reviews and approves your request, you'll unlock the full feature set for that role.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl">
        {ROLES.map(({ key, label, Icon, tone, bg, desc }) => (
          <div
            key={key}
            className="bg-paper border border-line rounded-2xl p-6 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon size={20} style={{ color: tone }} />
              </div>
              <div className="font-sans text-[17px] font-bold text-ink">{label}</div>
            </div>
            <p className="text-[13px] text-dim leading-[1.6] flex-1">{desc}</p>
            <button
              onClick={() => handleRequest(key)}
              disabled={submitting !== null}
              className="w-full py-2.5 rounded-xl text-[13.5px] font-bold text-white border-0 cursor-pointer transition-opacity duration-120 disabled:opacity-60"
              style={{ background: tone }}
            >
              {submitting === key ? 'Requesting…' : `Request ${label} Access`}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
