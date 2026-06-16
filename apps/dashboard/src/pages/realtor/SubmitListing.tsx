import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, ImagePlus, X, Star, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitListing, updateListing, uploadListingImages, type Listing } from '../../api/listings'
import { RichTextEditor } from '../../components/RichTextEditor'

const REGIONS = [
  'Cap Cana', 'Cabarete', 'Jarabacoa', 'Las Terrenas', 'Punta Cana',
  'Puerto Plata', 'Samaná', 'Santo Domingo', 'Santiago', 'Sosúa',
]
const TYPES    = ['villa', 'apartment', 'condo', 'land', 'commercial']
const FEATURES = [
  'Pool', 'Ocean View', 'Beachfront', 'Oceanfront', 'Furnished', 'Beach Access', 'Mountain View',
  'Parking', 'Gym', 'Smart Home', 'Backup Generator', 'Solar Panels',
]
const ALL_TAGS = ['Luxury', 'New', 'Investment', 'Commercial', 'Pet Friendly', 'Short Term', 'Long Term', 'Furnished', 'Ocean View', 'Mountain View']
const INCLUDED_UTILITIES = ['Water', 'Electricity', 'Gas', 'WiFi', 'Cable TV', 'Trash Removal', 'Pool Maintenance', 'Gardening', 'Security', 'Parking', 'Laundry']
const DEPOSIT_OPTIONS = [
  { value: 'first', label: 'First month' },
  { value: 'last', label: 'Last month' },
  { value: 'first_last', label: 'First + Last' },
  { value: 'none', label: 'None' },
]

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

function parseLatLng(url: string): { lat: string; lng: string } | null {
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (atMatch) return { lat: atMatch[1], lng: atMatch[2] }
  const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (qMatch) return { lat: qMatch[1], lng: qMatch[2] }
  return null
}

