'use client'
import { useState, type FormEvent } from 'react'
import { X, Home, TrendingUp, CheckCircle2 } from 'lucide-react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import client from '../api/axios'

const STORAGE_KEY = 'lead_modal_dismissed'

interface LeadCaptureModalProps {
  open: boolean
  onClose: () => void
}

export default function LeadCaptureModal({ open, onClose }: LeadCaptureModalProps) {
  const [tab, setTab] = useState<'buyer' | 'seller'>('buyer')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  function handleClose() {
    setSent(false)
    onClose()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      await client.post('/leads', {
        type: tab === 'buyer' ? 'buyer_interest' : 'seller_interest',
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        message: form.message || undefined,
      })
      setSent(true)
      setForm({ name: '', email: '', phone: '', message: '' })
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // keep form open on error
    } finally {
      setSending(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-200 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: '#fff' }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center border-0 cursor-pointer transition-colors z-10"
          style={{ background: '#f1f5f9', color: '#64748b' }}
        >
          <X size={14} />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4" style={{ background: '#00102e' }}>
          <div className="text-[11px] font-bold tracking-[.12em] uppercase mb-2" style={{ color: '#e10f1f' }}>
            I Love DR Realty
          </div>
          <h2 className="text-[20px] font-extrabold text-white tracking-tight leading-snug mb-1">
            Ready to make your move?
          </h2>
          <p className="text-[13px]" style={{ color: 'rgba(255,255,255,.6)' }}>
            Tell us what you're looking for and we'll connect you with the right agent.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {(['buyer', 'seller'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex items-center gap-1.5 px-3.5 py-1.75 rounded-full text-[12.5px] font-bold border-0 cursor-pointer transition-all"
                style={{
                  background: tab === t ? '#e10f1f' : 'rgba(255,255,255,.1)',
                  color: tab === t ? 'white' : 'rgba(255,255,255,.6)',
                }}
              >
                {t === 'buyer' ? <Home size={13} /> : <TrendingUp size={13} />}
                {t === 'buyer' ? "I'm buying" : "I'm selling"}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: '#1f7a3d18' }}
              >
                <CheckCircle2 size={24} style={{ color: '#1f7a3d' }} />
              </div>
              <div>
                <div className="text-[15px] font-bold text-ink mb-1">You're on the list!</div>
                <div className="text-[13px] text-dim">We'll reach out within 24 hours to discuss your goals.</div>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 px-5 py-2 rounded-full text-[13px] font-bold text-white border-0 cursor-pointer"
                style={{ background: '#e10f1f' }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full text-[13px] border border-line rounded-xl px-3 py-2.5 font-sans outline-none focus:border-current"
                  style={{ '--tw-border-opacity': 1 } as React.CSSProperties}
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full text-[13px] border border-line rounded-xl px-3 py-2.5 font-sans outline-none"
                />
              </div>
              <PhoneInput
                defaultCountry="us"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={phone => setForm(f => ({ ...f, phone }))}
                inputStyle={{ flex: 1, width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #e4ddcf', borderLeft: 'none', borderRadius: '0 0.75rem 0.75rem 0', backgroundColor: '#ffffff', fontFamily: 'inherit', fontSize: '0.8125rem', color: '#00102e', outline: 'none' }}
                countrySelectorStyleProps={{ buttonStyle: { border: '1px solid #e4ddcf', borderRight: 'none', borderRadius: '0.75rem 0 0 0.75rem', backgroundColor: '#f8f8f8', padding: '0 0.5rem', cursor: 'pointer', height: '100%' } }}
              />
              <textarea
                rows={3}
                placeholder={
                  tab === 'buyer'
                    ? 'What are you looking for? (location, budget, type…)'
                    : 'Tell us about your property (location, type, asking price…)'
                }
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full text-[13px] border border-line rounded-xl px-3 py-2.5 font-sans outline-none resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 rounded-full text-[13.5px] font-bold text-white border-0 cursor-pointer disabled:opacity-60 transition-opacity"
                style={{ background: '#e10f1f' }}
              >
                {sending ? 'Sending…' : 'Connect me with an agent'}
              </button>
              <p className="text-[11px] text-center text-dim">
                We'll only use this to reach out about your inquiry. No spam.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
