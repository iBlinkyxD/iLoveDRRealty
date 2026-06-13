import { useState, useEffect } from 'react'
import {
  X, MapPin, Tag, Link2, Eye, Users, Home, Pencil,
  ChevronLeft, ChevronRight, CircleDollarSign, ArrowLeftRight,
  Calendar, BedDouble, Bath, Ruler, Maximize2, TrendingUp,
  Wallet, CheckCircle2, Star, Clock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import DOMPurify from 'dompurify'
import toast from 'react-hot-toast'
import type { Listing } from '../../api/listings'
import { submitDealRequest } from '../../api/listings'

const STATUS_CHIP_DARK: Record<string, { bg: string; color: string; label: string }> = {
  active:           { bg: '#16a34a', color: 'white',   label: 'Active'   },
  pending_approval: { bg: '#fef08a', color: '#854d0e', label: 'Pending'  },
  rejected:         { bg: '#dc2626', color: 'white',   label: 'Rejected' },
  archived:         { bg: '#6b7280', color: 'white',   label: 'Archived' },
}

const titleCase = (s: string) =>
  s === s.toUpperCase() ? s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : s

function fmtType(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
}

interface Props {
  listing: Listing
  tone: string
  role?: string
  openDeal?: boolean
  onClose: () => void
  onEdit: () => void
}

export function ListingDetailPanel({ listing, tone, role, openDeal, onClose, onEdit }: Props) {
  const [imgIdx,        setImgIdx]        = useState(0)
  const [dealOpen,      setDealOpen]      = useState(false)
  const [discountType,  setDiscountType]  = useState<'pct' | 'fixed'>('pct')
  const [discountValue, setDiscountValue] = useState('')
  const [dealMessage,   setDealMessage]   = useState('')
  const [submitting,    setSubmitting]    = useState(false)

  useEffect(() => { if (openDeal) setDealOpen(true) }, [openDeal])

  const isOwnerOrRealtor = role === 'owner' || role === 'realtor'
  const canRequestDeal = listing.status === 'active' && !listing.is_deal && !listing.has_pending_deal_request && isOwnerOrRealtor

  async function handleDealSubmit() {
    const val = parseFloat(discountValue)
    if (!val || val <= 0) return
    if (discountType === 'pct' && val >= 100) return
    setSubmitting(true)
    try {
      await submitDealRequest(listing.id, { discount_value: val, discount_type: discountType, message: dealMessage || undefined })
      toast.success('Deal request submitted! Admin will review it.')
      setDealOpen(false)
      setDiscountValue('')
      setDealMessage('')
    } catch {
      toast.error('Failed to submit deal request.')
    } finally {
      setSubmitting(false)
    }
  }
  const imgs = listing.images ?? []
  const chip = STATUS_CHIP_DARK[listing.status] ?? { bg: '#6b7280', color: 'white', label: listing.status }

  type PropField = { Icon: LucideIcon; label: string; value: string | number }
  const propFields: PropField[] = ([
    { Icon: CircleDollarSign, label: 'Price',             value: `$${Number(listing.price).toLocaleString('en-US')}` },
    { Icon: Home,             label: 'Property Type',     value: fmtType(listing.type) },
    { Icon: ArrowLeftRight,   label: 'Transaction',       value: fmtType(listing.transaction) },
    { Icon: Calendar,         label: 'Year Built',        value: listing.year_built },
    { Icon: BedDouble,        label: 'Bedrooms',          value: listing.bedrooms },
    { Icon: Bath,             label: 'Bathrooms',         value: listing.bathrooms },
    { Icon: Ruler,            label: 'Living Area (ft²)', value: listing.area_sqft     != null ? Number(listing.area_sqft).toLocaleString('en-US')     : null },
    { Icon: Maximize2,        label: 'Lot Size (ft²)',    value: listing.lot_size_sqft != null ? Number(listing.lot_size_sqft).toLocaleString('en-US') : null },
    { Icon: TrendingUp,       label: 'Est. ROI (%)',      value: listing.roi },
    { Icon: Wallet,           label: 'HOA Fee ($/mo)',    value: listing.hoa_fee != null ? `$${Number(listing.hoa_fee).toLocaleString('en-US')}` : null },
  ] as (PropField & { value: string | number | null | undefined })[]).filter(
    f => f.value != null && f.value !== ''
  ) as PropField[]

  const propRows: PropField[][] = []
  for (let i = 0; i < propFields.length; i += 3) propRows.push(propFields.slice(i, i + 3))

  const boolBadges = [
    { label: 'Seller Financing',    on: listing.seller_financing },
    { label: 'HOA Community',       on: listing.hoa              },
    { label: 'CONFOTUR Tax Exempt', on: listing.tax_exempt       },
    { label: 'Gated Community',     on: listing.gated_community  },
  ].filter(b => b.on)

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-140 max-w-full z-50 flex flex-col shadow-2xl overflow-hidden">

        {/* ── Image carousel ───────────────────────────────────────────── */}
        <div className="relative bg-black shrink-0" style={{ height: 240 }}>
          {imgs.length > 0 ? (
            <img src={imgs[imgIdx]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: `${tone}33` }}>
              <Home size={48} style={{ color: tone }} className="opacity-50" />
            </div>
          )}

          {imgs.length > 1 && (
            <>
              <button
                onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/75 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/75 cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/55 text-white text-[11px] font-semibold">
                {imgIdx + 1} / {imgs.length}
              </div>
            </>
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/75 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Scrollable body ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto bg-nav">

          {/* Navy header content */}
          <div className="px-5 pt-5 pb-8">

            {/* Title + status chip */}
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h2 className="text-[20px] font-extrabold text-white leading-snug flex-1">
                {titleCase(listing.title)}
              </h2>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold shrink-0 mt-0.5"
                style={{ background: chip.bg, color: chip.color }}
              >
                {chip.label}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <MapPin size={12} />
              {listing.location}
            </div>

            {/* Rejection reason */}
            {listing.status === 'rejected' && (
              <div className="mb-3 rounded-xl px-4 py-3 text-[12.5px]" style={{ background: 'rgba(220,38,38,0.18)', color: '#fca5a5' }}>
                <span className="font-semibold">Rejected: </span>
                {listing.rejection_reason ?? 'No reason provided.'}
                <div className="mt-1 text-[11.5px] opacity-80">
                  You can edit and resubmit this listing for review.
                </div>
              </div>
            )}

            {/* Pending activity banners */}
            {isOwnerOrRealtor && listing.has_pending_deal_request && (
              <div className="mb-3 rounded-xl px-4 py-3" style={{ background: 'rgba(240,168,0,0.15)', border: '1px solid rgba(240,168,0,0.25)' }}>
                <div className="flex items-center gap-2 text-[12.5px] font-semibold" style={{ color: '#fbbf24' }}>
                  <Clock size={13} />
                  Deal of the Week request pending
                </div>
                <div className="mt-1 text-[11.5px]" style={{ color: 'rgba(251,191,36,0.7)' }}>
                  Your request is under admin review.
                </div>
              </div>
            )}
            {isOwnerOrRealtor && listing.has_pending_edit && (
              <div className="mb-3 rounded-xl px-4 py-3" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}>
                <div className="flex items-center gap-2 text-[12.5px] font-semibold" style={{ color: '#c4b5fd' }}>
                  <Clock size={13} />
                  Listing edit pending approval
                </div>
                <div className="mt-1 text-[11.5px]" style={{ color: 'rgba(196,181,253,0.7)' }}>
                  Your changes are under admin review.
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t mb-5" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />

            {/* Stats row: Views + Leads */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <Eye size={16} style={{ color: 'rgba(255,255,255,0.8)' }} />
                </div>
                <div>
                  <div className="text-[20px] font-extrabold text-white leading-tight">
                    {(listing.view_count ?? 0).toLocaleString()}
                  </div>
                  <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Views</div>
                </div>
              </div>
              <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <Users size={16} style={{ color: 'rgba(255,255,255,0.8)' }} />
                </div>
                <div>
                  <div className="text-[20px] font-extrabold text-white leading-tight">
                    {(listing.leads_count ?? 0).toLocaleString()}
                  </div>
                  <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Leads</div>
                </div>
              </div>
            </div>
          </div>

          {/* White floating card */}
          <div className="bg-paper rounded-t-3xl -mt-5 px-5 pt-6 pb-6 space-y-6 min-h-full">

            {/* Property Information */}
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-widest text-dim mb-4">
                Property Information
              </div>
              <div className="divide-y divide-line-soft">
                {propRows.map((row, ri) => (
                  <div key={ri} className="grid grid-cols-3 py-3.5 gap-2">
                    {row.map(({ Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-2 min-w-0">
                        <div className="mt-0.5 shrink-0">
                          <Icon size={14} style={{ color: tone }} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10.5px] text-dim leading-tight truncate">{label}</div>
                          <div className="text-[13.5px] font-bold text-ink mt-0.5 truncate">{String(value)}</div>
                        </div>
                      </div>
                    ))}
                    {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                  </div>
                ))}

                {listing.construction_status && (
                  <div className="py-3.5 flex items-center gap-2">
                    <CheckCircle2 size={14} style={{ color: tone }} />
                    <div>
                      <div className="text-[10.5px] text-dim">Construction</div>
                      <div className="text-[13.5px] font-bold text-ink capitalize">
                        {listing.construction_status.replace(/_/g, ' ')}
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
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            )}

            {/* Features */}
            {listing.features?.length > 0 && (
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-widest text-dim mb-3">Features</div>
                <div className="flex flex-wrap gap-2">
                  {listing.features.map(f => (
                    <span key={f} className="px-3 py-1 rounded-full text-[12px] font-medium bg-white border border-line text-ink">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tag */}
            {listing.tag && (
              <div className="flex items-center gap-2 text-[12.5px] text-dim">
                <Tag size={13} />
                <span className="font-semibold text-ink">{listing.tag}</span>
              </div>
            )}

            {/* Maps URL */}
            {(() => {
              try {
                const u = new URL(listing.maps_url ?? '')
                if (u.protocol !== 'https:' && u.protocol !== 'http:') return null
                return (
                  <div className="flex items-center gap-2 text-[12.5px]">
                    <Link2 size={13} className="text-dim shrink-0" />
                    <a href={u.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                      View on Google Maps
                    </a>
                  </div>
                )
              } catch { return null }
            })()}

            {/* Deal of the Week badge */}
            {listing.is_deal && (
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl" style={{ background: '#f0a80018', border: '1px solid #f0a80030' }}>
                <Star size={14} fill="#f0a800" style={{ color: '#f0a800' }} />
                <div>
                  <div className="text-[12.5px] font-bold" style={{ color: '#c07800' }}>Deal of the Week</div>
                  {listing.deal_discount_value != null && (
                    <div className="text-[11px]" style={{ color: '#c07800' }}>
                      {listing.deal_discount_type === 'fixed'
                        ? `−$${Number(listing.deal_discount_value).toLocaleString()} off listed price`
                        : `−${listing.deal_discount_value}% off listed price`}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-widest text-dim mb-2">Description</div>
                {(() => {
                  const raw  = listing.description
                  const html = raw.trimStart().startsWith('<') ? raw : `<p>${raw}</p>`
                  const safe = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
                  return <div className="detail-prose" dangerouslySetInnerHTML={{ __html: safe }} />
                })()}
              </div>
            )}
          </div>
        </div>

        {/* ── Deal request form (above footer) ─────────────────────────── */}
        {canRequestDeal && dealOpen && (
          <div className="border-t border-amber-200 bg-amber-50/80 px-5 py-4 shrink-0 space-y-3">
            <div className="text-[12px] font-semibold" style={{ color: '#c07800' }}>Request Deal of the Week</div>

            {/* Discount type toggle */}
            <div className="flex rounded-lg border border-line overflow-hidden text-[12px] font-semibold bg-white">
              {(['pct', 'fixed'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setDiscountType(t); setDiscountValue('') }}
                  className="flex-1 py-1.5 cursor-pointer transition-colors"
                  style={discountType === t
                    ? { background: '#f0a800', color: 'white', border: 'none' }
                    : { color: '#6b7280', border: 'none', background: 'transparent' }
                  }
                >
                  {t === 'pct' ? '% Off' : 'Fixed $'}
                </button>
              ))}
            </div>

            <div>
              <label className="text-[11px] text-dim block mb-1">
                {discountType === 'pct' ? 'Discount percentage *' : 'Discount amount (USD) *'}
              </label>
              <div className="flex items-center gap-2">
                {discountType === 'fixed' && <span className="text-[13px] font-bold text-dim shrink-0">$</span>}
                <input
                  type="number"
                  min="1"
                  max={discountType === 'pct' ? 99 : undefined}
                  step={discountType === 'pct' ? 0.5 : 1000}
                  value={discountValue}
                  onChange={e => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'pct' ? 'e.g. 10' : 'e.g. 25000'}
                  className="flex-1 px-3 py-2 rounded-lg border border-line bg-white text-[12.5px] text-ink outline-none focus:border-amber-400"
                />
                {discountType === 'pct' && <span className="text-[13px] font-bold text-dim shrink-0">% off</span>}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-dim block mb-1">Message to admin (optional)</label>
              <textarea
                value={dealMessage}
                onChange={e => setDealMessage(e.target.value)}
                placeholder="Why should this be the deal of the week?"
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-line bg-white text-[12.5px] text-ink outline-none focus:border-amber-400 resize-none"
              />
            </div>
            <button
              onClick={handleDealSubmit}
              disabled={!discountValue || submitting}
              className="w-full py-2 rounded-lg text-[12.5px] font-bold text-white cursor-pointer disabled:opacity-50 border-0"
              style={{ background: '#f0a800' }}
            >
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        )}

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div className="border-t border-line px-5 py-4 flex gap-3 shrink-0 bg-paper">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold text-white cursor-pointer"
            style={{ background: tone }}
          >
            <Pencil size={14} /> Edit Listing
          </button>
          {canRequestDeal && (
            <button
              onClick={() => { setDealOpen(v => !v); setDiscountValue(''); setDealMessage('') }}
              title="Request Deal of the Week"
              className="w-10 h-10 flex items-center justify-center rounded-xl border cursor-pointer transition-colors"
              style={dealOpen
                ? { background: '#f0a800', borderColor: '#f0a800', color: 'white' }
                : { background: '#f0a80012', borderColor: '#f0a80050', color: '#c07800' }
              }
            >
              <Star size={15} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-ink border border-line bg-paper cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}
