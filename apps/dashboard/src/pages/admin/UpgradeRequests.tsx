import { useEffect, useState } from 'react'
import { Check, X, Key, Building2, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAdminUpgradeRequests, approveUpgradeRequest, rejectUpgradeRequest } from '../../api/admin'
import type { AdminUpgradeRequest } from '../../api/admin'
import { TONE, FilterPills } from './shared'

const ROLE_ICON = { owner: Key, realtor: Building2 }
const ROLE_LABEL = { owner: 'Property Owner', realtor: 'Realtor' }
const ROLE_COLOR = { owner: '#f0a800', realtor: '#1f7a3d' }

const STATUS_STYLE: Record<string, string> = {
  pending:  'bg-amber-50  text-amber-700  border-amber-200',
  approved: 'bg-green-50  text-green-700  border-green-200',
  rejected: 'bg-red-50    text-red-700    border-red-200',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function UpgradeRequests() {
  const [allRequests, setAllRequests] = useState<AdminUpgradeRequest[]>([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [working, setWorking] = useState(false)

  async function load() {
    setLoading(true)
    const data = await getAdminUpgradeRequests()
    setAllRequests(data)
    setLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const requests = filter === 'All'
    ? allRequests
    : allRequests.filter(r => r.status === filter.toLowerCase())

  async function handleApprove(id: string) {
    setWorking(true)
    await approveUpgradeRequest(id)
    await load()
    setWorking(false)
    toast.success('Request approved.')
  }

  async function handleReject(id: string) {
    if (!rejectReason.trim()) return
    setWorking(true)
    await rejectUpgradeRequest(id, rejectReason.trim())
    setRejectingId(null)
    setRejectReason('')
    await load()
    setWorking(false)
    toast.success('Request rejected.')
  }

  const counts = {
    pending:  allRequests.filter(r => r.status === 'pending').length,
    approved: allRequests.filter(r => r.status === 'approved').length,
    rejected: allRequests.filter(r => r.status === 'rejected').length,
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {(['pending', 'approved', 'rejected'] as const).map(s => (
          <div key={s} className="bg-paper border border-line rounded-xl px-4 py-3.5 text-center">
            <div className="font-sans text-2xl font-bold text-ink">{counts[s]}</div>
            <div className="text-[11.5px] text-dim capitalize mt-0.5">{s}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <FilterPills
          options={['All', 'Pending', 'Approved', 'Rejected']}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {/* List */}
      <div className="bg-paper border border-line rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-dim">Loading…</div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-sm text-dim">No requests found.</div>
        ) : (
          <div className="divide-y divide-line-soft">
            {requests.map(req => {
              const Icon = ROLE_ICON[req.requested_role] ?? Key
              const roleColor = ROLE_COLOR[req.requested_role] ?? TONE
              const roleLabel = ROLE_LABEL[req.requested_role] ?? req.requested_role
              const isRejectOpen = rejectingId === req.id

              return (
                <div key={req.id} className="px-5 py-4">
                  {/* Top row */}
                  <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
                    <div
                      className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white text-[13px] font-bold mt-0.5"
                      style={{ background: TONE }}
                    >
                      {req.user_display_name[0]?.toUpperCase() ?? '?'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-ink">{req.user_display_name}</div>
                      <div className="text-[12px] text-dim truncate">{req.user_email}</div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span
                          className="flex items-center gap-1 text-[11.5px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: `${roleColor}14`, color: roleColor }}
                        >
                          <Icon size={11} /> {roleLabel}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLE[req.status]}`}>
                          {req.status}
                        </span>
                        <span className="text-[11.5px] text-dim">{fmt(req.created_at)}</span>
                      </div>
                      {req.rejection_reason && (
                        <div className="mt-1.5 text-[12px] text-red-600">Reason: {req.rejection_reason}</div>
                      )}
                    </div>

                    {/* Actions — only for pending */}
                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={working}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-0 cursor-pointer text-[12.5px] font-semibold text-white disabled:opacity-50"
                          style={{ background: '#1f7a3d' }}
                        >
                          <Check size={13} /> Approve
                        </button>
                        <button
                          onClick={() => { setRejectingId(isRejectOpen ? null : req.id); setRejectReason('') }}
                          disabled={working}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line cursor-pointer text-[12.5px] font-semibold text-ink2 bg-paper disabled:opacity-50"
                        >
                          <X size={13} /> Reject
                          <ChevronDown size={12} style={{ transform: isRejectOpen ? 'rotate(180deg)' : undefined, transition: 'transform 150ms' }} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Realtor questionnaire answers */}
                  {req.requested_role === 'realtor' && (req.license_number || req.territory || req.years_experience != null || req.specialties || req.bio) && (
                    <div className="mt-3 ml-12 grid grid-cols-2 gap-x-6 gap-y-2 bg-paper2 rounded-xl px-4 py-3 sm:grid-cols-3">
                      {req.license_number && (
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wide text-dim mb-0.5">License #</div>
                          <div className="text-[12.5px] text-ink">{req.license_number}</div>
                        </div>
                      )}
                      {req.years_experience != null && (
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wide text-dim mb-0.5">Experience</div>
                          <div className="text-[12.5px] text-ink">{req.years_experience} yr{req.years_experience !== 1 ? 's' : ''}</div>
                        </div>
                      )}
                      {req.territory && (
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wide text-dim mb-0.5">Territory</div>
                          <div className="text-[12.5px] text-ink">{req.territory}</div>
                        </div>
                      )}
                      {req.specialties && (
                        <div className="col-span-2 sm:col-span-3">
                          <div className="text-[10px] font-bold uppercase tracking-wide text-dim mb-0.5">Specialties</div>
                          <div className="text-[12.5px] text-ink">{req.specialties}</div>
                        </div>
                      )}
                      {req.bio && (
                        <div className="col-span-2 sm:col-span-3">
                          <div className="text-[10px] font-bold uppercase tracking-wide text-dim mb-0.5">Bio</div>
                          <div className="text-[12.5px] text-ink2 leading-relaxed">{req.bio}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reject reason input — inline expansion */}
                  {isRejectOpen && (
                    <div className="mt-3 ml-12 flex gap-2">
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="Reason for rejection…"
                        className="flex-1 px-3 py-2 rounded-lg border border-line bg-white text-[13px] text-ink outline-none focus:border-coral"
                        autoFocus
                      />
                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={!rejectReason.trim() || working}
                        className="px-4 py-2 rounded-lg border-0 cursor-pointer text-[12.5px] font-bold text-white disabled:opacity-50"
                        style={{ background: '#e10f1f' }}
                      >
                        Confirm
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