function PhotoSection({
  tone, uploadedUrls, thumbnail, uploading, fileInputRef,
  onFileChange, onRemove, onSetThumbnail, label = 'Click to upload photos',
}: {
  tone: string
  uploadedUrls: string[]
  thumbnail: string | null
  uploading: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: (url: string) => void
  onSetThumbnail: (url: string) => void
  label?: string
}) {
  return (
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
          {uploading ? 'Uploading…' : label}
        </span>
        <span className="text-[11.5px] text-dim">JPEG, JPG, PNG, WebP · max 25 MB each · up to 25 photos</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
        multiple
        className="hidden"
        onChange={onFileChange}
      />
      {uploadedUrls.length > 0 && (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
          {uploadedUrls.map(url => {
            const isThumb = thumbnail === url
            return (
              <div key={url} className="relative group rounded-xl overflow-hidden border-2 transition-all"
                style={{ borderColor: isThumb ? tone : 'transparent' }}>
                <img src={url} alt="" className="w-full h-24 object-cover" />
                <button
                  type="button"
                  onClick={() => onSetThumbnail(url)}
                  title="Set as thumbnail"
                  className="absolute top-1.5 left-1.5 rounded-full p-1 transition-colors"
                  style={{ background: isThumb ? tone : 'rgba(0,0,0,0.45)' }}
                >
                  <Star size={11} fill={isThumb ? 'white' : 'none'} color="white" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(url)}
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
  )
}

// ── Shared form sections ──────────────────────────────────────────────────────

function FormSections({
  form, set, toggleFeature, tone, uploadedUrls, thumbnail, uploading,
  fileInputRef, handleFileChange, removeImage, setThumbnail, photoLabel,
  priceCurrency, setPriceCurrency, dopRate,
}: {
  form: Record<string, unknown>
  set: (f: string, v: unknown) => void
  toggleFeature: (f: string) => void
  tone: string
  uploadedUrls: string[]
  thumbnail: string | null
  uploading: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (url: string) => void
  setThumbnail: (url: string) => void
  photoLabel?: string
  priceCurrency: 'USD' | 'DOP'
  setPriceCurrency: (c: 'USD' | 'DOP') => void
  dopRate: number
}) {
  const features           = form.features as string[]
  const tags               = form.tags as string[]
  const videoLinks         = form.video_links as string[]
  const includedUtilities  = form.included_utilities as string[]
  const construction_status = form.construction_status as string
  const hoa                = form.hoa as boolean
  const association        = form.association as boolean
  const isRent             = form.transaction === 'rent'

  const [customInput, setCustomInput] = useState('')
  const [customUtilityInput, setCustomUtilityInput] = useState('')
  const customFeatures = features.filter(f => !FEATURES.includes(f))
  const customUtilities = includedUtilities.filter(u => !INCLUDED_UTILITIES.includes(u))

  function handleCurrencyToggle(newCurrency: 'USD' | 'DOP') {
    const raw = parseFloat((form.price as string) || '0') || 0
    if (newCurrency === 'DOP' && priceCurrency === 'USD') {
      set('price', Math.round(raw * dopRate).toString())
    } else if (newCurrency === 'USD' && priceCurrency === 'DOP') {
      set('price', Math.round(raw / dopRate).toString())
    }
    setPriceCurrency(newCurrency)
  }

  function addCustomFeature() {
    const val = customInput.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    if (val && !features.includes(val)) set('features', [...features, val])
    setCustomInput('')
  }

  function toggleTag(t: string) {
    set('tags', tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t])
  }

  function toggleIncluded(u: string) {
    set('included_utilities', includedUtilities.includes(u)
      ? includedUtilities.filter(x => x !== u)
      : [...includedUtilities, u],
    )
  }

  function addCustomUtility() {
    const toTitle = (s: string) => s.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    const entries = customUtilityInput.split(',').map(toTitle).filter(s => s && !INCLUDED_UTILITIES.includes(s) && !includedUtilities.includes(s))
    if (!entries.length) return
    set('included_utilities', [...includedUtilities, ...entries])
    setCustomUtilityInput('')
  }

  function removeCustomUtility(u: string) {
    set('included_utilities', includedUtilities.filter(x => x !== u))
  }

  function addVideoLink() {
    set('video_links', [...videoLinks, ''])
  }

  function updateVideoLink(i: number, val: string) {
    const arr = [...videoLinks]
    arr[i] = val
    set('video_links', arr)
  }

  function removeVideoLink(i: number) {
    set('video_links', videoLinks.filter((_, j) => j !== i))
  }

  // dynamic section counter so numbers stay sequential regardless of conditional sections
  let sn = 0
  const n = () => ++sn

  return (
    <>
      {/* 1 — Basic Info */}
      <Sec n={n()} title="Basic Info" tone={tone}>
        <div className="space-y-4">
          <div>
            <Lbl>Property Title *</Lbl>
            <input
              className={inp}
              value={form.title as string}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Oceanfront Villa with Infinity Pool"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Lbl>Property Type</Lbl>
              <select className={inp + ' cursor-pointer'} value={form.type as string} onChange={e => set('type', e.target.value)}>
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
              <div className="flex items-center h-7 mb-1.5">
                <div className="text-[11.5px] font-semibold text-dim uppercase tracking-wide">Region *</div>
              </div>
              <select
                className={inp + ' cursor-pointer'}
                value={form.location as string}
                onChange={e => set('location', e.target.value)}
                required
              >
                <option value="">Select region…</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[11.5px] font-semibold text-dim uppercase tracking-wide">Price *</div>
                <div className="flex rounded-lg border border-line overflow-hidden text-[11px] font-bold">
                  {(['USD', 'DOP'] as const).map(c => (
                    <button key={c} type="button" onClick={() => handleCurrencyToggle(c)}
                      className="px-2.5 py-1 transition-colors cursor-pointer"
                      style={{ background: priceCurrency === c ? tone : 'white', color: priceCurrency === c ? 'white' : '#64748b' }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <input
                className={inp}
                type="text"
                inputMode="numeric"
                value={(form.price as string) ? Number(form.price as string).toLocaleString('en-US') : ''}
                onChange={e => set('price', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder={priceCurrency === 'USD' ? 'e.g. 850,000' : 'e.g. 50,150,000'}
                required
              />
              {(form.price as string) ? (
                <p className="text-[11.5px] text-dim mt-1">
                  {priceCurrency === 'USD'
                    ? `≈ RD$${Math.round(parseFloat(form.price as string) * dopRate).toLocaleString('en-US')} DOP`
                    : `≈ $${Math.round(parseFloat(form.price as string) / dopRate).toLocaleString('en-US')} USD · rate: ${dopRate.toFixed(1)} DOP/USD`}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <Lbl>Description</Lbl>
            <RichTextEditor
              value={form.description as string}
              onChange={v => set('description', v)}
              tone={tone}
            />
          </div>
        </div>
      </Sec>

      {/* 2 — Property Details */}
      <Sec n={n()} title="Property Details" tone={tone}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: 'bedrooms',      label: 'Bedrooms',          ph: '3',    step: '1'   },
            { key: 'bathrooms',     label: 'Bathrooms',         ph: '1.5',  step: '0.5' },
            { key: 'area_sqft',     label: 'Living Area (ft²)', ph: '2400', step: '1'   },
            { key: 'lot_size_sqft', label: 'Lot Size (ft²)',    ph: '5000', step: '1'   },
          ].map(({ key, label, ph, step }) => (
            <div key={key}>
              <Lbl>{label}</Lbl>
              <input
                className={inp}
                type="number"
                step={step}
                value={form[key] as string}
                onChange={e => set(key, e.target.value)}
                placeholder={ph}
                min="0"
              />
            </div>
          ))}
        </div>
      </Sec>

      {/* 3 — Construction */}
      <Sec n={n()} title="Construction" tone={tone}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Lbl>Construction Status</Lbl>
            <select
              className={inp + ' cursor-pointer'}
              value={construction_status}
              onChange={e => set('construction_status', e.target.value)}
            >
              <option value="">Not specified</option>
              <option value="pre_construction">Pre-construction</option>
              <option value="under_construction">Under construction</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {construction_status === 'completed' && (
            <div>
              <Lbl>Year Built</Lbl>
              <input
                className={inp}
                type="number"
                value={form.year_built as string}
                onChange={e => set('year_built', e.target.value)}
                placeholder="e.g. 2019"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          )}
        </div>
      </Sec>

      {/* 4 — Financials (dynamic: sale vs rent) */}
      <Sec n={n()} title="Financials" tone={tone}>
        {isRent ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Toggle
                value={association}
                onChange={v => { set('association', v); if (!v) set('association_fee', '') }}
                label="Association Fee"
                tone={tone}
              />
              {association && (
                <div>
                  <Lbl>Monthly Association Fee (USD)</Lbl>
                  <input
                    className={inp}
                    type="number"
                    value={form.association_fee as string}
                    onChange={e => set('association_fee', e.target.value)}
                    placeholder="e.g. 200"
                    min="0"
                  />
                </div>
              )}
            </div>
            <div>
              <Lbl>Security Deposit</Lbl>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                {DEPOSIT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set('deposit_policy', form.deposit_policy === opt.value ? '' : opt.value)}
                    className="py-2.5 rounded-lg text-[13px] font-semibold border cursor-pointer transition-all"
                    style={{
                      background:  form.deposit_policy === opt.value ? tone : 'white',
                      color:       form.deposit_policy === opt.value ? 'white' : '#64748b',
                      borderColor: form.deposit_policy === opt.value ? tone : '#e2e8f0',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Lbl>Est. Annual ROI (%)</Lbl>
                <input
                  className={inp}
                  type="number"
                  step="0.1"
                  value={form.roi as string}
                  onChange={e => set('roi', e.target.value)}
                  placeholder="e.g. 8.5"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Toggle value={form.seller_financing as boolean} onChange={v => set('seller_financing', v)} label="Seller Financing Available" tone={tone} />
              <Toggle value={form.tax_exempt as boolean}       onChange={v => set('tax_exempt', v)}       label="CONFOTUR Tax Exempt"        tone={tone} />
              <Toggle value={hoa} onChange={v => { set('hoa', v); if (!v) set('hoa_fee', '') }} label="HOA Community" tone={tone} />
              {hoa && (
                <div>
                  <Lbl>Monthly HOA Fee (USD)</Lbl>
                  <input
                    className={inp}
                    type="number"
                    value={form.hoa_fee as string}
                    onChange={e => set('hoa_fee', e.target.value)}
                    placeholder="e.g. 350"
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Sec>

      {/* 5 — Community & Features */}
      <Sec n={n()} title="Community & Features" tone={tone}>
        <div className="space-y-4">
          <Toggle value={form.gated_community as boolean} onChange={v => set('gated_community', v)} label="Gated Community" tone={tone} />
          <div>
            <Lbl>Property Features</Lbl>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
              {FEATURES.map(f => {
                const active = features.includes(f)
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
            {customFeatures.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {customFeatures.map(f => (
                  <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border"
                    style={{ borderColor: tone, background: `${tone}0d`, color: tone }}>
                    {f}
                    <button type="button" onClick={() => toggleFeature(f)}
                      className="ml-0.5 rounded-full w-3.5 h-3.5 grid place-items-center text-[10px] cursor-pointer border-0"
                      style={{ background: tone, color: 'white' }}>×</button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <input
                className={inp + ' flex-1'}
                type="text"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomFeature() } }}
                placeholder="Add custom feature…"
                maxLength={50}
              />
              <button
                type="button"
                onClick={addCustomFeature}
                disabled={!customInput.trim()}
                className="px-4 py-2.5 rounded-lg text-[13px] font-semibold border-0 cursor-pointer disabled:opacity-40 transition-opacity"
                style={{ background: tone, color: 'white' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </Sec>

      {/* 6 — What is Included (rent only) */}
      {isRent && (
        <Sec n={n()} title="What is Included" tone={tone}>
          <p className="text-[12.5px] text-dim mb-3">Select everything included in the monthly rent.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INCLUDED_UTILITIES.map(u => {
              const active = includedUtilities.includes(u)
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => toggleIncluded(u)}
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
                  {u}
                </button>
              )
            })}
          </div>
          {customUtilities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {customUtilities.map(u => (
                <span key={u} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border"
                  style={{ borderColor: tone, background: `${tone}0d`, color: tone }}>
                  {u}
                  <button type="button" onClick={() => removeCustomUtility(u)}
                    className="ml-0.5 rounded-full w-3.5 h-3.5 grid place-items-center text-[10px] cursor-pointer border-0"
                    style={{ background: tone, color: 'white' }}>×</button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <input className={inp + ' flex-1'} type="text" value={customUtilityInput}
              onChange={e => setCustomUtilityInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomUtility() } }}
              placeholder="e.g. Hot Water, Air Conditioning" />
            <button type="button" onClick={addCustomUtility} disabled={!customUtilityInput.trim()}
              className="px-4 py-2.5 rounded-lg text-[13px] font-semibold border-0 cursor-pointer disabled:opacity-40 transition-opacity"
              style={{ background: tone, color: 'white' }}>Add</button>
          </div>
        </Sec>
      )}

      {/* 7 — Media & Location */}
      <Sec n={n()} title="Media & Location" tone={tone}>
        <div className="space-y-4">
          <PhotoSection
            tone={tone} uploadedUrls={uploadedUrls} thumbnail={thumbnail} uploading={uploading}
            fileInputRef={fileInputRef} onFileChange={handleFileChange}
            onRemove={removeImage} onSetThumbnail={setThumbnail}
            label={photoLabel}
          />

          {/* Video links */}
          <div>
            <Lbl>Video Links</Lbl>
            <div className="space-y-2">
              {videoLinks.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inp + ' flex-1'}
                    type="url"
                    value={url}
                    onChange={e => updateVideoLink(i, e.target.value)}
                    placeholder="https://youtube.com/watch?v=…"
                  />
                  <button
                    type="button"
                    onClick={() => removeVideoLink(i)}
                    className="px-3 py-2.5 rounded-lg border border-line bg-white text-dim cursor-pointer hover:text-red-500 hover:border-red-300 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addVideoLink}
              className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold cursor-pointer border-0 bg-transparent transition-opacity hover:opacity-70"
              style={{ color: tone }}
            >
              <Plus size={14} /> Add video link
            </button>
          </div>

          {/* 3D Tour */}
          <div>
            <Lbl>3D Tour Link</Lbl>
            <input
              className={inp}
              type="url"
              value={form.tour_3d_url as string}
              onChange={e => set('tour_3d_url', e.target.value)}
              placeholder="https://my.matterport.com/show/…"
            />
          </div>

          <div>
            <Lbl>Google Maps URL</Lbl>
            <input
              className={inp}
              type="url"
              value={form.maps_url as string}
              onChange={e => {
                const url = e.target.value
                set('maps_url', url)
                const coords = parseLatLng(url)
                if (coords) {
                  set('latitude', coords.lat)
                  set('longitude', coords.lng)
                }
              }}
              placeholder="https://maps.google.com/…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Lbl>Latitude</Lbl>
              <input
                className={inp}
                type="number"
                step="any"
                value={form.latitude as string}
                onChange={e => set('latitude', e.target.value)}
                placeholder="e.g. 18.5816"
              />
            </div>
            <div>
              <Lbl>Longitude</Lbl>
              <input
                className={inp}
                type="number"
                step="any"
                value={form.longitude as string}
                onChange={e => set('longitude', e.target.value)}
                placeholder="e.g. -68.4068"
              />
            </div>
          </div>
          <p className="text-[11.5px] text-dim -mt-1">
            Coordinates are auto-filled when you paste a full Google Maps link. You can also enter them manually.
          </p>
        </div>
      </Sec>

      {/* 8 — Utilities */}
      <Sec n={n()} title="Utilities" tone={tone}>
        <Lbl>Utility Notes</Lbl>
        <RichTextEditor value={form.utilities as string} onChange={v => set('utilities', v)} tone={tone} />
        <p className="text-[11.5px] text-dim mt-1">
          Describe utility availability, backup systems, or anything relevant to the property's services.
        </p>
      </Sec>

      {/* 9 — Listing Tags */}
      <Sec n={n()} title="Listing Tags" tone={tone}>
        <Lbl>Tags (select all that apply)</Lbl>
        <div className="flex flex-wrap gap-2 mt-1">
          {ALL_TAGS.map(t => {
            const active = tags.includes(t)
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className="px-4 py-2 rounded-full border text-[13px] font-semibold cursor-pointer transition-all"
                style={{
                  borderColor: active ? tone : '#e2e8f0',
                  background:  active ? tone : 'white',
                  color:       active ? 'white' : '#64748b',
                }}
              >
                {t}
              </button>
            )
          })}
        </div>
      </Sec>
    </>
  )
}

// ── Create listing ────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: '', type: 'villa', transaction: 'sale', location: '', price: '',
  description: '', bedrooms: '', bathrooms: '', area_sqft: '', lot_size_sqft: '',
  construction_status: '', year_built: '', roi: '',
  seller_financing: false, hoa: false, hoa_fee: '', tax_exempt: false, gated_community: false,
  features: [] as string[], maps_url: '', latitude: '', longitude: '',
  tags: [] as string[],
  video_links: [] as string[],
  tour_3d_url: '',
  utilities: '',
  included_utilities: [] as string[],
  association: false,
  association_fee: '',
  deposit_policy: '',
}

export function SubmitListing({ go, tone }: { go: (v: string) => void; tone: string }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [thumbnail,    setThumbnail]    = useState<string | null>(null)
  const [uploading,    setUploading]    = useState(false)
  const [priceCurrency, setPriceCurrency] = useState<'USD' | 'DOP'>('USD')
  const [dopRate, setDopRate] = useState(59.5)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => { if (d.rates?.DOP) setDopRate(d.rates.DOP) })
      .catch(() => {})
  }, [])

  function set(f: string, v: unknown) { setForm(p => ({ ...p, [f]: v })) }

  function toggleFeature(f: string) {
    set('features', form.features.includes(f)
      ? form.features.filter(x => x !== f)
      : [...form.features, f],
    )
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    if (uploadedUrls.length + files.length > 25) {
      toast.error('Maximum 25 photos allowed.')
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
      toast.error('Upload failed. Check file types (JPEG, PNG, WebP) and sizes (max 25 MB).')
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

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
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
      const priceUSD = priceCurrency === 'DOP'
        ? Math.round(parseFloat(form.price) / dopRate)
        : parseFloat(form.price)
      const isRent = form.transaction === 'rent'
      await submitListing({
        title:               form.title.trim(),
        description:         form.description || undefined,
        type:                form.type,
        transaction:         form.transaction,
        price:               priceUSD,
        location:            form.location,
        bedrooms:            form.bedrooms      ? parseInt(form.bedrooms)        : undefined,
        bathrooms:           form.bathrooms     ? parseFloat(form.bathrooms)     : undefined,
        area_sqft:           form.area_sqft     ? parseInt(form.area_sqft)       : undefined,
        lot_size_sqft:       form.lot_size_sqft ? parseInt(form.lot_size_sqft)   : undefined,
        construction_status: form.construction_status || undefined,
        year_built:          form.year_built    ? parseInt(form.year_built)      : undefined,
        ...(isRent ? {
          association_fee:   form.association && form.association_fee ? parseFloat(form.association_fee) : undefined,
          deposit_policy:    form.deposit_policy || undefined,
          included_utilities: form.included_utilities.length ? form.included_utilities : undefined,
        } : {
          roi:               form.roi           ? parseFloat(form.roi)           : undefined,
          seller_financing:  form.seller_financing,
          hoa:               form.hoa,
          hoa_fee:           form.hoa && form.hoa_fee ? parseFloat(form.hoa_fee) : undefined,
          tax_exempt:        form.tax_exempt,
        }),
        gated_community:     form.gated_community,
        features:            form.features.length ? form.features : undefined,
        tags:                form.tags.length ? form.tags : undefined,
        video_links:         form.video_links.filter(v => v.trim()).length ? form.video_links.filter(v => v.trim()) : undefined,
        tour_3d_url:         form.tour_3d_url.trim() || undefined,
        utilities:           form.utilities.trim() || undefined,
        maps_url:            form.maps_url.trim() || undefined,
        latitude:            form.latitude  ? parseFloat(form.latitude)          : undefined,
        longitude:           form.longitude ? parseFloat(form.longitude)         : undefined,
        images:              orderedImages.length ? orderedImages : undefined,
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
        <FormSections
          form={form} set={set} toggleFeature={toggleFeature} tone={tone}
          uploadedUrls={uploadedUrls} thumbnail={thumbnail} uploading={uploading}
          fileInputRef={fileInputRef} handleFileChange={handleFileChange}
          removeImage={removeImage} setThumbnail={setThumbnail}
          priceCurrency={priceCurrency} setPriceCurrency={setPriceCurrency} dopRate={dopRate}
        />

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

// ── Edit listing ──────────────────────────────────────────────────────────────

export function EditListing({ listing, tone, onBack, onSaved }: {
  listing: Listing
  tone: string
  onBack: () => void
  onSaved: (updated: Listing) => void
}) {
  const [form, setFormState] = useState({
    title:               listing.title,
    type:                listing.type,
    transaction:         listing.transaction,
    location:            listing.location,
    price:               String(listing.price),
    description:         listing.description ?? '',
    bedrooms:            listing.bedrooms      != null ? String(listing.bedrooms)      : '',
    bathrooms:           listing.bathrooms     != null ? String(listing.bathrooms)     : '',
    area_sqft:           listing.area_sqft     != null ? String(listing.area_sqft)     : '',
    lot_size_sqft:       listing.lot_size_sqft != null ? String(listing.lot_size_sqft) : '',
    construction_status: listing.construction_status ?? '',
    year_built:          listing.year_built    != null ? String(listing.year_built)    : '',
    roi:                 listing.roi           != null ? String(listing.roi)           : '',
    seller_financing:    listing.seller_financing,
    hoa:                 listing.hoa,
    hoa_fee:             listing.hoa_fee       != null ? String(listing.hoa_fee)       : '',
    tax_exempt:          listing.tax_exempt,
    gated_community:     listing.gated_community,
    features:            listing.features ?? [],
    maps_url:            listing.maps_url ?? '',
    latitude:            listing.latitude  != null ? String(listing.latitude)  : '',
    longitude:           listing.longitude != null ? String(listing.longitude) : '',
    tags:                listing.tags ?? [],
    video_links:         listing.video_links ?? [],
    tour_3d_url:         listing.tour_3d_url ?? '',
    utilities:           listing.utilities ?? '',
    included_utilities:  listing.included_utilities ?? [],
    association:         listing.association_fee != null && listing.association_fee > 0,
    association_fee:     listing.association_fee != null ? String(listing.association_fee) : '',
    deposit_policy:      listing.deposit_policy ?? '',
  })

  const [uploadedUrls, setUploadedUrls] = useState<string[]>(listing.images ?? [])
  const [thumbnail,    setThumbnail]    = useState<string | null>(listing.images?.[0] ?? null)
  const [uploading,    setUploading]    = useState(false)
  const [submitting,   setSubmitting]   = useState(false)
  const [priceCurrency, setPriceCurrency] = useState<'USD' | 'DOP'>('USD')
  const [dopRate, setDopRate] = useState(59.5)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => { if (d.rates?.DOP) setDopRate(d.rates.DOP) })
      .catch(() => {})
  }, [])

  function set(f: string, v: unknown) { setFormState(p => ({ ...p, [f]: v })) }

  function toggleFeature(f: string) {
    set('features', form.features.includes(f)
      ? form.features.filter(x => x !== f)
      : [...form.features, f],
    )
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    if (uploadedUrls.length + files.length > 25) {
      toast.error('Maximum 25 photos allowed.')
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
      toast.error('Upload failed. Check file types (JPEG, PNG, WebP) and sizes (max 25 MB).')
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

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
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
      const priceUSD = priceCurrency === 'DOP'
        ? Math.round(parseFloat(form.price) / dopRate)
        : parseFloat(form.price)
      const isRent = form.transaction === 'rent'
      const updated = await updateListing(listing.id, {
        title:               form.title.trim(),
        description:         form.description || undefined,
        type:                form.type,
        transaction:         form.transaction,
        price:               priceUSD,
        location:            form.location,
        bedrooms:            form.bedrooms      ? parseInt(form.bedrooms)        : undefined,
        bathrooms:           form.bathrooms     ? parseFloat(form.bathrooms)     : undefined,
        area_sqft:           form.area_sqft     ? parseInt(form.area_sqft)       : undefined,
        lot_size_sqft:       form.lot_size_sqft ? parseInt(form.lot_size_sqft)   : undefined,
        construction_status: form.construction_status || undefined,
        year_built:          form.year_built    ? parseInt(form.year_built)      : undefined,
        ...(isRent ? {
          association_fee:   form.association && form.association_fee ? parseFloat(form.association_fee) : undefined,
          deposit_policy:    form.deposit_policy || undefined,
          included_utilities: form.included_utilities,
        } : {
          roi:               form.roi           ? parseFloat(form.roi)           : undefined,
          seller_financing:  form.seller_financing,
          hoa:               form.hoa,
          hoa_fee:           form.hoa && form.hoa_fee ? parseFloat(form.hoa_fee) : undefined,
          tax_exempt:        form.tax_exempt,
        }),
        gated_community:     form.gated_community,
        features:            form.features,
        tags:                form.tags,
        video_links:         form.video_links.filter(v => v.trim()),
        tour_3d_url:         form.tour_3d_url.trim() || undefined,
        utilities:           form.utilities.trim() || undefined,
        maps_url:            form.maps_url.trim() || undefined,
        latitude:            form.latitude  ? parseFloat(form.latitude)          : undefined,
        longitude:           form.longitude ? parseFloat(form.longitude)         : undefined,
        images:              orderedImages,
      })
      const msg = listing.status === 'rejected'
        ? 'Listing resubmitted for review!'
        : listing.status === 'active'
          ? 'Changes submitted for review. Your listing stays live until approved.'
          : 'Changes saved!'
      toast.success(msg)
      onSaved(updated)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const isActive = listing.status === 'active'

  return (
    <div className="max-w-3xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-dim text-[13px] mb-4 bg-transparent border-0 cursor-pointer hover:text-ink transition-colors"
      >
        <ArrowLeft size={14} /> Back to Listing
      </button>

      <h2 className="text-[20px] font-bold text-ink mb-4">Edit Listing</h2>

      {isActive && (
        <div className="mb-5 flex items-start gap-3 px-4 py-3.5 rounded-xl border text-[13px]"
          style={{ background: `${tone}0a`, borderColor: `${tone}40`, color: tone }}>
          <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="7.5" r="7" stroke="currentColor" strokeWidth="1.3" />
            <path d="M7.5 5v3.5M7.5 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>
            This listing is <strong>live</strong>. Your changes will be reviewed by an admin before going live — the current version stays visible on search until approved.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormSections
          form={form} set={set} toggleFeature={toggleFeature} tone={tone}
          uploadedUrls={uploadedUrls} thumbnail={thumbnail} uploading={uploading}
          fileInputRef={fileInputRef} handleFileChange={handleFileChange}
          removeImage={removeImage} setThumbnail={setThumbnail}
          photoLabel="Click to add more photos"
          priceCurrency={priceCurrency} setPriceCurrency={setPriceCurrency} dopRate={dopRate}
        />

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
            {submitting
              ? 'Submitting…'
              : isActive
                ? 'Submit Changes for Review'
                : listing.status === 'rejected'
                  ? 'Save & Resubmit for Review'
                  : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
