import { useState, useEffect, useRef } from 'react'
import {
  Building2, Plus, Search, MoreHorizontal, Home, Pencil, Trash2, EyeOff,
  ChevronLeft, ChevronRight, X, MapPin, Tag, Link2, ImagePlus, Star, ArrowLeft,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getMyListings, updateListing, uploadListingImages, type Listing } from '../../api/listings'

const titleCase = (s: string) =>
  s === s.toUpperCase() ? s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : s

const sentenceCase = (s: string) =>
  s === s.toUpperCase() ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s

// ── constants ────────────────────────────────────────────────────────────────

const REGIONS = [
  'Cap Cana', 'Cabarete', 'Jarabacoa', 'Las Terrenas', 'Punta Cana',
  'Puerto Plata', 'Samaná', 'Santo Domingo', 'Santiago', 'Sosúa',
]
const TYPES    = ['villa', 'apartment', 'condo', 'land', 'commercial']
const FEATURES = [
  'Pool', 'Ocean View', 'Furnished', 'Beach Access', 'Mountain View',
  'Parking', 'Gym', 'Smart Home', 'Backup Generator', 'Solar Panels',
]
const TAGS = ['Luxury', 'New', 'Investment', 'For Rent', 'Commercial']

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; filter: string }> = {
  active:           { label: 'Active',   bg: '#dcfce7', color: '#15803d', filter: 'Active'   },
  pending_approval: { label: 'Review',   bg: '#fef9c3', color: '#a16207', filter: 'Review'   },
  rejected:         { label: 'Rejected', bg: '#fee2e2', color: '#b91c1c', filter: 'Rejected' },
  archived:         { label: 'Archived', bg: '#f3f4f6', color: '#6b7280', filter: 'Archived' },
}

// ── small helpers ─────────────────────────────────────────────────────────────

function fmtPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`
  if (price >= 1_000)     return `$${Math.round(price / 1_000)}K`
  return `$${price}`
}

function fmtType(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
}

function StatusChip({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, bg: '#f3f4f6', color: '#6b7280' }
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  )
}

// ── form sub-components (shared by EditForm) ──────────────────────────────────

const inp = 'w-full px-3 py-2.5 rounded-lg border border-line bg-white text-[13.5px] text-ink outline-none transition-colors focus:border-[#1f7a3d]'

function Lbl({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11.5px] font-semibold text-dim uppercase tracking-wide mb-1.5">
      {children}
    </div>
  )
}

function Sec({ n, title, tone, children }: { n: number; title: string; tone: string; children: React.ReactNode }) {
  return (
    <div className="bg-paper border border-line rounded-2xl px-6 py-5">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-6 h-6 rounded-full text-white text-[11px] font-bold grid place-items-center shrink-0"
          style={{ background: tone }}
        >
          {n}
        </div>
        <div className="text-[14px] font-bold text-ink">{title}</div>
        <div className="flex-1 h-px bg-line" />
      </div>
      {children}
    </div>
  )
}

function Toggle({ value, onChange, label, tone }: {
  value: boolean; onChange: (v: boolean) => void; label: string; tone: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer text-[13px] font-semibold w-full text-left transition-all"
      style={{
        borderColor: value ? tone : '#e2e8f0',
        background:  value ? `${tone}0d` : 'white',
        color:       value ? tone : '#64748b',
      }}
    >
      <div
        className="w-9 h-5 rounded-full relative shrink-0 transition-colors duration-150"
        style={{ background: value ? tone : '#cbd5e1' }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-150"
          style={{ left: value ? '1.25rem' : '0.125rem' }}
        />
      </div>
      {label}
    </button>
  )
}

// ── ActionMenu (3-dots dropdown) ──────────────────────────────────────────────

function ActionMenu({ onEdit }: { onEdit: () => void }) {
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState({ top: 0, left: 0 })
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
      setPos({ top: r.bottom + 6, left: r.right - 144 })
    }
    setOpen(v => !v)
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-dim hover:text-ink hover:bg-line/50 transition-colors cursor-pointer"
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="fixed w-36 bg-paper rounded-xl border border-line shadow-lg z-50 overflow-hidden"
          style={{ top: pos.top, left: pos.left }}
        >
          <button
            onClick={() => { onEdit(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs text-ink hover:bg-line/40 transition-colors cursor-pointer"
          >
            <Pencil size={12} /> Edit listing
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs text-ink hover:bg-line/40 transition-colors cursor-pointer"
          >
            <EyeOff size={12} /> Hide listing
          </button>
          <div className="border-t border-line" />
          <button
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={12} /> Delete listing
          </button>
        </div>
      )}
    </>
  )
}

// ── DetailPanel (slide-over) ──────────────────────────────────────────────────

function DetailPanel({
  listing, tone, onClose, onEdit,
}: {
  listing: Listing; tone: string; onClose: () => void; onEdit: () => void
}) {
  const [imgIdx, setImgIdx] = useState(0)
  const imgs = listing.images ?? []

  const BOOLS: { key: keyof Listing; label: string }[] = [
    { key: 'seller_financing', label: 'Seller Financing' },
    { key: 'hoa',              label: 'HOA Community'    },
    { key: 'tax_exempt',       label: 'CONFOTUR Tax Exempt' },
    { key: 'gated_community',  label: 'Gated Community'  },
  ]

  const FIELDS: { key: keyof Listing; label: string; fmt?: (v: unknown) => string }[] = [
    { key: 'price',              label: 'Price',              fmt: v => fmtPrice(Number(v))              },
    { key: 'type',               label: 'Property Type',      fmt: v => fmtType(String(v))               },
    { key: 'transaction',        label: 'Transaction',        fmt: v => fmtType(String(v))               },
    { key: 'year_built',         label: 'Year Built'                                                     },
    { key: 'bedrooms',           label: 'Bedrooms'                                                       },
    { key: 'bathrooms',          label: 'Bathrooms'                                                      },
    { key: 'area_sqft',          label: 'Living Area (ft²)'                                              },
    { key: 'lot_size_sqft',      label: 'Lot Size (ft²)'                                                 },
    { key: 'roi',                label: 'Est. ROI (%)'                                                   },
    { key: 'hoa_fee',            label: 'HOA Fee ($/mo)'                                                 },
    { key: 'construction_status', label: 'Construction',      fmt: v => String(v).replace(/_/g, ' ')    },
  ]

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-120 max-w-full bg-paper z-50 flex flex-col shadow-2xl">
        {/* Image carousel */}
        <div className="relative bg-black shrink-0" style={{ height: 220 }}>
          {imgs.length > 0 ? (
            <>
              <img src={imgs[imgIdx]} alt="" className="w-full h-full object-cover opacity-90" />
              {imgs.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {imgs.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className="w-1.5 h-1.5 rounded-full cursor-pointer transition-colors"
                        style={{ background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.45)' }}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: `${tone}22` }}>
              <Home size={48} style={{ color: tone }} className="opacity-60" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Title + status */}
          <div>
            <div className="flex items-start gap-2 justify-between">
              <h2 className="text-[16px] font-bold text-ink leading-snug flex-1">{titleCase(listing.title)}</h2>
              <StatusChip status={listing.status} />
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[12px] text-dim">
              <MapPin size={12} />
              {listing.location}
            </div>
          </div>

          {/* Rejection notice */}
          {listing.status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[12.5px] text-red-700">
              <span className="font-semibold">Rejected: </span>
              {listing.rejection_reason ?? 'No reason provided.'}
              <div className="mt-1.5 text-[11.5px] text-red-500">
                You can edit and resubmit this listing for review.
              </div>
            </div>
          )}

          {/* Fields grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {FIELDS.filter(({ key }) => {
              const v = listing[key]
              return v !== null && v !== undefined && v !== ''
            }).map(({ key, label, fmt }) => (
              <div key={key}>
                <div className="text-[10.5px] font-semibold text-dim uppercase tracking-wide">{label}</div>
                <div className="text-[13px] font-semibold text-ink mt-0.5">
                  {fmt ? fmt(listing[key]) : String(listing[key])}
                </div>
              </div>
            ))}
          </div>

          {/* Boolean badges */}
          {BOOLS.some(b => listing[b.key] === true) && (
            <div className="flex flex-wrap gap-2">
              {BOOLS.filter(b => listing[b.key] === true).map(b => (
                <span
                  key={b.key}
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
              <div className="text-[10.5px] font-semibold text-dim uppercase tracking-wide mb-2">Features</div>
              <div className="flex flex-wrap gap-1.5">
                {listing.features.map(f => (
                  <span key={f} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-line text-ink">
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
          {listing.maps_url && (
            <div className="flex items-center gap-2 text-[12.5px]">
              <Link2 size={13} className="text-dim shrink-0" />
              <a
                href={listing.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
              >
                View on Google Maps
              </a>
            </div>
          )}

          {/* Description */}
          {listing.description && (
            <div>
              <div className="text-[10.5px] font-semibold text-dim uppercase tracking-wide mb-1.5">Description</div>
              <p className="text-[13px] text-ink leading-[1.6] whitespace-pre-wrap">{sentenceCase(listing.description)}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-line px-5 py-4 flex gap-3 shrink-0">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold text-white cursor-pointer"
            style={{ background: tone }}
          >
            <Pencil size={14} /> Edit Listing
          </button>
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

// ── EditForm (inline full-page edit) ─────────────────────────────────────────

function EditForm({
  listing, tone, onBack, onSaved,
}: {
  listing: Listing; tone: string; onBack: () => void; onSaved: (updated: Listing) => void
}) {
  const [form, setFormState] = useState({
    title:               listing.title,
    type:                listing.type,
    transaction:         listing.transaction,
    location:            listing.location,
    price:               String(listing.price),
    description:         listing.description ?? '',
    bedrooms:            listing.bedrooms    != null ? String(listing.bedrooms)    : '',
    bathrooms:           listing.bathrooms   != null ? String(listing.bathrooms)   : '',
    area_sqft:           listing.area_sqft   != null ? String(listing.area_sqft)   : '',
    lot_size_sqft:       listing.lot_size_sqft != null ? String(listing.lot_size_sqft) : '',
    construction_status: listing.construction_status ?? '',
    year_built:          listing.year_built  != null ? String(listing.year_built)  : '',
    roi:                 listing.roi         != null ? String(listing.roi)         : '',
    seller_financing:    listing.seller_financing,
    hoa:                 listing.hoa,
    hoa_fee:             listing.hoa_fee     != null ? String(listing.hoa_fee)     : '',
    tax_exempt:          listing.tax_exempt,
    gated_community:     listing.gated_community,
    features:            listing.features ?? [],
    maps_url:            listing.maps_url ?? '',
    tag:                 listing.tag ?? '',
  })

  const [uploadedUrls, setUploadedUrls] = useState<string[]>(listing.images ?? [])
  const [thumbnail,    setThumbnail]    = useState<string | null>(listing.images?.[0] ?? null)
  const [uploading,    setUploading]    = useState(false)
  const [submitting,   setSubmitting]   = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function set(f: string, v: unknown) {
    setFormState(p => ({ ...p, [f]: v }))
  }

  function toggleFeature(f: string) {
    set('features', form.features.includes(f)
      ? form.features.filter(x => x !== f)
      : [...form.features, f])
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    if (uploadedUrls.length + files.length > 10) {
      toast.error('Maximum 10 photos allowed.')
      return
    }
    setUploading(true)
    try {
      const newUrls = await uploadListingImages(files)
      setUploadedUrls(prev => {
        const merged = [...prev, ...newUrls]
        if (!thumbnail) setThumbnail(merged[0])
        return merged
      })
    } catch {
      toast.error('Upload failed. Check file types (JPEG, PNG, WebP) and sizes (max 8 MB).')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removeImage(url: string) {
    setUploadedUrls(prev => {
      const next = prev.filter(u => u !== url)
      if (thumbnail === url) setThumbnail(next[0] ?? null)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.title.trim() || !form.location || !form.price) {
      toast.error('Title, region, and price are required.')
      return
    }
    setSubmitting(true)
    try {
      const orderedImages = thumbnail
        ? [thumbnail, ...uploadedUrls.filter(u => u !== thumbnail)]
        : uploadedUrls
      const updated = await updateListing(listing.id, {
        title:               form.title.trim(),
        description:         form.description.trim() || undefined,
        type:                form.type,
        transaction:         form.transaction,
        price:               parseFloat(form.price),
        location:            form.location,
        bedrooms:            form.bedrooms    ? parseInt(form.bedrooms)    : undefined,
        bathrooms:           form.bathrooms   ? parseInt(form.bathrooms)   : undefined,
        area_sqft:           form.area_sqft   ? parseInt(form.area_sqft)   : undefined,
        lot_size_sqft:       form.lot_size_sqft ? parseInt(form.lot_size_sqft) : undefined,
        construction_status: form.construction_status || undefined,
        year_built:          form.year_built  ? parseInt(form.year_built)  : undefined,
        roi:                 form.roi         ? parseFloat(form.roi)       : undefined,
        seller_financing:    form.seller_financing,
        hoa:                 form.hoa,
        hoa_fee:             form.hoa && form.hoa_fee ? parseFloat(form.hoa_fee) : undefined,
        tax_exempt:          form.tax_exempt,
        gated_community:     form.gated_community,
        features:            form.features.length ? form.features : undefined,
        maps_url:            form.maps_url.trim() || undefined,
        tag:                 form.tag || undefined,
        images:              orderedImages,
      })
      toast.success(listing.status === 'rejected' ? 'Listing resubmitted for review!' : 'Changes saved!')
      onSaved(updated)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-dim text-[13px] mb-4 bg-transparent border-0 cursor-pointer hover:text-ink transition-colors"
      >
        <ArrowLeft size={14} /> Back to Listing
      </button>

      <h2 className="text-[20px] font-bold text-ink mb-5">Edit Listing</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 1 — Basic Info */}
        <Sec n={1} title="Basic Info" tone={tone}>
          <div className="space-y-4">
            <div>
              <Lbl>Property Title *</Lbl>
              <input
                className={inp}
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="e.g. Oceanfront Villa with Infinity Pool"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Lbl>Property Type</Lbl>
                <select className={inp + ' cursor-pointer'} value={form.type} onChange={e => set('type', e.target.value)}>
                  {TYPES.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <Lbl>Purpose</Lbl>
                <div className="flex gap-2">
                  {(['sale', 'rent'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => set('transaction', p)}
                      className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold border cursor-pointer transition-all"
                      style={{
                        background:  form.transaction === p ? tone : 'white',
                        color:       form.transaction === p ? 'white' : '#64748b',
                        borderColor: form.transaction === p ? tone : '#e2e8f0',
                      }}
                    >
                      For {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Lbl>Region *</Lbl>
                <select
                  className={inp + ' cursor-pointer'}
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                  required
                >
                  <option value="">Select region…</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <Lbl>Price (USD) *</Lbl>
                <input
                  className={inp}
                  type="number"
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  placeholder="e.g. 850000"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <Lbl>Description</Lbl>
              <textarea
                className={inp + ' resize-none'}
                rows={4}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe the property — location highlights, finishes, lifestyle…"
              />
            </div>
          </div>
        </Sec>

        {/* 2 — Property Details */}
        <Sec n={2} title="Property Details" tone={tone}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { key: 'bedrooms',      label: 'Bedrooms',        ph: '3'    },
              { key: 'bathrooms',     label: 'Bathrooms',       ph: '2'    },
              { key: 'area_sqft',     label: 'Living Area (ft²)', ph: '2400' },
              { key: 'lot_size_sqft', label: 'Lot Size (ft²)',  ph: '5000' },
            ].map(({ key, label, ph }) => (
              <div key={key}>
                <Lbl>{label}</Lbl>
                <input
                  className={inp}
                  type="number"
                  value={form[key as keyof typeof form] as string}
                  onChange={e => set(key, e.target.value)}
                  placeholder={ph}
                  min="0"
                />
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 — Construction */}
        <Sec n={3} title="Construction" tone={tone}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Lbl>Construction Status</Lbl>
              <select
                className={inp + ' cursor-pointer'}
                value={form.construction_status}
                onChange={e => set('construction_status', e.target.value)}
              >
                <option value="">Not specified</option>
                <option value="pre_construction">Pre-construction</option>
                <option value="under_construction">Under construction</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            {form.construction_status === 'completed' && (
              <div>
                <Lbl>Year Built</Lbl>
                <input
                  className={inp}
                  type="number"
                  value={form.year_built}
                  onChange={e => set('year_built', e.target.value)}
                  placeholder="e.g. 2019"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            )}
          </div>
        </Sec>

        {/* 4 — Financials */}
        <Sec n={4} title="Financials" tone={tone}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Lbl>Est. Annual ROI (%)</Lbl>
                <input
                  className={inp}
                  type="number"
                  step="0.1"
                  value={form.roi}
                  onChange={e => set('roi', e.target.value)}
                  placeholder="e.g. 8.5"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Toggle value={form.seller_financing} onChange={v => set('seller_financing', v)} label="Seller Financing Available" tone={tone} />
              <Toggle value={form.tax_exempt}       onChange={v => set('tax_exempt', v)}       label="CONFOTUR Tax Exempt"        tone={tone} />
              <Toggle value={form.hoa}              onChange={v => { set('hoa', v); if (!v) set('hoa_fee', '') }} label="HOA Community" tone={tone} />
              {form.hoa && (
                <div>
                  <Lbl>Monthly HOA Fee (USD)</Lbl>
                  <input
                    className={inp}
                    type="number"
                    value={form.hoa_fee}
                    onChange={e => set('hoa_fee', e.target.value)}
                    placeholder="e.g. 350"
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>
        </Sec>

        {/* 5 — Community & Features */}
        <Sec n={5} title="Community & Features" tone={tone}>
          <div className="space-y-4">
            <Toggle value={form.gated_community} onChange={v => set('gated_community', v)} label="Gated Community" tone={tone} />
            <div>
              <Lbl>Property Features</Lbl>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                {FEATURES.map(f => {
                  const active = form.features.includes(f)
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFeature(f)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border text-[13px] cursor-pointer transition-all text-left"
                      style={{
                        borderColor: active ? tone : '#e2e8f0',
                        background:  active ? `${tone}0d` : 'white',
                        color:       active ? tone : '#64748b',
                        fontWeight:  active ? 600 : 400,
                      }}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded border shrink-0 grid place-items-center transition-colors"
                        style={{ borderColor: active ? tone : '#cbd5e1', background: active ? tone : 'white' }}
                      >
                        {active && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      {f}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </Sec>

        {/* 6 — Media & Location */}
        <Sec n={6} title="Media & Location" tone={tone}>
          <div className="space-y-4">
            <div>
              <Lbl>Property Photos</Lbl>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex flex-col items-center gap-2 py-7 rounded-xl border-2 border-dashed cursor-pointer transition-colors disabled:opacity-50"
                style={{ borderColor: tone + '55', background: tone + '06' }}
              >
                <ImagePlus size={22} style={{ color: tone }} />
                <span className="text-[13px] font-semibold" style={{ color: tone }}>
                  {uploading ? 'Uploading…' : 'Click to add more photos'}
                </span>
                <span className="text-[11.5px] text-dim">JPEG, JPG, PNG, WebP · max 8 MB each · up to 10 photos</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />

              {uploadedUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {uploadedUrls.map(url => {
                    const isThumb = thumbnail === url
                    return (
                      <div
                        key={url}
                        className="relative group rounded-xl overflow-hidden border-2 transition-all"
                        style={{ borderColor: isThumb ? tone : 'transparent' }}
                      >
                        <img src={url} alt="" className="w-full h-24 object-cover" />
                        <button
                          type="button"
                          onClick={() => setThumbnail(url)}
                          title="Set as thumbnail"
                          className="absolute top-1.5 left-1.5 rounded-full p-1 transition-colors"
                          style={{ background: isThumb ? tone : 'rgba(0,0,0,0.45)' }}
                        >
                          <Star size={11} fill={isThumb ? 'white' : 'none'} color="white" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          title="Remove photo"
                          className="absolute top-1.5 right-1.5 rounded-full p-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={11} color="white" />
                        </button>
                        {isThumb && (
                          <div
                            className="absolute bottom-0 inset-x-0 text-center text-[10px] font-bold text-white py-0.5"
                            style={{ background: tone + 'cc' }}
                          >
                            Thumbnail
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div>
              <Lbl>Google Maps URL</Lbl>
              <input
                className={inp}
                type="url"
                value={form.maps_url}
                onChange={e => set('maps_url', e.target.value)}
                placeholder="https://maps.google.com/…"
              />
            </div>
          </div>
        </Sec>

        {/* 7 — Tag */}
        <Sec n={7} title="Listing Tag" tone={tone}>
          <Lbl>Tag (optional)</Lbl>
          <div className="flex flex-wrap gap-2 mt-1">
            {TAGS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => set('tag', form.tag === t ? '' : t)}
                className="px-4 py-2 rounded-full border text-[13px] font-semibold cursor-pointer transition-all"
                style={{
                  borderColor: form.tag === t ? tone : '#e2e8f0',
                  background:  form.tag === t ? tone : 'white',
                  color:       form.tag === t ? 'white' : '#64748b',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </Sec>

        <div className="flex gap-3 pt-2 pb-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-full border border-line bg-paper text-ink text-[13.5px] font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-full text-white text-[13.5px] font-bold border-0 cursor-pointer disabled:opacity-50 transition-opacity"
            style={{ background: tone }}
          >
            {submitting ? 'Saving…' : listing.status === 'rejected' ? 'Save & Resubmit for Review' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function RealtorListings({ tone, go }: { tone: string; go: (v: string) => void }) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState<'All' | 'Active' | 'Review' | 'Rejected' | 'Archived'>('All')
  const [query,    setQuery]    = useState('')
  const [selected, setSelected] = useState<Listing | null>(null)
  const [editing,  setEditing]  = useState(false)

  const filters = ['All', 'Active', 'Review', 'Rejected', 'Archived'] as const

  function load() {
    getMyListings()
      .then(setListings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const afterFilter = filter === 'All'
    ? listings
    : listings.filter(l => (STATUS_MAP[l.status]?.filter ?? l.status) === filter)

  const visible = query.trim()
    ? afterFilter.filter(l =>
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.location.toLowerCase().includes(query.toLowerCase())
      )
    : afterFilter

  // ── Edit mode: replace entire view with the edit form ──────────────────────
  if (editing && selected) {
    return (
      <EditForm
        listing={selected}
        tone={tone}
        onBack={() => setEditing(false)}
        onSaved={updated => {
          setListings(prev => prev.map(l => l.id === updated.id ? updated : l))
          setSelected(updated)
          setEditing(false)
        }}
      />
    )
  }

  return (
    <>
      <div className="bg-paper rounded-2xl border border-line overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search listings…"
                className="pl-7 pr-3 py-1.5 text-xs rounded-lg border border-line bg-transparent text-ink placeholder:text-dim outline-none focus:border-brand transition-colors w-56"
              />
            </div>
            <button
              onClick={() => go('submit-listing')}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0"
              style={{ background: tone, color: '#fff', border: `1.5px solid ${tone}` }}
            >
              <Plus size={13} strokeWidth={2.5} />
              Add listing
            </button>
          </div>

          <div className="flex-1" />

          <div className="flex gap-1.5">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="py-1 px-3 rounded-full text-xs font-semibold cursor-pointer transition-colors"
                style={{
                  border:     `1px solid ${filter === f ? tone : '#e4ddcf'}`,
                  background: filter === f ? tone : 'transparent',
                  color:      filter === f ? '#fff' : '#33425f',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="py-10 text-center text-sm text-dim">Loading…</div>
        ) : listings.length === 0 ? (
          <div className="py-14 flex flex-col items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: `${tone}18` }}
            >
              <Building2 size={26} style={{ color: tone }} />
            </div>
            <div className="text-center">
              <div className="text-[15px] font-semibold text-ink mb-1">No listings yet</div>
              <div className="text-xs text-dim max-w-55">
                Add your first property to start attracting buyers and renters.
              </div>
            </div>
            <button
              onClick={() => go('submit-listing')}
              className="flex items-center gap-1.5 py-2 px-5 rounded-full text-[13px] font-bold cursor-pointer"
              style={{ background: tone, color: '#fff' }}
            >
              <Plus size={14} strokeWidth={2.5} />
              Add your first listing
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-5 py-3">Property</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Type</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Price</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Views</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Leads</th>
                <th className="text-left text-[10px] font-semibold text-dim uppercase tracking-wide px-4 py-3">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-dim">
                    {query.trim()
                      ? `No results for "${query}"`
                      : `No ${filter.toLowerCase()} listings.`}
                  </td>
                </tr>
              ) : (
                visible.map((l, i) => (
                  <tr
                    key={l.id}
                    onClick={() => { setSelected(l); setEditing(false) }}
                    className={`hover:bg-line/20 transition-colors cursor-pointer ${i < visible.length - 1 ? 'border-b border-line' : ''}`}
                  >
                    {/* Property */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {l.images?.[0] ? (
                          <img
                            src={l.images[0]}
                            alt={l.title}
                            className="w-24 h-14 rounded-[10px] object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className="w-24 h-14 rounded-[10px] flex items-center justify-center shrink-0"
                            style={{ background: `${tone}18` }}
                          >
                            <Home size={22} style={{ color: tone }} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-ink truncate max-w-50">{titleCase(l.title)}</div>
                          <div className="text-[11px] text-dim truncate max-w-50">{l.location}</div>
                        </div>
                      </div>
                    </td>
                    {/* Type */}
                    <td className="px-4 py-3.5 text-[13px] text-ink">{fmtType(l.type)}</td>
                    {/* Price */}
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-ink">{fmtPrice(Number(l.price))}</td>
                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusChip status={l.status} />
                    </td>
                    {/* Views */}
                    <td className="px-4 py-3.5 text-[13px] text-dim">—</td>
                    {/* Leads */}
                    <td className="px-4 py-3.5 text-[13px] text-dim">—</td>
                    {/* Updated */}
                    <td className="px-4 py-3.5 text-[13px] text-dim">—</td>
                    {/* Actions */}
                    <td
                      className="px-4 py-3.5"
                      onClick={e => e.stopPropagation()}
                    >
                      <ActionMenu onEdit={() => { setSelected(l); setEditing(true) }} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail panel slide-over */}
      {selected && !editing && (
        <DetailPanel
          listing={selected}
          tone={tone}
          onClose={() => setSelected(null)}
          onEdit={() => setEditing(true)}
        />
      )}
    </>
  )
}
