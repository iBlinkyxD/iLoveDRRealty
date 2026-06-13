import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search, Mail, ChevronDown, Check, X,
  UserPlus, UserCheck, CheckCircle2, XCircle, Archive, MoreHorizontal,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getAdminUsers, getAdminUpgradeRequests, getAdminActivityLog,
  suspendUser, unsuspendUser,
  approveUpgradeRequest, rejectUpgradeRequest,
  type AdminUser, type AdminUpgradeRequest, type ActivityEntry,
} from '../../api/admin'
import { TONE, FilterPills, ROLE_COLOR, STATUS_STYLE } from './shared'
import { AddUserPanel }    from '../../components/admin/AddUserPanel'
import { UserDetailPanel } from '../../components/admin/UserDetailPanel'

const ROLE_PILLS   = ['All', 'Buyer', 'Owner', 'Realtor', 'Admin']
const STATUS_PILLS = ['All', 'Active', 'Pending', 'Suspended']

const UPGRADE_ROLE_COLOR: Record<string, string> = { owner: '#f0a800', realtor: '#1f7a3d' }

type EventMeta = { Icon: typeof CheckCircle2; color: string }
const EVENT_META: Record<string, EventMeta> = {
  listing_approved: { Icon: CheckCircle2, color: '#16a34a' },
  listing_rejected: { Icon: XCircle,      color: '#dc2626' },
  listing_archived: { Icon: Archive,      color: '#7884a0' },
  upgrade_approved: { Icon: UserCheck,    color: '#0d9488' },
  upgrade_rejected: { Icon: XCircle,      color: '#dc2626' },
  edit_approved:    { Icon: CheckCircle2, color: '#16a34a' },
  edit_rejected:    { Icon: XCircle,      color: '#dc2626' },
  user_created:     { Icon: UserPlus,     color: '#0d9488' },
}
const DEFAULT_META: EventMeta = { Icon: CheckCircle2, color: '#7884a0' }
const USER_EVENTS = new Set(['upgrade_approved', 'upgrade_rejected', 'user_created'])

