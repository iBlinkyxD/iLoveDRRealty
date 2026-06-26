import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Check, X, Home, Search, MoreHorizontal, Archive,
  MapPin, Pencil, GitCompare, Eye, Plus, CheckCircle2, XCircle, Star, Clock, Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getAdminListings, approveAdminListing, rejectAdminListing, archiveAdminListing,
  getAdminListingEdits, approveListingEdit, rejectListingEdit,
  getAdminDealRequests, approveDealRequest, rejectDealRequest,
  clearListingDeal, setListingDeal,
  getAdminActivityLog,
} from '../../api/admin'
import type { AdminListing, AdminListingEdit, ActivityEntry, DealRequest } from '../../api/admin'
import { AdminEditListing, AdminSubmitListing } from './SubmitListing'
import { TONE, FilterPills } from './shared'
import { ListingDetailPanel } from '../../components/admin/ListingDetailPanel'
import { ListingEditReviewPage } from '../../components/admin/ListingEditReviewPage'
import { ListingHistoryPanel } from '../../components/admin/ListingHistoryPanel'
import { ConfirmModal } from '../../components/shared/ConfirmModal'

const titleCase = (s: string) =>
  s === s.toUpperCase() ? s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : s

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string; accent: string }> = {
  pending_approval: { color: '#a16207', bg: '#fef9c3', label: 'Pending',  accent: '#f0a800' },
  active:           { color: '#15803d', bg: '#dcfce7', label: 'Active',   accent: '#1f7a3d' },
  rejected:         { color: '#b91c1c', bg: '#fee2e2', label: 'Rejected', accent: '#e10f1f' },
  archived:         { color: '#6b7280', bg: '#f3f4f6', label: 'Archived', accent: '#9ca3af' },
}

