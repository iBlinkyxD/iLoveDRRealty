import { useState } from 'react'
import DOMPurify from 'dompurify'
import {
  Check, X, ArrowLeft, Home, MapPin, Tag, Link2, Calendar,
  CircleDollarSign, ArrowLeftRight, BedDouble, Bath, Ruler, Maximize2,
  TrendingUp, Wallet, CheckCircle2, Video, Box, Building2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { AdminListingEdit } from '../../api/admin'
import { TONE } from '../../pages/admin/shared'

const AMBER = '#d97706'

function fmtType(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
}

function safeUrl(u: string): string | null {
  try {
    const p = new URL(u)
    return p.protocol === 'https:' || p.protocol === 'http:' ? p.href : null
  } catch { return null }
}

function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    let vid: string | null = null
    if (u.hostname === 'youtu.be') {
      vid = u.pathname.slice(1).split('/')[0]
    } else if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') {
      if (u.pathname === '/watch') vid = u.searchParams.get('v')
      else if (u.pathname.startsWith('/embed/')) vid = u.pathname.slice(7).split('/')[0]
      else if (u.pathname.startsWith('/shorts/')) vid = u.pathname.slice(8).split('/')[0]
    }
    return vid ? `https://www.youtube.com/embed/${vid}` : null
  } catch { return null }
}

const DEPOSIT_LABELS: Record<string, string> = {
  first:      "First month's rent",
  last:       "Last month's rent",
  first_last: "First + Last month's rent",
  none:       'No deposit required',
}

const ARRAY_FIELDS = new Set(['features', 'images', 'tags', 'video_links', 'included_utilities'])

function getChangedKeys(
  current: Record<string, unknown>,
  proposed: Record<string, unknown>,
): Set<string> {
  const all = new Set([...Object.keys(current), ...Object.keys(proposed)])
  const out = new Set<string>()
  for (const k of all) {
    const a = current[k], b = proposed[k]
    if (ARRAY_FIELDS.has(k)) {
      if (JSON.stringify(a ?? []) !== JSON.stringify(b ?? [])) out.add(k)
    } else {
      if (String(a ?? '') !== String(b ?? '')) out.add(k)
    }
  }
  return out
}

// ── Snapshot column ──────────────────────────────────────────────────────────

interface ColProps {
  data: Record<string, unknown>
  changedKeys: Set<string>
  isProposed: boolean
}

