import { useState, useRef } from 'react'
import { ArrowLeft, ImagePlus, X, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitListing, uploadListingImages } from '../../api/listings'

const REGIONS = [
  'Cap Cana', 'Cabarete', 'Jarabacoa', 'Las Terrenas', 'Punta Cana',
  'Puerto Plata', 'Samaná', 'Santo Domingo', 'Santiago', 'Sosúa',
]
const TYPES = ['villa', 'apartment', 'condo', 'land', 'commercial']
const FEATURES = [
  'Pool', 'Ocean View', 'Furnished', 'Beach Access', 'Mountain View',
  'Parking', 'Gym', 'Smart Home', 'Backup Generator', 'Solar Panels',
]
const TAGS = ['Luxury', 'New', 'Investment', 'For Rent', 'Commercial']

const inp = 'w-full px-3 py-2.5 rounded-lg border border-line bg-white text-[13.5px] text-ink outline-none transition-colors focus:border-[#1f7a3d]'

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
        <div className="flex-1 h-px bg-line-soft" />
      </div>
      {children}
    </div>
  )
}

function Lbl({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11.5px] font-semibold text-dim uppercase tracking-wide mb-1.5">
      {children}
    </div>
  )
}

function Toggle({
  value, onChange, label, tone,
}: { value: boolean; onChange: (v: boolean) => void; label: string; tone: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer text-[13px] font-semibold w-full text-left transition-all"
      style={{
        borderColor: value ? tone : '#e2e8f0',
        background: value ? `${tone}0d` : 'white',
        color: value ? tone : '#64748b',
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

const EMPTY_FORM = {
  title: '',
  type: 'villa',
  transaction: 'sale',
  location: '',
  price: '',
  description: '',
  bedrooms: '',
  bathrooms: '',
  area_sqft: '',
  lot_size_sqft: '',
  construction_status: '',
  year_built: '',
  roi: '',
  seller_financing: false,
  hoa: false,
  hoa_fee: '',
  tax_exempt: false,
  gated_community: false,
  features: [] as string[],
  maps_url: '',
  tag: '',
}

export function SubmitListing({ go, tone }: { go: (v: string) => void; tone: string }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  // image uploader state
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function set(f: string, v: unknown) {
    setForm(p => ({ ...p, [f]: v }))
  }

  function toggleFeature(f: string) {
    set('features', form.features.includes(f)
      ? form.features.filter(x => x !== f)
      : [...form.features, f],
    )
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

  async function handleSubmit(e: React.FormEvent) {
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
      await submitListing({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        type: form.type,
        transaction: form.transaction,
        price: parseFloat(form.price),
        location: form.location,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
        area_sqft: form.area_sqft ? parseInt(form.area_sqft) : undefined,
        lot_size_sqft: form.lot_size_sqft ? parseInt(form.lot_size_sqft) : undefined,
        construction_status: form.construction_status || undefined,
        year_built: form.year_built ? parseInt(form.year_built) : undefined,
        roi: form.roi ? parseFloat(form.roi) : undefined,
        seller_financing: form.seller_financing,
        hoa: form.hoa,
        hoa_fee: form.hoa && form.hoa_fee ? parseFloat(form.hoa_fee) : undefined,
        tax_exempt: form.tax_exempt,
        gated_community: form.gated_community,
        features: form.features.length ? form.features : undefined,
        maps_url: form.maps_url.trim() || undefined,
        tag: form.tag || undefined,
        images: orderedImages.length ? orderedImages : undefined,
      })
      toast.success('Listing submitted! Pending admin review.')
      setForm(EMPTY_FORM)
      setUploadedUrls([])
      setThumbnail(null)
      go('listings')
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
        onClick={() => go('listings')}
        className="flex items-center gap-1.5 text-dim text-[13px] mb-6 bg-transparent border-0 cursor-pointer hover:text-ink transition-colors"
      >
        <ArrowLeft size={14} /> Back to Listings
      </button>

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
                        background: form.transaction === p ? tone : 'white',
                        color: form.transaction === p ? 'white' : '#64748b',
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
              { key: 'bedrooms',     label: 'Bedrooms',        ph: '3'    },
              { key: 'bathrooms',    label: 'Bathrooms',       ph: '2'    },
              { key: 'area_sqft',    label: 'Living Area (ft²)', ph: '2400' },
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
              <Toggle value={form.tax_exempt} onChange={v => set('tax_exempt', v)} label="CONFOTUR Tax Exempt" tone={tone} />
              <Toggle value={form.hoa} onChange={v => { set('hoa', v); if (!v) set('hoa_fee', '') }} label="HOA Community" tone={tone} />
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
                        background: active ? `${tone}0d` : 'white',
                        color: active ? tone : '#64748b',
                        fontWeight: active ? 600 : 400,
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

              {/* Drop zone / trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex flex-col items-center gap-2 py-7 rounded-xl border-2 border-dashed cursor-pointer transition-colors disabled:opacity-50"
                style={{ borderColor: tone + '55', background: tone + '06' }}
              >
                <ImagePlus size={22} style={{ color: tone }} />
                <span className="text-[13px] font-semibold" style={{ color: tone }}>
                  {uploading ? 'Uploading…' : 'Click to upload photos'}
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

              {/* Preview grid */}
              {uploadedUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {uploadedUrls.map(url => {
                    const isThumb = thumbnail === url
                    return (
                      <div key={url} className="relative group rounded-xl overflow-hidden border-2 transition-all"
                        style={{ borderColor: isThumb ? tone : 'transparent' }}>
                        <img src={url} alt="" className="w-full h-24 object-cover" />

                        {/* Thumbnail badge */}
                        <button
                          type="button"
                          onClick={() => setThumbnail(url)}
                          title="Set as thumbnail"
                          className="absolute top-1.5 left-1.5 rounded-full p-1 transition-colors"
                          style={{ background: isThumb ? tone : 'rgba(0,0,0,0.45)' }}
                        >
                          <Star size={11} fill={isThumb ? 'white' : 'none'} color="white" />
                        </button>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          title="Remove photo"
                          className="absolute top-1.5 right-1.5 rounded-full p-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={11} color="white" />
                        </button>

                        {isThumb && (
                          <div className="absolute bottom-0 inset-x-0 text-center text-[10px] font-bold text-white py-0.5"
                            style={{ background: tone + 'cc' }}>
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
                  background: form.tag === t ? tone : 'white',
                  color: form.tag === t ? 'white' : '#64748b',
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
            onClick={() => go('listings')}
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
            {submitting ? 'Submitting…' : 'Submit Listing for Review'}
          </button>
        </div>

      </form>
    </div>
  )
}