function UserAvatar({ url, initial, bg }: { url?: string | null; initial: string; bg: string }) {
  return url ? (
    <img src={url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
  ) : (
    <div className="w-8 h-8 rounded-full grid place-items-center text-white text-xs font-bold shrink-0" style={{ background: bg }}>
      {initial}
    </div>
  )
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
function fmtPhone(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  if (digits.length === 11) return `+${digits[0]} (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`
  return raw
}
function fmtRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
function roleColor(role: string) {
  return ROLE_COLOR[role.charAt(0).toUpperCase() + role.slice(1)] ?? '#7884a0'
}

export function AdminUsers() {
  const [users,        setUsers]        = useState<AdminUser[]>([])
  const [requests,     setRequests]     = useState<AdminUpgradeRequest[]>([])
  const [activity,     setActivity]     = useState<ActivityEntry[]>([])
  const [loading,      setLoading]      = useState(true)
  const [actLoading,   setActLoading]   = useState(true)
  const [roleFilter,   setRoleFilter]   = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [search,       setSearch]       = useState('')
  const [working,      setWorking]      = useState<string | null>(null)
  const [rejectingId,  setRejectingId]  = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [menuOpenId,   setMenuOpenId]   = useState<string | null>(null)
  const [showAdd,      setShowAdd]      = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  async function load() {
    setLoading(true)
    setActLoading(true)
    const [u, r, a] = await Promise.all([
      getAdminUsers(),
      getAdminUpgradeRequests(),
      getAdminActivityLog(25),
    ])
    setUsers(u)
    setRequests(r)
    setActivity(a)
    setLoading(false)
    setActLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const openId = searchParams.get('openId')
    if (!openId || users.length === 0) return
    const user = users.find(u => u.id === openId)
    if (user) {
      setSelectedUser(user)
      setSearchParams({}, { replace: true })
    }
  }, [users]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = users.filter(u => {
    if (roleFilter   !== 'All' && u.role   !== roleFilter.toLowerCase())   return false
    if (statusFilter !== 'All' && u.status !== statusFilter.toLowerCase()) return false
    if (search) {
      const q = search.toLowerCase()
      const codeStr = u.user_code != null ? String(u.user_code).padStart(7, '0') : ''
      if (
        !(u.display_name ?? '').toLowerCase().includes(q) &&
        !u.email.toLowerCase().includes(q) &&
        !codeStr.includes(q)
      ) return false
    }
    return true
  })

  const pendingRequests = requests.filter(r => r.status === 'pending')

  async function handleSuspend(u: AdminUser) {
    setWorking(u.id)
    try {
      await suspendUser(u.id)
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: 'suspended' } : x))
      toast.success(`${u.display_name ?? u.email} suspended.`)
    } finally { setWorking(null) }
  }

  async function handleUnsuspend(u: AdminUser) {
    setWorking(u.id)
    try {
      await unsuspendUser(u.id)
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: 'active' } : x))
      toast.success(`${u.display_name ?? u.email} restored.`)
    } finally { setWorking(null) }
  }

  async function handleApproveUpgrade(reqId: string) {
    setWorking(reqId)
    try {
      await approveUpgradeRequest(reqId)
      await load()
      toast.success('Upgrade request approved.')
    } finally { setWorking(null) }
  }

  async function handleRejectUpgrade(reqId: string, reason: string) {
    setWorking(reqId)
    try {
      await rejectUpgradeRequest(reqId, reason)
      setRejectingId(null)
      setRejectReason('')
      await load()
      toast.success('Upgrade request rejected.')
    } finally { setWorking(null) }
  }

  const now          = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const activeCount    = users.filter(u => u.status === 'active').length
  const suspendedCount = users.filter(u => u.status === 'suspended').length
  const buyerCount     = users.filter(u => u.role === 'buyer').length
  const ownerCount     = users.filter(u => u.role === 'owner').length
  const realtorCount   = users.filter(u => u.role === 'realtor').length
  const newThisMonth   = users.filter(u => new Date(u.created_at) >= startOfMonth).length

  const kpis = [
    {
      label: 'Total Users',
      value: users.length,
      sub: `${buyerCount} buyers · ${ownerCount} owners · ${realtorCount} realtors`,
      accent: undefined as string | undefined,
    },
    {
      label: 'Active Accounts',
      value: activeCount,
      sub: suspendedCount > 0 ? `${suspendedCount} suspended` : 'None suspended',
      accent: undefined,
    },
    {
      label: 'Pending Requests',
      value: pendingRequests.length,
      sub: 'awaiting review',
      accent: pendingRequests.length > 0 ? '#d97706' : undefined,
    },
    {
      label: 'New This Month',
      value: newThisMonth,
      sub: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      accent: undefined,
    },
  ]

  return (
    <div className="flex gap-5 items-start">

      {/* ── Left column: KPI cards + main card ───────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-paper border border-line rounded-xl px-4 py-4 animate-pulse space-y-2">
                  <div className="h-2.5 bg-line-soft rounded w-2/3" />
                  <div className="h-7 bg-line-soft rounded w-1/2" />
                  <div className="h-2.5 bg-line-soft rounded w-3/4" />
                </div>
              ))
            : kpis.map(k => (
                <div key={k.label} className="bg-paper border border-line rounded-xl px-4 py-4">
                  <div className="text-[11px] font-bold uppercase tracking-[.07em] text-dim mb-2">{k.label}</div>
                  <div
                    className="text-[28px] font-bold leading-none"
                    style={{ color: k.accent ?? 'var(--ink, #1a1e2e)' }}
                  >
                    {k.value}
                  </div>
                  <div className="text-[11px] text-dim mt-1.5 truncate">{k.sub}</div>
                </div>
              ))
          }
        </div>

      {/* ── Main card ─────────────────────────────────────────────────────── */}
      <div className="bg-paper border border-line rounded-2xl overflow-hidden">

        {/* Toolbar */}
        <div className="px-4 sm:px-5.5 py-4 border-b border-line space-y-3">
          {/* Row 1: heading */}
          <div className="font-sans text-[17px] font-bold text-ink">
            All users
            {!loading && <span className="ml-2 text-[13px] font-normal text-dim">({filtered.length})</span>}
          </div>
          {/* Row 2: search + add user (left) | filter pills (right) */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-white w-55">
                <Search size={13} className="text-dim" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search name or email…"
                  className="text-xs border-0 outline-none bg-transparent text-ink placeholder:text-dim flex-1"
                />
              </div>
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold text-white shrink-0 cursor-pointer border-0"
                style={{ background: TONE }}
              >
                <UserPlus size={13} /> Add User
              </button>
            </div>
            <div className="flex items-center gap-2">
              <FilterPills options={ROLE_PILLS}   value={roleFilter}   onChange={setRoleFilter} />
              <div className="w-px h-4 bg-line-soft shrink-0" />
              <FilterPills options={STATUS_PILLS} value={statusFilter} onChange={setStatusFilter} />
            </div>
          </div>
        </div>

        {/* ── Pending Requests section ──────────────────────────────────── */}
        {!loading && pendingRequests.length > 0 && (
          <div className="border-b border-line">
            <div className="px-5.5 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-[.07em] text-amber-700">
                Pending Requests ({pendingRequests.length})
              </span>
            </div>
            <div className="divide-y divide-line-soft">
              {pendingRequests.map(req => {
                const currentUser  = users.find(u => u.id === req.user_id)
                const currentRole  = currentUser?.role ?? 'buyer'
                const reqColor     = UPGRADE_ROLE_COLOR[req.requested_role] ?? TONE
                const avColor      = roleColor(currentRole)
                const nameOrEmail  = req.user_display_name || req.user_email
                const initial      = nameOrEmail[0].toUpperCase()
                const isRejectOpen = rejectingId === req.id

                return (
                  <div
                    key={req.id}
                    className="px-5.5 py-3 cursor-pointer hover:bg-line-soft/40 transition-colors"
                    onClick={() => currentUser && setSelectedUser(currentUser)}
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-3">
                        <UserAvatar url={currentUser?.avatar_url} initial={initial} bg={avColor} />
                        <div>
                          <div className="text-[13px] font-semibold text-ink leading-tight">{req.user_display_name || '—'}</div>
                          <div className="text-[11px] text-dim flex items-center gap-1"><Mail size={9} />{req.user_email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap" onClick={e => e.stopPropagation()}>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize" style={{ background: `${avColor}14`, color: avColor }}>
                          {currentRole}
                        </span>
                        <span className="text-[10px] text-dim">→</span>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize" style={{ background: `${reqColor}14`, color: reqColor }}>
                          {req.requested_role}
                        </span>
                        <button
                          onClick={() => handleApproveUpgrade(req.id)}
                          disabled={!!working}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white cursor-pointer disabled:opacity-50 border-0"
                          style={{ background: '#1f7a3d' }}
                        >
                          <Check size={11} /> Approve
                        </button>
                        <button
                          onClick={() => { setRejectingId(isRejectOpen ? null : req.id); setRejectReason('') }}
                          disabled={!!working}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-line text-[12px] font-semibold text-ink2 bg-paper cursor-pointer disabled:opacity-50"
                        >
                          <X size={11} /> Reject
                          <ChevronDown size={10} style={{ transform: isRejectOpen ? 'rotate(180deg)' : undefined, transition: 'transform 150ms' }} />
                        </button>
                      </div>
                    </div>
                    {isRejectOpen && (
                      <div className="mt-2.5 flex gap-2 pl-11">
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          placeholder="Reason for rejection…"
                          className="flex-1 px-3 py-2 rounded-lg border border-line bg-white text-[12.5px] text-ink outline-none focus:border-coral"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRejectUpgrade(req.id, rejectReason)}
                          disabled={!rejectReason.trim() || !!working}
                          className="px-4 py-2 rounded-lg text-[12px] font-bold text-white cursor-pointer disabled:opacity-50 border-0"
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
          </div>
        )}

        {/* Desktop table header */}
        <div className="hidden sm:grid grid-cols-[1.6fr_1.8fr_1.2fr_1.1fr_1fr_1fr_40px] px-5.5 py-2.5 border-b border-line bg-nav/5">
          {['Name', 'Email', 'Phone', 'Joined', 'Role', 'Status', ''].map(h => (
            <div key={h} className="text-[11px] font-bold uppercase tracking-[.07em] text-dim">{h}</div>
          ))}
        </div>

        {loading ? (
          <div className="divide-y divide-line-soft">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-5.5 py-4 animate-pulse flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-line-soft shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-line-soft rounded w-1/3" />
                  <div className="h-3 bg-line-soft rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-dim">No users match your filters.</div>
        ) : (
          <div className="divide-y divide-line-soft">
            {filtered.map(u => {
              const st         = STATUS_STYLE[u.status] ?? STATUS_STYLE['active']
              const rc         = roleColor(u.role)
              const initial    = (u.display_name ?? u.email)[0].toUpperCase()
              const hasPending = requests.some(r => r.user_id === u.id && r.status === 'pending')

              return (
                <div key={u.id}>
                  {/* Desktop row */}
                  <div
                    className="hidden sm:grid grid-cols-[1.6fr_1.8fr_1.2fr_1.1fr_1fr_1fr_40px] items-center px-5.5 py-3.5 cursor-pointer hover:bg-line-soft/40 transition-colors"
                    onClick={() => setSelectedUser(u)}
                  >
                    {/* Name + ID */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <UserAvatar url={u.avatar_url} initial={initial} bg={rc} />
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-ink truncate flex items-center gap-1.5">
                          {u.display_name ?? '—'}
                          {hasPending && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Pending upgrade request" />}
                        </div>
                        {u.user_code != null && (
                          <div className="font-mono text-[10.5px] text-dim/60 mt-0.5">
                            #{String(u.user_code).padStart(7, '0')}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Email */}
                    <div className="text-[12px] text-dim truncate min-w-0">
                      {u.email}
                    </div>
                    {/* Phone */}
                    <div className="text-[12px] text-dim">
                      {u.phone ? fmtPhone(u.phone) : <span className="text-dim/50">—</span>}
                    </div>
                    {/* Joined */}
                    <div className="text-[12px] text-ink2">{fmt(u.created_at)}</div>
                    {/* Role */}
                    <div>
                      <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full capitalize" style={{ color: rc, background: `${rc}18` }}>
                        {u.role}
                      </span>
                    </div>
                    {/* Status */}
                    <div>
                      <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full" style={{ color: st.color, background: st.bg }}>
                        {st.label}
                      </span>
                    </div>
                    {/* Actions */}
                    <div className="relative flex justify-center" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === u.id ? null : u.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-line-soft cursor-pointer border-0 bg-transparent"
                      >
                        <MoreHorizontal size={15} className="text-dim" />
                      </button>
                      {menuOpenId === u.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-line rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                            <button
                              onClick={() => { setSelectedUser(u); setMenuOpenId(null) }}
                              className="w-full text-left px-3.5 py-2 text-[12.5px] text-ink hover:bg-line-soft cursor-pointer"
                            >
                              View details
                            </button>
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => { u.status === 'suspended' ? handleUnsuspend(u) : handleSuspend(u); setMenuOpenId(null) }}
                                disabled={working === u.id}
                                className="w-full text-left px-3.5 py-2 text-[12.5px] cursor-pointer disabled:opacity-50 hover:bg-line-soft"
                                style={{ color: u.status === 'suspended' ? '#1f7a3d' : '#dc2626' }}
                              >
                                {u.status === 'suspended' ? 'Restore account' : 'Suspend account'}
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div className="sm:hidden px-4 py-3.5 cursor-pointer" onClick={() => setSelectedUser(u)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar url={u.avatar_url} initial={initial} bg={rc} />
                        <div className="min-w-0">
                          <div className="text-[13.5px] font-semibold text-ink flex items-center gap-1.5">
                            {u.display_name ?? '—'}
                            {hasPending && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                          </div>
                          <div className="text-[11px] text-dim truncate">{u.email}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full" style={{ color: st.color, background: st.bg }}>{st.label}</span>
                        <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full capitalize" style={{ color: rc, background: `${rc}18` }}>{u.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="text-[11px] text-dim">Joined {fmtShort(u.created_at)}</span>
                      {u.user_code != null && (
                        <span className="font-mono text-[10.5px] text-dim/60">· #{String(u.user_code).padStart(7, '0')}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      </div>{/* end left column */}

      {/* ── Activity Sidebar ──────────────────────────────────────────────── */}
      <div className="w-72 shrink-0 hidden xl:block bg-paper border border-line rounded-2xl overflow-hidden sticky top-4">
        <div className="px-4 py-3.5 border-b border-line">
          <div className="font-semibold text-[14px] text-ink">Recent Activity</div>
        </div>
        {actLoading ? (
          <div className="divide-y divide-line-soft">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4 py-3 animate-pulse flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-line-soft shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-line-soft rounded w-3/4" />
                  <div className="h-2.5 bg-line-soft rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activity.filter(e => USER_EVENTS.has(e.event_type)).length === 0 ? (
          <div className="py-8 text-center text-[12px] text-dim">No user activity yet.</div>
        ) : (
          <div className="divide-y divide-line-soft max-h-150 overflow-y-auto">
            {activity.filter(e => USER_EVENTS.has(e.event_type)).map(entry => {
              const meta = EVENT_META[entry.event_type] ?? DEFAULT_META
              const { Icon } = meta
              return (
                <div key={entry.id} className="px-4 py-3 flex gap-2.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${meta.color}18` }}>
                    <Icon size={11} style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-ink leading-snug">{entry.description}</div>
                    <div className="text-[10.5px] text-dim mt-0.5">{fmtRelative(entry.created_at)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Panels ───────────────────────────────────────────────────────── */}
      <AddUserPanel
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={load}
      />
      <UserDetailPanel
        user={selectedUser}
        requests={requests}
        working={working}
        onClose={() => setSelectedUser(null)}
        onSuspend={handleSuspend}
        onUnsuspend={handleUnsuspend}
        onApproveUpgrade={handleApproveUpgrade}
        onRejectUpgrade={handleRejectUpgrade}
      />
    </div>
  )
}
