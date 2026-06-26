import { useEffect, useState } from 'react'
import { Key, Building2, Clock, CheckCircle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { PhoneInput } from 'react-international-phone'
import { isPossiblePhoneNumber } from 'libphonenumber-js'
import 'react-international-phone/style.css'
import { submitUpgradeRequest, getMyUpgradeRequests, type RealtorQuestionnaire } from '../../api/upgradeRequests'
import type { UpgradeRequest } from '../../api/upgradeRequests'
import { submitLead, getMyLeads } from '../../api/leads'
import { getMe } from '../../api/auth'

// ── Owner lead form ────────────────────────────────────────────────────────────

export function OwnerLeadModal({ onClose, onDone }: { onClose: () => void; onDone?: () => void }) {
  const { t } = useTranslation('buyer')
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <>
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl shadow-2xl w-full max-w-md p-7 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#fff9ed' }}>
              <CheckCircle size={26} style={{ color: '#f0a800' }} />
            </div>
            <div>
              <div className="font-sans text-[19px] font-bold text-ink mb-1">{t('upgrade_page.request_received')}</div>
              <p className="text-[13.5px] text-dim leading-[1.6]">
                {t('upgrade_page.request_received_sub')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-line text-[13px] font-semibold text-ink2 cursor-pointer hover:bg-line-soft bg-transparent"
            >
              {t('upgrade_page.close')}
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-paper rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-line">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fff9ed' }}>
                <Key size={17} style={{ color: '#f0a800' }} />
              </div>
              <div>
                <div className="font-sans text-[16px] font-bold text-ink">{t('upgrade_page.owner_modal_title')}</div>
                <div className="text-[11.5px] text-dim">{t('upgrade_page.owner_modal_sub')}</div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-line-soft cursor-pointer border-0 bg-transparent">
              <X size={15} className="text-dim" />
            </button>
          </div>
          <div className="px-6 py-5">
            <OwnerLeadForm onBack={onClose} onDone={() => { onDone?.(); setDone(true) }} />
          </div>
        </div>
      </div>
    </>
  )
}

function OwnerLeadForm({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const { t } = useTranslation('buyer')
  const [me, setMe] = useState<{ display_name: string; email: string; phone?: string } | null>(null)
  const [form, setForm] = useState({ name: '', email: '', location: '', message: '' })
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getMe().then(data => {
      setMe(data)
      setForm(f => ({ ...f, name: data.display_name || '', email: data.email || '' }))
      if (data.phone) setPhone(data.phone)
    }).catch(() => {})
  }, [])

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    setSubmitting(true)
    try {
      const phoneValue = phone && isPossiblePhoneNumber(phone) ? phone : undefined
      await submitLead({
        type: 'seller_interest',
        name: form.name.trim(),
        email: form.email.trim(),
        phone: phoneValue,
        message: [
          form.location ? `Property location: ${form.location.trim()}` : '',
          form.message.trim(),
        ].filter(Boolean).join('\n\n') || undefined,
      })
      onDone()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!me) return null

  return (
    <div>
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide text-dim block mb-1">{t('upgrade_page.form_name')}</label>
            <input
              value={form.name}
              onChange={set('name')}
              required
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-white text-[13px] text-ink outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide text-dim block mb-1">{t('upgrade_page.form_email')}</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              required
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-white text-[13px] text-ink outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide text-dim block mb-1">{t('upgrade_page.form_phone')} <span className="normal-case font-normal text-dim">{t('upgrade_page.form_phone_optional')}</span></label>
            <PhoneInput
              defaultCountry="do"
              value={phone}
              onChange={setPhone}
              inputClassName="!w-full !px-3 !py-2.5 !rounded-r-xl !border-line !bg-white !text-[13px] !text-ink !outline-none focus:!border-gold !h-auto"
              countrySelectorStyleProps={{
                buttonClassName: '!border-line !bg-white !rounded-l-xl !h-auto !px-2.5 !py-2.5',
              }}
              style={{ '--react-international-phone-border-radius': '0.75rem' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide text-dim block mb-1">{t('upgrade_page.form_location')} <span className="normal-case font-normal text-dim">{t('upgrade_page.form_phone_optional')}</span></label>
            <input
              value={form.location}
              onChange={set('location')}
              placeholder={t('upgrade_page.form_location_ph')}
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-white text-[13px] text-ink outline-none focus:border-gold placeholder:text-dim"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide text-dim block mb-1">{t('upgrade_page.form_message')}</label>
            <textarea
              value={form.message}
              onChange={set('message')}
              rows={4}
              placeholder={t('upgrade_page.form_message_ph')}
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-white text-[13px] text-ink outline-none focus:border-gold resize-none placeholder:text-dim"
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !form.name.trim() || !form.email.trim()}
            className="w-full py-2.5 rounded-xl text-[13.5px] font-bold text-white border-0 cursor-pointer disabled:opacity-60"
            style={{ background: '#f0a800' }}
          >
            {submitting ? t('upgrade_page.sending') : t('upgrade_page.send_details')}
          </button>
        </form>
    </div>
  )
}

// ── Realtor questionnaire modal ────────────────────────────────────────────────

export function RealtorModal({ onClose, onDone }: { onClose: () => void; onDone: (req: UpgradeRequest) => void }) {
  const { t } = useTranslation('buyer')
  const [form, setForm] = useState<RealtorQuestionnaire & { years_experience_str: string }>({
    license_number: '',
    territory: '',
    years_experience: undefined,
    years_experience_str: '',
    specialties: '',
    bio: '',
  })
  const [submitting, setSubmitting] = useState(false)

  function set(k: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const yearsNum = parseInt(form.years_experience_str)
      const req = await submitUpgradeRequest('realtor', {
        license_number: form.license_number?.trim() || undefined,
        territory: form.territory?.trim() || undefined,
        years_experience: isNaN(yearsNum) ? undefined : yearsNum,
        specialties: form.specialties?.trim() || undefined,
        bio: form.bio?.trim() || undefined,
      })
      onDone(req)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      toast.error(msg ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-paper rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-line">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f0faf4' }}>
                <Building2 size={17} style={{ color: '#1f7a3d' }} />
              </div>
              <div>
                <div className="font-sans text-[16px] font-bold text-ink">{t('upgrade_page.realtor_modal_title')}</div>
                <div className="text-[11.5px] text-dim">{t('upgrade_page.realtor_modal_sub')}</div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-line-soft cursor-pointer border-0 bg-transparent">
              <X size={15} className="text-dim" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wide text-dim block mb-1">{t('upgrade_page.license_no')} <span className="normal-case font-normal">{t('upgrade_page.optional')}</span></label>
                <input
                  value={form.license_number}
                  onChange={set('license_number')}
                  placeholder="e.g. DR-2024-001"
                  className="w-full px-3 py-2.5 rounded-xl border border-line bg-white text-[13px] text-ink outline-none focus:border-brand placeholder:text-dim"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wide text-dim block mb-1">{t('upgrade_page.years_exp')}</label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={form.years_experience_str}
                  onChange={set('years_experience_str')}
                  placeholder="e.g. 5"
                  className="w-full px-3 py-2.5 rounded-xl border border-line bg-white text-[13px] text-ink outline-none focus:border-brand placeholder:text-dim"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-dim block mb-1">{t('upgrade_page.territory')} <span className="normal-case font-normal">{t('upgrade_page.optional')}</span></label>
              <input
                value={form.territory}
                onChange={set('territory')}
                placeholder="e.g. Punta Cana, Santo Domingo…"
                className="w-full px-3 py-2.5 rounded-xl border border-line bg-white text-[13px] text-ink outline-none focus:border-brand placeholder:text-dim"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-dim block mb-1">{t('upgrade_page.specialties')} <span className="normal-case font-normal">{t('upgrade_page.optional')}</span></label>
              <input
                value={form.specialties}
                onChange={set('specialties')}
                placeholder="e.g. Luxury villas, Vacation rentals, Commercial…"
                className="w-full px-3 py-2.5 rounded-xl border border-line bg-white text-[13px] text-ink outline-none focus:border-brand placeholder:text-dim"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-dim block mb-1">{t('upgrade_page.bio')} <span className="normal-case font-normal">{t('upgrade_page.optional')}</span></label>
              <textarea
                value={form.bio}
                onChange={set('bio')}
                rows={3}
                placeholder="Tell us about your background and experience…"
                className="w-full px-3 py-2.5 rounded-xl border border-line bg-white text-[13px] text-ink outline-none focus:border-brand resize-none placeholder:text-dim"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-line text-[13px] font-semibold text-ink2 cursor-pointer hover:bg-line-soft bg-transparent"
              >
                {t('upgrade_page.cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl border-0 text-[13.5px] font-bold text-white cursor-pointer disabled:opacity-60"
                style={{ background: '#1f7a3d' }}
              >
                {submitting ? t('upgrade_page.submitting') : t('upgrade_page.submit_application')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

// ── Main Upgrade page ──────────────────────────────────────────────────────────

export function Upgrade() {
  const { t } = useTranslation('buyer')
  const [pending, setPending]           = useState<UpgradeRequest | null>(null)
  const [loading, setLoading]           = useState(true)
  const [ownerFormOpen, setOwnerFormOpen] = useState(false)
  const [ownerDone, setOwnerDone]       = useState(false)
  const [ownerPending, setOwnerPending] = useState(false)
  const [realtorModalOpen, setRealtorModalOpen] = useState(false)

  useEffect(() => {
    Promise.all([getMyUpgradeRequests(), getMyLeads()])
      .then(([reqs, leads]) => {
        const existing = reqs.find(r => r.status === 'pending')
        if (existing) setPending(existing)
        if (leads.some(l => l.type === 'seller_interest' && !l.property_id)) {
          setOwnerPending(true)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null

  // Owner submitted lead
  if (ownerDone) {
    return (
      <div className="max-w-md">
        <div className="bg-paper border border-line rounded-2xl p-7 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#fff9ed' }}>
            <CheckCircle size={26} style={{ color: '#f0a800' }} />
          </div>
          <div>
            <div className="font-sans text-[19px] font-bold text-ink mb-1">{t('upgrade_page.request_received')}</div>
            <p className="text-[13.5px] text-dim leading-[1.6]">
              {t('upgrade_page.request_received_sub')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Realtor upgrade pending
  if (pending) {
    return (
      <div className="max-w-md">
        <div className="bg-paper border border-line rounded-2xl p-7 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#f0faf4' }}>
            <Clock size={26} style={{ color: '#1f7a3d' }} />
          </div>
          <div>
            <div className="font-sans text-[19px] font-bold text-ink mb-1">{t('upgrade_page.application_submitted')}</div>
            <p className="text-[13.5px] text-dim leading-[1.6]">
              {t('upgrade_page.realtor_pending_sub')}
            </p>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold"
            style={{ background: '#f0faf4', color: '#1f7a3d' }}
          >
            <CheckCircle size={13} />
            {t('upgrade_page.pending_review_badge')}
          </div>
        </div>
      </div>
    )
  }

  if (ownerFormOpen) {
    return <OwnerLeadForm onBack={() => setOwnerFormOpen(false)} onDone={() => { setOwnerPending(true); setOwnerDone(true) }} />
  }

  return (
    <>
      <p className="text-[14px] text-dim mb-6 max-w-lg leading-[1.6]">
        {t('upgrade_page.intro')}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl">
        {/* Owner card */}
        <div className="bg-paper border border-line rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fff9ed' }}>
              <Key size={20} style={{ color: '#f0a800' }} />
            </div>
            <div className="font-sans text-[17px] font-bold text-ink">{t('upgrade_page.owner_title')}</div>
          </div>
          <p className="text-[13px] text-dim leading-[1.6] flex-1">
            {t('upgrade_page.owner_desc')}
          </p>
          {ownerPending ? (
            <div
              className="w-full py-2.5 rounded-xl text-[13.5px] font-semibold flex items-center justify-center gap-2"
              style={{ background: '#fff9ed', color: '#b07800' }}
            >
              <Clock size={14} />
              {t('upgrade_page.owner_pending')}
            </div>
          ) : (
            <button
              onClick={() => setOwnerFormOpen(true)}
              className="w-full py-2.5 rounded-xl text-[13.5px] font-bold text-white border-0 cursor-pointer"
              style={{ background: '#f0a800' }}
            >
              {t('upgrade_page.owner_cta')}
            </button>
          )}
        </div>

        {/* Realtor card */}
        <div className="bg-paper border border-line rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f0faf4' }}>
              <Building2 size={20} style={{ color: '#1f7a3d' }} />
            </div>
            <div className="font-sans text-[17px] font-bold text-ink">{t('upgrade_page.realtor_title')}</div>
          </div>
          <p className="text-[13px] text-dim leading-[1.6] flex-1">
            {t('upgrade_page.realtor_desc')}
          </p>
          <button
            onClick={() => setRealtorModalOpen(true)}
            className="w-full py-2.5 rounded-xl text-[13.5px] font-bold text-white border-0 cursor-pointer"
            style={{ background: '#1f7a3d' }}
          >
            {t('upgrade_page.realtor_cta')}
          </button>
        </div>
      </div>

      {realtorModalOpen && (
        <RealtorModal
          onClose={() => setRealtorModalOpen(false)}
          onDone={req => { setPending(req); setRealtorModalOpen(false) }}
        />
      )}
    </>
  )
}