function SnapshotColumn({ data, changedKeys, isProposed }: ColProps) {
  const str  = (key: string) => data[key] as string | null | undefined
  const num  = (key: string) => data[key] as number | null | undefined
  const bool = (key: string) => Boolean(data[key])
  const arr  = <T = string>(key: string): T[] => (data[key] as T[] | null | undefined) ?? []
  const ch   = (key: string) => isProposed && changedKeys.has(key)
  const accent = TONE

  const transaction = str('transaction') ?? ''
  const isRent = transaction === 'rent'

  // Icon grid fields
  type PF = { Icon: LucideIcon; label: string; value: string | number; key: string }
  const propFields: PF[] = ([
    { Icon: CircleDollarSign, label: 'Price',              key: 'price',           value: num('price') != null ? `$${Number(num('price')).toLocaleString('en-US')}` : null },
    { Icon: Home,             label: 'Property Type',      key: 'type',            value: str('type') ? fmtType(str('type')!) : null },
    { Icon: ArrowLeftRight,   label: 'Transaction',        key: 'transaction',     value: str('transaction') ? fmtType(str('transaction')!) : null },
    { Icon: Calendar,         label: 'Year Built',         key: 'year_built',      value: num('year_built') },
    { Icon: BedDouble,        label: 'Bedrooms',           key: 'bedrooms',        value: num('bedrooms') },
    { Icon: Bath,             label: 'Bathrooms',          key: 'bathrooms',       value: num('bathrooms') },
    { Icon: Ruler,            label: 'Living Area (ft²)',  key: 'area_sqft',       value: num('area_sqft') != null ? Number(num('area_sqft')).toLocaleString('en-US') : null },
    { Icon: Maximize2,        label: 'Lot Size (ft²)',     key: 'lot_size_sqft',   value: num('lot_size_sqft') != null ? Number(num('lot_size_sqft')).toLocaleString('en-US') : null },
    { Icon: TrendingUp,       label: 'Est. ROI (%)',       key: 'roi',             value: num('roi') },
    { Icon: Wallet,           label: 'HOA Fee ($/mo)',     key: 'hoa_fee',         value: num('hoa_fee') != null ? `$${Number(num('hoa_fee')).toLocaleString('en-US')}` : null },
    { Icon: Building2,        label: 'Assoc. Fee ($/mo)', key: 'association_fee', value: num('association_fee') != null ? `$${Number(num('association_fee')).toLocaleString('en-US')}` : null },
  ] as (PF & { value: string | number | null | undefined })[]).filter(
    f => f.value != null && f.value !== ''
  ) as PF[]

  const propRows: PF[][] = []
  for (let i = 0; i < propFields.length; i += 3) propRows.push(propFields.slice(i, i + 3))

  const boolBadges = [
    { label: 'Seller Financing',    key: 'seller_financing', on: bool('seller_financing') },
    { label: 'HOA Community',       key: 'hoa',              on: bool('hoa')              },
    { label: 'CONFOTUR Tax Exempt', key: 'tax_exempt',       on: bool('tax_exempt')       },
    { label: 'Gated Community',     key: 'gated_community',  on: bool('gated_community')  },
  ].filter(b => b.on)

  const features        = arr<string>('features')
  const tags            = arr<string>('tags').length ? arr<string>('tags') : str('tag') ? [str('tag')!] : []
  const includedUtils   = arr<string>('included_utilities')
  const videoLinks      = arr<string>('video_links')
  const depositPolicy   = str('deposit_policy')
  const tourUrl         = str('tour_3d_url')
  const utilities       = str('utilities')
  const mapsUrl         = str('maps_url')
  const description     = str('description')
  const constructionSt  = str('construction_status')
  const images          = arr<string>('images')

  return (
    <div className="flex flex-col">

      {/* Image strip */}
      {images.length > 0 ? (
        <div className={`flex gap-2 p-3 overflow-x-auto shrink-0 border-b ${ch('images') ? 'bg-amber-50 border-amber-300' : 'bg-line/20 border-line'}`}>
          {images.map((url, i) => (
            <img key={i} src={url} alt="" className={`h-28 w-44 object-cover rounded-lg shrink-0 ${ch('images') ? 'ring-2 ring-amber-400' : ''}`} />
          ))}
        </div>
      ) : (
        <div className={`flex items-center justify-center h-16 shrink-0 border-b ${ch('images') ? 'bg-amber-50 border-amber-300' : 'bg-line/20 border-line'}`}>
          <Home size={24} className="text-dim opacity-25" />
        </div>
      )}

      {/* Sections */}
      <div className="px-5 py-5 space-y-6">

        {/* Property Information */}
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-widest mb-4 text-dim">
            Property Information
          </div>
          <div className="divide-y divide-line-soft">
            {propRows.map((row, ri) => (
              <div key={ri} className="grid grid-cols-3 py-3.5 gap-2">
                {row.map(({ Icon, label, value, key: fk }) => (
                  <div key={label} className="flex items-start gap-2 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      <Icon size={14} style={{ color: ch(fk) ? AMBER : accent }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10.5px] text-dim leading-tight truncate">{label}</div>
                      <div className="text-[13.5px] font-bold mt-0.5 truncate" style={{ color: ch(fk) ? AMBER : undefined }}>
                        {ch(fk) ? String(value) : <span className="text-ink">{String(value)}</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => <div key={i} />)}
              </div>
            ))}

            {constructionSt && (
              <div className="py-3.5 flex items-center gap-2">
                <CheckCircle2 size={14} style={{ color: ch('construction_status') ? AMBER : accent }} />
                <div>
                  <div className="text-[10.5px] text-dim">Construction</div>
                  <div className="text-[13.5px] font-bold capitalize" style={{ color: ch('construction_status') ? AMBER : undefined }}>
                    {ch('construction_status')
                      ? constructionSt.replace(/_/g, ' ')
                      : <span className="text-ink">{constructionSt.replace(/_/g, ' ')}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bool badges */}
        {boolBadges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {boolBadges.map(b => (
              <span
                key={b.label}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                style={ch(b.key)
                  ? { background: '#fffbeb', color: '#92400e', borderColor: '#fcd34d' }
                  : { background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-widest mb-3" style={{ color: ch('features') ? AMBER : undefined }}>
              {ch('features') ? 'Features' : <span className="text-dim">Features</span>}
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {features.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 size={14} style={{ color: ch('features') ? AMBER : accent }} className="shrink-0" />
                  <span className="text-[13px]" style={{ color: ch('features') ? AMBER : undefined }}>
                    {ch('features') ? f : <span className="text-ink">{f}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-widest mb-3"
              style={{ color: (ch('tags') || ch('tag')) ? AMBER : undefined }}>
              {(ch('tags') || ch('tag')) ? 'Tags' : <span className="text-dim">Tags</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(t => (
                <span key={t}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border"
                  style={(ch('tags') || ch('tag'))
                    ? { background: '#fffbeb', borderColor: '#fcd34d', color: '#92400e' }
                    : { background: 'white', borderColor: 'var(--color-line)', color: 'var(--color-ink)' }}>
                  <Tag size={11} style={{ color: (ch('tags') || ch('tag')) ? AMBER : undefined }} className={!(ch('tags') || ch('tag')) ? 'text-dim' : ''} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* What is Included */}
        {isRent && includedUtils.length > 0 && (
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-widest mb-3"
              style={{ color: ch('included_utilities') ? AMBER : undefined }}>
              {ch('included_utilities') ? 'What is Included' : <span className="text-dim">What is Included</span>}
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {includedUtils.map(u => (
                <div key={u} className="flex items-center gap-2">
                  <CheckCircle2 size={14} style={{ color: ch('included_utilities') ? AMBER : accent }} className="shrink-0" />
                  <span className="text-[13px]" style={{ color: ch('included_utilities') ? AMBER : undefined }}>
                    {ch('included_utilities') ? u : <span className="text-ink">{u}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deposit */}
        {isRent && depositPolicy && depositPolicy !== 'none' && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${ch('deposit_policy') ? 'border-amber-300 bg-amber-50' : 'border-line-soft bg-paper2'}`}>
            <Calendar size={15} className="shrink-0" style={{ color: ch('deposit_policy') ? AMBER : undefined }} />
            <div>
              <div className="text-[10.5px]" style={{ color: ch('deposit_policy') ? AMBER : undefined }}>
                {ch('deposit_policy') ? 'Security Deposit' : <span className="text-dim">Security Deposit</span>}
              </div>
              <div className="text-[13.5px] font-bold" style={{ color: ch('deposit_policy') ? AMBER : undefined }}>
                {ch('deposit_policy')
                  ? (DEPOSIT_LABELS[depositPolicy] ?? depositPolicy)
                  : <span className="text-ink">{DEPOSIT_LABELS[depositPolicy] ?? depositPolicy}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Utilities */}
        {utilities && (
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-widest mb-2"
              style={{ color: ch('utilities') ? AMBER : undefined }}>
              {ch('utilities') ? 'Utilities' : <span className="text-dim">Utilities</span>}
            </div>
            {(() => {
              const raw  = utilities
              const html = raw.trimStart().startsWith('<') ? raw : `<p>${raw}</p>`
              const safe = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
              return (
                <div
                  className="detail-prose"
                  style={ch('utilities') ? { color: AMBER } : undefined}
                  dangerouslySetInnerHTML={{ __html: safe }}
                />
              )
            })()}
          </div>
        )}

        {/* Videos */}
        {videoLinks.length > 0 && (
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-widest mb-3"
              style={{ color: ch('video_links') ? AMBER : undefined }}>
              {ch('video_links') ? 'Videos' : <span className="text-dim">Videos</span>}
            </div>
            <div className="space-y-2.5">
              {videoLinks.map((url, i) => {
                const safe  = safeUrl(url)
                if (!safe) return null
                const embed = youtubeEmbedUrl(safe)
                if (embed) {
                  return (
                    <div key={i} className={`rounded-xl overflow-hidden aspect-video ${ch('video_links') ? 'ring-2 ring-amber-400' : ''}`}>
                      <iframe src={embed} className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen title={`Video ${i + 1}`} />
                    </div>
                  )
                }
                return (
                  <a key={i} href={safe} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[12.5px] font-semibold transition-colors"
                    style={ch('video_links')
                      ? { background: '#fffbeb', borderColor: '#fcd34d', color: '#92400e' }
                      : { background: 'var(--color-paper2)', borderColor: 'var(--color-line-soft)', color: 'var(--color-ink)' }}>
                    <Video size={14} className="shrink-0" style={{ color: ch('video_links') ? AMBER : undefined }} />
                    <span className="flex-1 truncate">{safe}</span>
                    <Link2 size={12} style={{ color: ch('video_links') ? AMBER : undefined }} />
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* 3D Tour */}
        {tourUrl && safeUrl(tourUrl) && (
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-widest mb-2"
              style={{ color: ch('tour_3d_url') ? AMBER : undefined }}>
              {ch('tour_3d_url') ? '3D Tour' : <span className="text-dim">3D Tour</span>}
            </div>
            <a href={safeUrl(tourUrl)!} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[12.5px] font-semibold transition-colors"
              style={ch('tour_3d_url')
                ? { background: '#fffbeb', borderColor: '#fcd34d', color: '#92400e' }
                : { background: 'var(--color-paper2)', borderColor: 'var(--color-line-soft)', color: 'var(--color-ink)' }}>
              <Box size={14} className="shrink-0" style={{ color: ch('tour_3d_url') ? AMBER : undefined }} />
              <span className="flex-1 truncate">{safeUrl(tourUrl)}</span>
              <Link2 size={12} style={{ color: ch('tour_3d_url') ? AMBER : undefined }} />
            </a>
          </div>
        )}

        {/* Maps URL */}
        {mapsUrl && safeUrl(mapsUrl) && (
          <div className="flex items-center gap-2 text-[12.5px]">
            <Link2 size={13} className="shrink-0" style={{ color: ch('maps_url') ? AMBER : undefined }} />
            <a href={safeUrl(mapsUrl)!} target="_blank" rel="noopener noreferrer"
              className="hover:underline truncate"
              style={{ color: ch('maps_url') ? AMBER : '#2563eb' }}>
              View on Google Maps
            </a>
          </div>
        )}

        {/* Description */}
        {description && (
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-widest mb-2"
              style={{ color: ch('description') ? AMBER : undefined }}>
              {ch('description') ? 'Description' : <span className="text-dim">Description</span>}
            </div>
            {(() => {
              const raw  = description
              const html = raw.trimStart().startsWith('<') ? raw : `<p>${raw}</p>`
              const safe = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
              return (
                <div
                  className="detail-prose"
                  style={ch('description') ? { color: AMBER } : undefined}
                  dangerouslySetInnerHTML={{ __html: safe }}
                />
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

interface Props {
  edit: AdminListingEdit
  working: boolean
  onApprove: () => void
  onReject: (reason: string) => void
  onClose: () => void
}

export function ListingEditReviewPage({ edit, working, onApprove, onReject, onClose }: Props) {
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')

  const changedKeys = getChangedKeys(edit.current_data, edit.proposed_data)

  return (
    <div className="fixed top-15 left-0 md:left-58 right-0 bottom-0 z-20 bg-paper flex flex-col">

      {/* Top bar */}
      <div className="shrink-0 border-b border-line px-5 py-3.5 flex items-center gap-4 bg-paper">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-dim hover:text-ink transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="w-px h-5 bg-line shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-ink truncate">{edit.listing_title}</div>
          <div className="flex items-center gap-1 text-[11px] text-dim">
            <MapPin size={10} />{edit.listing_location}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[10px] text-dim uppercase tracking-wide">Submitted by</div>
          <div className="text-[13px] font-semibold text-ink">{edit.submitted_by_name ?? '—'}</div>
          <div className="text-[11px] text-dim">{edit.submitted_by_email ?? ''}</div>
        </div>

        <div className="text-right shrink-0 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200">
          <div className="text-[10px] text-amber-600 uppercase tracking-wide font-semibold">Changes</div>
          <div className="text-[22px] font-extrabold leading-tight" style={{ color: AMBER }}>{changedKeys.size}</div>
        </div>
      </div>

      {/* Column headers */}
      <div className="shrink-0 grid grid-cols-2 border-b border-line">
        <div className="px-5 py-2.5 border-r border-white/10 bg-nav">
          <div className="text-[11px] font-bold uppercase tracking-widest text-white">
            Current · Live
          </div>
        </div>
        <div className="px-5 py-2.5 flex items-center gap-2.5" style={{ background: '#451a03' }}>
          <div className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
            Proposed Changes
          </div>
          {changedKeys.size > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950">
              {changedKeys.size} field{changedKeys.size !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Split body — both columns scroll together */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 min-h-full divide-x divide-line">
          <SnapshotColumn data={edit.current_data} changedKeys={changedKeys} isProposed={false} />
          <SnapshotColumn data={edit.proposed_data} changedKeys={changedKeys} isProposed={true} />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-line px-5 py-4 flex items-center gap-3 bg-paper">
        {rejectOpen ? (
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && reason.trim() && onReject(reason.trim())}
              placeholder="Reason for rejection…"
              className="flex-1 px-3 py-2 rounded-lg border border-line bg-white text-[13px] text-ink outline-none focus:border-red-400"
              autoFocus
            />
            <button
              onClick={() => { if (reason.trim()) onReject(reason.trim()) }}
              disabled={!reason.trim() || working}
              className="px-4 py-2 rounded-lg text-[12px] font-bold text-white disabled:opacity-50 cursor-pointer shrink-0"
              style={{ background: '#e10f1f' }}
            >
              Confirm Reject
            </button>
            <button
              onClick={() => setRejectOpen(false)}
              className="px-3 py-2 rounded-lg text-[12px] font-semibold text-ink border border-line cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-dim hover:text-ink border border-line bg-paper cursor-pointer transition-colors"
            >
              Close
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setRejectOpen(true)}
              disabled={working}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold border border-line bg-paper text-ink cursor-pointer disabled:opacity-50"
            >
              <X size={14} strokeWidth={2.5} /> Reject Edit
            </button>
            <button
              onClick={onApprove}
              disabled={working}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white cursor-pointer disabled:opacity-50"
              style={{ background: '#1f7a3d' }}
            >
              <Check size={14} strokeWidth={2.5} /> Approve & Go Live
            </button>
          </>
        )}
      </div>
    </div>
  )
}