function fmtPrice(n: number) {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1_000)}K`
}

function fmtType(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
}

function fmtRelative(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)    return 'just now'
  if (mins < 60)   return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)    return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30)   return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

function StatusChip({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { color: '#6b7280', bg: '#f3f4f6', label: status }
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-bold"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  )
}

function ActionMenu({ onView, onEdit, onHistory, onSetDeal, onArchive }: { onView: () => void; onEdit: () => void; onHistory: () => void; onSetDeal?: () => void; onArchive: () => void }) {
  const { t } = useTranslation('admin')
  const [open, setOpen] = useState(false)
  const [pos, setPos]   = useState({ top: 0, left: 0 })
  const btnRef  = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function toggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      const menuW = 176
      const menuH = 200 // approximate; enough to flip up if near bottom
      const left = Math.max(8, Math.min(r.right - menuW, window.innerWidth - menuW - 8))
      const fitsBelow = r.bottom + 6 + menuH < window.innerHeight
      const top = fitsBelow ? r.bottom + 6 : r.top - menuH - 6
      setPos({ top, left })
    }
    setOpen(v => !v)
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-line-soft cursor-pointer border-0 bg-transparent"
      >
        <MoreHorizontal size={15} className="text-dim" />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="fixed w-44 bg-white border border-line rounded-xl shadow-lg z-50 py-1 overflow-hidden"
          style={{ top: pos.top, left: pos.left }}
        >
          <button
            onClick={() => { onView(); setOpen(false) }}
            className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-[12.5px] text-ink hover:bg-line-soft cursor-pointer"
          >
            <Eye size={12} /> {t('listings_page.action_view')}
          </button>
          <button
            onClick={() => { onEdit(); setOpen(false) }}
            className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-[12.5px] text-ink hover:bg-line-soft cursor-pointer"
          >
            <Pencil size={12} /> {t('listings_page.action_edit')}
          </button>
          <button
            onClick={() => { onHistory(); setOpen(false) }}
            className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-[12.5px] text-ink hover:bg-line-soft cursor-pointer"
          >
            <Clock size={12} /> {t('listings_page.action_history')}
          </button>
          {onSetDeal && (
            <button
              onClick={() => { onSetDeal(); setOpen(false) }}
              className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-[12.5px] text-amber-600 hover:bg-amber-50 cursor-pointer"
            >
              <Sparkles size={12} /> {t('listings_page.action_set_deal')}
            </button>
          )}
          <div className="border-t border-line mx-2" />
          <button
            onClick={() => { onArchive(); setOpen(false) }}
            className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-[12.5px] text-red-500 hover:bg-red-50 cursor-pointer"
          >
            <Archive size={12} /> {t('listings_page.action_archive')}
          </button>
        </div>
      )}
    </>
  )
}

// ── Activity sidebar helpers ────────────────────────────────────────────────

type EventMeta = { Icon: typeof CheckCircle2; color: string }
const EVENT_META: Record<string, EventMeta> = {
  listing_approved: { Icon: CheckCircle2, color: '#16a34a' },
  listing_rejected: { Icon: XCircle,      color: '#dc2626' },
  listing_archived: { Icon: Archive,      color: '#7884a0' },
  edit_approved:    { Icon: CheckCircle2, color: '#16a34a' },
  edit_rejected:    { Icon: XCircle,      color: '#dc2626' },
}
const DEFAULT_META: EventMeta = { Icon: CheckCircle2, color: '#7884a0' }
const LISTING_EVENTS = new Set(['listing_approved', 'listing_rejected', 'listing_archived', 'edit_approved', 'edit_rejected'])

// ── Main component ─────────────────────────────────────────────────────────────

const STATUS_FILTERS = ['All', 'Active', 'Rejected', 'Archived'] as const
const CO_LISTING_FILTERS = ['All', 'Co-Listed', 'No Co-Listing'] as const
const COLS = 'grid-cols-[2fr_0.9fr_1fr_1fr_1.6fr_1fr_40px]'

export function AdminListings() {
  const { t } = useTranslation('admin')
  const [all,          setAll]          = useState<AdminListing[]>([])
  const [edits,        setEdits]        = useState<AdminListingEdit[]>([])
  const [dealRequests, setDealRequests] = useState<DealRequest[]>([])
  const [filter,       setFilter]       = useState<string>('All')
  const [coFilter,     setCoFilter]     = useState<string>('All')
  const [query,        setQuery]        = useState('')
  const [loading,      setLoading]      = useState(true)
  const [working,      setWorking]      = useState(false)
  const [rejectingDealId, setRejectingDealId] = useState<string | null>(null)
  const [dealRejectReason, setDealRejectReason] = useState('')
  const [setDealTarget,    setSetDealTarget]    = useState<AdminListing | null>(null)
  const [setDealValue,     setSetDealValue]     = useState('')
  const [setDealType,      setSetDealType]      = useState<'pct' | 'fixed'>('pct')
  const [selected,           setSelected]           = useState<AdminListing | null>(null)
  const [selectedEdit,       setSelectedEdit]       = useState<AdminListingEdit | null>(null)
  const [historyListing,     setHistoryListing]     = useState<AdminListing | null>(null)
  const [confirmArchive,     setConfirmArchive]     = useState<AdminListing | null>(null)
  const [confirmClearDealId, setConfirmClearDealId] = useState<string | null>(null)
  const [editing,         setEditing]         = useState(false)
  const [showAdd,      setShowAdd]      = useState(false)
  const [activity,     setActivity]     = useState<ActivityEntry[]>([])
  const [actLoading,   setActLoading]   = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  async function load() {
    setLoading(true)
    setActLoading(true)
    const [data, editData, dealData, act] = await Promise.all([
      getAdminListings(),
      getAdminListingEdits(),
      getAdminDealRequests('pending'),
      getAdminActivityLog(25),
    ])
    setAll(data)
    setEdits(editData)
    setDealRequests(dealData)
    setActivity(act)
    setLoading(false)
    setActLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const openId = searchParams.get('openId')
    if (!openId || all.length === 0) return
    const listing = all.find(l => l.id === openId)
    if (listing) {
      setSelected(listing)
      setSearchParams({}, { replace: true })
    }
  }, [all]) // eslint-disable-line react-hooks/exhaustive-deps

  const pending  = all.filter(l => l.status === 'pending_approval')
  const nonPending = all.filter(l => l.status !== 'pending_approval')

  const afterFilter = filter === 'All' ? nonPending : nonPending.filter(l => {
    if (filter === 'Active')   return l.status === 'active'
    if (filter === 'Rejected') return l.status === 'rejected'
    if (filter === 'Archived') return l.status === 'archived'
    return true
  })

  const afterCoFilter = coFilter === 'All' ? afterFilter : afterFilter.filter(l =>
    coFilter === 'Co-Listed' ? l.co_listing_enabled : !l.co_listing_enabled
  )

  const visible = query.trim()
    ? afterCoFilter.filter(l =>
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.location.toLowerCase().includes(query.toLowerCase())
      )
    : afterCoFilter

  const counts = {
    total:    all.length,
    pending:  pending.length,
    active:   all.filter(l => l.status === 'active').length,
    rejected: all.filter(l => l.status === 'rejected').length,
    archived: all.filter(l => l.status === 'archived').length,
    edits:    edits.length,
  }

  async function handleApprove(id: string) {
    setWorking(true)
    await approveAdminListing(id)
    setSelected(null)
    await load()
    setWorking(false)
    toast.success('Listing approved.')
  }

  async function handleReject(id: string, reason: string) {
    setWorking(true)
    await rejectAdminListing(id, reason)
    setSelected(null)
    await load()
    setWorking(false)
    toast.success('Listing rejected.')
  }

  async function handleApproveEdit(id: string) {
    setWorking(true)
    await approveListingEdit(id)
    setSelectedEdit(null)
    await load()
    setWorking(false)
    toast.success('Edit approved — listing updated.')
  }

  async function handleRejectEdit(id: string, reason: string) {
    setWorking(true)
    await rejectListingEdit(id, reason)
    setSelectedEdit(null)
    await load()
    setWorking(false)
    toast.success('Edit rejected.')
  }

  async function handleArchive(id: string) {
    setWorking(true)
    await archiveAdminListing(id)
    setSelected(null)
    await load()
    setWorking(false)
    toast.success('Listing archived.')
  }

  async function handleApproveDeal(id: string) {
    setWorking(true)
    try {
      await approveDealRequest(id)
      await load()
      toast.success('Deal of the Week set!')
    } finally { setWorking(false) }
  }

  async function handleRejectDeal(id: string, reason: string) {
    setWorking(true)
    try {
      await rejectDealRequest(id, reason)
      setRejectingDealId(null)
      setDealRejectReason('')
      await load()
      toast.success('Deal request rejected.')
    } finally { setWorking(false) }
  }

  async function handleSetDeal() {
    if (!setDealTarget) return
    setWorking(true)
    try {
      const val = setDealValue.trim() ? parseFloat(setDealValue) : null
      await setListingDeal(setDealTarget.id, val, setDealType)
      setSetDealTarget(null)
      setSetDealValue('')
      setSetDealType('pct')
      await load()
      toast.success('Deal of the Week set!')
    } finally { setWorking(false) }
  }

  async function handleClearDeal(id: string) {
    setWorking(true)
    try {
      await clearListingDeal(id)
      await load()
      toast.success('Deal cleared.')
    } finally { setWorking(false) }
  }

  const kpis = [
    {
      label: t('listings_page.kpi_total'),
      value: counts.total,
      sub: t('listings_page.kpi_total_sub', { active: counts.active, archived: counts.archived }),
      accent: undefined as string | undefined,
    },
    {
      label: t('listings_page.kpi_active'),
      value: counts.active,
      sub: t('listings_page.kpi_active_sub'),
      accent: undefined,
    },
    {
      label: t('listings_page.kpi_pending'),
      value: counts.pending,
      sub: t('listings_page.kpi_pending_sub'),
      accent: counts.pending > 0 ? '#d97706' : undefined,
    },
    {
      label: t('listings_page.kpi_edits'),
      value: counts.edits,
      sub: t('listings_page.kpi_edits_sub'),
      accent: counts.edits > 0 ? '#7c3aed' : undefined,
    },
  ]

  if (showAdd) {
    return (
      <AdminSubmitListing
        go={() => { setShowAdd(false); load() }}
        tone="#0d9488"
      />
    )
  }

  if (editing && selected) {
    return (
      <AdminEditListing
        listing={selected}
        onBack={() => setEditing(false)}
        onSaved={(updated: AdminListing) => {
          const merged = { ...selected, ...updated }
          setAll(prev => prev.map(l => l.id === merged.id ? merged : l))
          setSelected(merged)
          setEditing(false)
        }}
      />
    )
  }

  return (
    <div className="flex gap-5 items-start">

      {/* ── Left column ───────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-paper border border-line rounded-xl px-4 py-4 animate-pulse space-y-2 min-w-0 overflow-hidden">
                  <div className="h-2.5 bg-line-soft rounded w-2/3" />
                  <div className="h-7 bg-line-soft rounded w-1/2" />
                  <div className="h-2.5 bg-line-soft rounded w-3/4" />
                </div>
              ))
            : kpis.map(k => (
                <div key={k.label} className="bg-paper border border-line rounded-xl px-4 py-4 min-w-0 overflow-hidden">
                  <div className="text-[11px] font-bold uppercase tracking-[.07em] text-dim mb-2 truncate">{k.label}</div>
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

        {/* ── Main card ─────────────────────────────────────────────────── */}
        <div className="bg-paper border border-line rounded-2xl overflow-hidden">

          {/* Toolbar */}
          <div className="px-4 sm:px-5.5 py-4 border-b border-line space-y-3">
            <div className="font-sans text-[17px] font-bold text-ink">
              {t('listings_page.title')}
              {!loading && <span className="ml-2 text-[13px] font-normal text-dim">({visible.length})</span>}
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-white flex-1 sm:w-55">
                  <Search size={13} className="text-dim" />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={t('listings_page.search_ph')}
                    className="text-xs border-0 outline-none bg-transparent text-ink placeholder:text-dim flex-1"
                  />
                </div>
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold text-white shrink-0 cursor-pointer border-0"
                  style={{ background: TONE }}
                >
                  <Plus size={13} /> {t('listings_page.add_listing')}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <FilterPills options={[...STATUS_FILTERS]} value={filter} onChange={setFilter} />
                <div className="w-px h-4 bg-line shrink-0" />
                <FilterPills options={[...CO_LISTING_FILTERS]} value={coFilter} onChange={setCoFilter} />
              </div>
            </div>
          </div>

          {/* ── Pending Approval section ─────────────────────────────── */}
          {!loading && pending.length > 0 && (
            <div className="border-b border-line">
              <div className="px-4 sm:px-5.5 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-[.07em] text-amber-700">
                  {t('listings_page.pending_approval_banner', { count: pending.length })}
                </span>
              </div>
              <div className="divide-y divide-line-soft">
                {pending.map(l => (
                  <div key={l.id} className="px-4 sm:px-5.5 py-3 flex items-center gap-3 hover:bg-amber-50/70 transition-colors cursor-pointer" onClick={() => setSelected(l)}>
                    {l.images?.[0] ? (
                      <img src={l.images[0]} alt="" className="w-10 h-10 sm:w-14 sm:h-9 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 sm:w-14 sm:h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${TONE}18` }}>
                        <Home size={14} style={{ color: TONE }} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-ink truncate">{titleCase(l.title)}</div>
                      <div className="text-[11px] text-dim flex items-center gap-1 truncate"><MapPin size={9} />{l.location}</div>
                    </div>
                    <div className="text-[12px] text-dim shrink-0 hidden sm:block">
                      {l.submitted_by_name ?? '—'} · {fmtRelative(l.updated_at)}
                    </div>
                    {/* Desktop: text buttons */}
                    <div className="hidden sm:flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleApprove(l.id)} disabled={working} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white cursor-pointer disabled:opacity-50 border-0" style={{ background: '#1f7a3d' }}>
                        <Check size={11} /> Approve
                      </button>
                      <button onClick={() => setSelected(l)} disabled={working} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-line text-[12px] font-semibold text-ink bg-paper cursor-pointer disabled:opacity-50">
                        <X size={11} /> Reject
                      </button>
                    </div>
                    {/* Mobile: icon-only buttons */}
                    <div className="sm:hidden flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleApprove(l.id)} disabled={working} className="w-8 h-8 rounded-full flex items-center justify-center border-0 cursor-pointer disabled:opacity-50 shrink-0" style={{ background: '#1f7a3d' }}>
                        <Check size={14} color="white" />
                      </button>
                      <button onClick={() => setSelected(l)} disabled={working} className="w-8 h-8 rounded-full flex items-center justify-center border border-line bg-paper cursor-pointer disabled:opacity-50 shrink-0">
                        <X size={14} className="text-ink" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Pending Edits section ────────────────────────────────── */}
          {!loading && edits.length > 0 && (
            <div className="border-b border-line">
              <div className="px-4 sm:px-5.5 py-2.5 bg-violet-50 border-b border-violet-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-[.07em] text-violet-700">
                  {t('listings_page.pending_edits_banner', { count: edits.length })}
                </span>
              </div>
              <div className="divide-y divide-line-soft">
                {edits.map(edit => (
                  <div key={edit.id} className="px-4 sm:px-5.5 py-3 flex items-center gap-3 hover:bg-violet-50/70 transition-colors cursor-pointer" onClick={() => setSelectedEdit(edit)}>
                    {edit.listing_thumbnail ? (
                      <img src={edit.listing_thumbnail} alt="" className="w-10 h-10 sm:w-14 sm:h-9 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 sm:w-14 sm:h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#7c3aed18' }}>
                        <GitCompare size={14} style={{ color: '#7c3aed' }} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-ink truncate">{titleCase(edit.listing_title)}</div>
                      <div className="text-[11px] text-dim flex items-center gap-1 truncate"><MapPin size={9} />{edit.listing_location}</div>
                    </div>
                    <div className="text-[12px] text-dim shrink-0 hidden sm:block">
                      {edit.submitted_by_name ?? '—'} · {fmtRelative(edit.submitted_at)}
                    </div>
                    {/* Desktop: text buttons */}
                    <div className="hidden sm:flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleApproveEdit(edit.id)} disabled={working} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white cursor-pointer disabled:opacity-50 border-0" style={{ background: '#1f7a3d' }}>
                        <Check size={11} /> Approve
                      </button>
                      <button onClick={() => setSelectedEdit(edit)} disabled={working} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-line text-[12px] font-semibold text-ink bg-paper cursor-pointer disabled:opacity-50">
                        <GitCompare size={11} /> Review
                      </button>
                    </div>
                    {/* Mobile: icon-only buttons */}
                    <div className="sm:hidden flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleApproveEdit(edit.id)} disabled={working} className="w-8 h-8 rounded-full flex items-center justify-center border-0 cursor-pointer disabled:opacity-50 shrink-0" style={{ background: '#1f7a3d' }}>
                        <Check size={14} color="white" />
                      </button>
                      <button onClick={() => setSelectedEdit(edit)} disabled={working} className="w-8 h-8 rounded-full flex items-center justify-center border border-violet-200 bg-violet-50 cursor-pointer disabled:opacity-50 shrink-0">
                        <GitCompare size={13} color="#7c3aed" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Active Deals section ─────────────────────────────────── */}
          {!loading && all.some(l => l.is_deal) && (
            <div className="border-b border-line">
              <div className="px-4 sm:px-5.5 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                <Star size={11} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                <span className="text-[11px] font-bold uppercase tracking-[.07em] text-amber-700">
                  {t('listings_page.active_deals_banner', { count: all.filter(l => l.is_deal).length })}
                </span>
              </div>

              <div className="divide-y divide-line-soft">
                {all.filter(l => l.is_deal).map(l => (
                  <div key={l.id} className="px-4 sm:px-5.5 py-3 flex items-center gap-3 hover:bg-amber-50/50 transition-colors cursor-pointer" onClick={() => setSelected(l)}>
                    {l.images?.[0] ? (
                      <img src={l.images[0]} alt="" className="w-10 h-10 sm:w-14 sm:h-9 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 sm:w-14 sm:h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#f0a80018' }}>
                        <Star size={14} style={{ color: '#f0a800' }} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-ink truncate">{titleCase(l.title)}</div>
                      <div className="text-[11px] text-dim flex items-center gap-1 truncate">
                        <MapPin size={9} />{l.location}
                        {l.deal_discount_value && (
                          <span className="ml-1 font-semibold" style={{ color: '#c07800' }}>
                            · {l.deal_discount_type === 'fixed' ? `−$${Number(l.deal_discount_value).toLocaleString()} off` : `−${l.deal_discount_value}% off`}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Desktop: text button */}
                    <button onClick={e => { e.stopPropagation(); setConfirmClearDealId(l.id) }} disabled={working} className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg border border-line text-[12px] font-semibold text-red-500 bg-paper hover:bg-red-50 cursor-pointer disabled:opacity-50 shrink-0">
                      <X size={11} /> Clear Deal
                    </button>
                    {/* Mobile: icon button */}
                    <button onClick={e => { e.stopPropagation(); setConfirmClearDealId(l.id) }} disabled={working} className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center border border-red-200 bg-red-50 cursor-pointer disabled:opacity-50 shrink-0">
                      <X size={14} color="#ef4444" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Deal Requests section ────────────────────────────────── */}
          {!loading && dealRequests.length > 0 && (
            <div className="border-b border-line">
              <div className="px-4 sm:px-5.5 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                <Star size={11} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                <span className="text-[11px] font-bold uppercase tracking-[.07em] text-amber-700">
                  {t('listings_page.deal_requests_banner', { count: dealRequests.length })}
                </span>
              </div>
              <div className="divide-y divide-line-soft">
                {dealRequests.map(req => {
                  const isRejectOpen = rejectingDealId === req.id
                  return (
                    <div key={req.id} className="px-4 sm:px-5.5 py-3 hover:bg-amber-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {req.listing_thumbnail ? (
                          <img src={req.listing_thumbnail} alt="" className="w-10 h-10 sm:w-14 sm:h-9 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 sm:w-14 sm:h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#f0a80018' }}>
                            <Star size={14} style={{ color: '#f0a800' }} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-ink truncate">{titleCase(req.listing_title)}</div>
                          <div className="text-[11px] text-dim flex items-center gap-1 truncate">
                            <MapPin size={9} />{req.listing_location}
                            <span className="mx-1">·</span>
                            <span className="font-semibold" style={{ color: '#c07800' }}>
                              {req.discount_type === 'fixed'
                                ? `−$${Number(req.discount_value).toLocaleString()} off`
                                : `−${req.discount_value}% off`}
                            </span>
                          </div>
                        </div>
                        <div className="text-[11px] text-dim shrink-0 hidden sm:block">
                          {req.requested_by_name ?? req.requested_by_email} · {fmtRelative(req.created_at)}
                        </div>
                        {/* Desktop: text buttons */}
                        <div className="hidden sm:flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleApproveDeal(req.id)} disabled={working} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white cursor-pointer disabled:opacity-50 border-0" style={{ background: '#f0a800' }}>
                            <Check size={11} /> Approve
                          </button>
                          <button onClick={() => { setRejectingDealId(isRejectOpen ? null : req.id); setDealRejectReason('') }} disabled={working} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-line text-[12px] font-semibold text-ink bg-paper cursor-pointer disabled:opacity-50">
                            <X size={11} /> Reject
                          </button>
                        </div>
                        {/* Mobile: icon buttons */}
                        <div className="sm:hidden flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleApproveDeal(req.id)} disabled={working} className="w-8 h-8 rounded-full flex items-center justify-center border-0 cursor-pointer disabled:opacity-50 shrink-0" style={{ background: '#f0a800' }}>
                            <Check size={14} color="white" />
                          </button>
                          <button onClick={() => { setRejectingDealId(isRejectOpen ? null : req.id); setDealRejectReason('') }} disabled={working} className="w-8 h-8 rounded-full flex items-center justify-center border border-line bg-paper cursor-pointer disabled:opacity-50 shrink-0">
                            <X size={14} className="text-ink" />
                          </button>
                        </div>
                      </div>
                      {isRejectOpen && (
                        <div className="mt-2.5 flex gap-2">
                          <input type="text" value={dealRejectReason} onChange={e => setDealRejectReason(e.target.value)} placeholder="Reason for rejection…" className="flex-1 px-3 py-2 rounded-lg border border-line bg-white text-[12.5px] text-ink outline-none focus:border-amber-400" autoFocus />
                          <button onClick={() => handleRejectDeal(req.id, dealRejectReason)} disabled={!dealRejectReason.trim() || working} className="px-4 py-2 rounded-lg text-[12px] font-bold text-white cursor-pointer disabled:opacity-50 border-0" style={{ background: '#e10f1f' }}>
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
          <div className={`hidden sm:grid ${COLS} px-5.5 py-2.5 border-b border-line bg-nav/5`}>
            {[t('listings_page.header_property'), t('listings_page.header_type'), t('listings_page.header_price'), t('listings_page.header_status'), t('listings_page.header_submitted_by'), t('listings_page.header_updated'), ''].map((h, i) => (
              <div key={i} className="text-[11px] font-bold uppercase tracking-[.07em] text-dim">{h}</div>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div className="divide-y divide-line-soft">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-5.5 py-4 animate-pulse flex items-center gap-3">
                  <div className="w-14 h-9 rounded-lg bg-line-soft shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-line-soft rounded w-1/3" />
                    <div className="h-3 bg-line-soft rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="py-12 text-center text-sm text-dim">
              {query.trim() ? t('listings_page.no_results', { query }) : t('listings_page.no_listings')}
            </div>
          ) : (
            <div className="divide-y divide-line-soft">
              {visible.map(l => (
                <div key={l.id}>
                  {/* Desktop row */}
                  <div
                    className={`hidden sm:grid ${COLS} items-center px-5.5 py-3.5 cursor-pointer hover:bg-line-soft/40 transition-colors`}
                    onClick={() => setSelected(l)}
                  >
                    {/* Property */}
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      {l.images?.[0] ? (
                        <img src={l.images[0]} alt={l.title} className="w-14 h-9 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-14 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${TONE}18` }}>
                          <Home size={16} style={{ color: TONE }} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="text-[13px] font-semibold text-ink truncate">{titleCase(l.title)}</div>
                          {l.co_listing_enabled && (
                            <span className="shrink-0 px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wide" style={{ background: '#ccfbf1', color: '#0f766e' }}>CO-LIST</span>
                          )}
                        </div>
                        <div className="text-[11px] text-dim flex items-center gap-1 truncate"><MapPin size={9} />{l.location}</div>
                      </div>
                    </div>
                    {/* Type */}
                    <div className="text-[12px] text-ink2">{fmtType(l.type)}</div>
                    {/* Price */}
                    <div className="text-[13px] font-semibold text-ink">{fmtPrice(l.price)}</div>
                    {/* Status */}
                    <div><StatusChip status={l.status} /></div>
                    {/* Submitted by */}
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-ink truncate">{l.submitted_by_name ?? '—'}</div>
                      <div className="text-[11px] text-dim truncate">{l.submitted_by_email ?? ''}</div>
                    </div>
                    {/* Updated */}
                    <div className="text-[12px] text-ink2">{fmtRelative(l.updated_at)}</div>
                    {/* Actions */}
                    <div onClick={e => e.stopPropagation()}>
                      <ActionMenu
                        onView={() => setSelected(l)}
                        onEdit={() => { setSelected(l); setEditing(true) }}
                        onHistory={() => setHistoryListing(l)}
                        onSetDeal={l.status === 'active' && !l.is_deal ? () => { setSetDealTarget(l); setSetDealValue(''); setSetDealType('pct') } : undefined}
                        onArchive={() => setConfirmArchive(l)}
                      />
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div
                    className="sm:hidden px-4 py-3.5 cursor-pointer"
                    onClick={() => setSelected(l)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {l.images?.[0] ? (
                          <img src={l.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${TONE}18` }}>
                            <Home size={14} style={{ color: TONE }} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-[13.5px] font-semibold text-ink truncate">{titleCase(l.title)}</div>
                          <div className="text-[11px] text-dim truncate flex items-center gap-1"><MapPin size={9} />{l.location}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <StatusChip status={l.status} />
                        <div className="text-[11px] text-dim">{fmtPrice(l.price)}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-dim mt-2">{fmtType(l.type)} · Updated {fmtRelative(l.updated_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>{/* end left column */}

      {/* ── Activity Sidebar ─────────────────────────────────────────────── */}
      <div className="w-72 shrink-0 hidden xl:block bg-paper border border-line rounded-2xl overflow-hidden sticky top-4">
        <div className="px-4 py-3.5 border-b border-line">
          <div className="font-semibold text-[14px] text-ink">{t('listings_page.recent_activity')}</div>
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
        ) : activity.filter(e => LISTING_EVENTS.has(e.event_type)).length === 0 ? (
          <div className="py-8 text-center text-[12px] text-dim">{t('listings_page.no_activity')}</div>
        ) : (
          <div className="divide-y divide-line-soft max-h-150 overflow-y-auto">
            {activity.filter(e => LISTING_EVENTS.has(e.event_type)).map(entry => {
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

      {/* Detail slide-over */}
      {selected && (
        <ListingDetailPanel
          listing={selected}
          onClose={() => setSelected(null)}
          onEdit={() => setEditing(true)}
          onApprove={() => handleApprove(selected.id)}
          onReject={(reason) => handleReject(selected.id, reason)}
          onArchive={() => setConfirmArchive(selected)}
          onSetDeal={selected.status === 'active' && !selected.is_deal
            ? async (value, type) => {
                await setListingDeal(selected.id, value, type)
                await load()
                toast.success('Deal of the Week set!')
              }
            : undefined}
          onClearDeal={selected.is_deal ? () => setConfirmClearDealId(selected.id) : undefined}
          working={working}
        />
      )}

      {/* History slide-over */}
      {historyListing && (
        <ListingHistoryPanel
          listingId={historyListing.id}
          listingTitle={historyListing.title}
          onClose={() => setHistoryListing(null)}
        />
      )}

      {/* Edit review — full screen */}
      {selectedEdit && (
        <ListingEditReviewPage
          edit={selectedEdit}
          working={working}
          onApprove={() => handleApproveEdit(selectedEdit.id)}
          onReject={(reason) => handleRejectEdit(selectedEdit.id, reason)}
          onClose={() => setSelectedEdit(null)}
        />
      )}

      {/* Archive confirmation */}
      {confirmArchive && (
        <ConfirmModal
          title={t('listings_page.confirm_archive_title')}
          description={`"${titleCase(confirmArchive.title)}" will be removed from the site and marked as archived. This can be reversed by contacting a developer.`}
          confirmLabel={t('listings_page.confirm_archive_btn')}
          variant="danger"
          loading={working}
          onConfirm={async () => {
            await handleArchive(confirmArchive.id)
            setConfirmArchive(null)
          }}
          onCancel={() => setConfirmArchive(null)}
        />
      )}

      {/* Clear Deal confirmation */}
      {confirmClearDealId && (
        <ConfirmModal
          title={t('listings_page.confirm_clear_deal_title')}
          description={t('listings_page.confirm_clear_deal_desc')}
          confirmLabel={t('listings_page.confirm_clear_deal_btn')}
          variant="warning"
          loading={working}
          onConfirm={async () => {
            await handleClearDeal(confirmClearDealId)
            setConfirmClearDealId(null)
          }}
          onCancel={() => setConfirmClearDealId(null)}
        />
      )}

      {/* Set as Deal modal */}
      {setDealTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,16,46,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} style={{ color: '#f59e0b' }} />
              <div className="font-bold text-[15px] text-ink">Set as Deal of the Week</div>
            </div>
            <div className="text-[12.5px] text-dim mb-4 truncate">{titleCase(setDealTarget.title)}</div>

            <div className="space-y-3">
              <div>
                <div className="text-[11.5px] font-semibold text-dim uppercase tracking-[.06em] mb-1.5">Discount type</div>
                <div className="flex rounded-lg border border-line overflow-hidden text-[12px] font-semibold">
                  {(['pct', 'fixed'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSetDealType(t)}
                      className="flex-1 py-2 cursor-pointer transition-colors"
                      style={{ background: setDealType === t ? '#f59e0b' : 'white', color: setDealType === t ? 'white' : '#6b7280' }}
                    >
                      {t === 'pct' ? 'Percentage (%)' : 'Fixed ($)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11.5px] font-semibold text-dim uppercase tracking-[.06em] mb-1.5">
                  Discount value <span className="normal-case font-normal">(optional)</span>
                </div>
                <div className="flex items-center border border-line rounded-lg overflow-hidden">
                  <span className="px-3 text-[13px] text-dim bg-line-soft border-r border-line py-2">
                    {setDealType === 'pct' ? '%' : '$'}
                  </span>
                  <input
                    type="text"
                    inputMode={setDealType === 'pct' ? 'decimal' : 'numeric'}
                    value={setDealType === 'fixed' && setDealValue
                      ? Number(setDealValue.replace(/,/g, '')).toLocaleString('en-US')
                      : setDealValue}
                    onChange={e => {
                      const raw = setDealType === 'fixed'
                        ? e.target.value.replace(/[^0-9]/g, '')
                        : e.target.value.replace(/[^0-9.]/g, '')
                      setSetDealValue(raw)
                    }}
                    placeholder="Leave blank for no discount"
                    className="flex-1 px-3 py-2 text-[13px] text-ink outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={handleSetDeal}
                disabled={working}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white cursor-pointer disabled:opacity-50 border-0"
                style={{ background: '#f59e0b' }}
              >
                <Star size={13} className="inline mr-1.5" fill="white" />
                Set as Deal
              </button>
              <button
                onClick={() => setSetDealTarget(null)}
                disabled={working}
                className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-ink border border-line bg-paper cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
