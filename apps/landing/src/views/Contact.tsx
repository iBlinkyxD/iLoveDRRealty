'use client'
import { useNav } from '../hooks/useNav'
import { useState, type ChangeEvent } from 'react'
import { I, CHANNELS } from '../data/contactData'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { isValidPhoneNumber } from 'libphonenumber-js'

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

export default function Contact() {
  const go = useNav()
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: 'Buying a property', message: '' })
  const [agreed, setAgreed] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const phoneValid = form.phone.length > 5 && isValidPhoneNumber(form.phone)

  const inputCls = 'w-full py-2.75 px-3.25 rounded-lg border border-line bg-paper font-sans text-sm text-ink outline-none'

  const phoneInputStyle: React.CSSProperties = {
    flex: 1,
    width: '100%',
    padding: '0.6875rem 0.8125rem',
    border: '1px solid #e4ddcf',
    borderLeft: 'none',
    borderRadius: '0 0.5rem 0.5rem 0',
    backgroundColor: '#ffffff',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    color: '#00102e',
    outline: 'none',
  }

  const phoneSelectorStyle: React.CSSProperties = {
    border: '1px solid #e4ddcf',
    borderRight: 'none',
    borderRadius: '0.5rem 0 0 0.5rem',
    backgroundColor: '#f3f1ea',
    padding: '0 0.5rem',
    cursor: 'pointer',
    height: '100%',
  }

  return (
    <div className="font-sans text-ink">

      {/* HERO */}
      <div className="relative overflow-hidden pt-16 sm:pt-20 px-4 sm:px-6 pb-14 sm:pb-18"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,16,46,.94) 0%, rgba(13,34,80,.86) 60%, rgba(0,58,115,.75) 100%)' }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 40%, rgba(11,99,171,.25) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(225,15,31,.1) 0%, transparent 45%)' }} />
        <div className="relative max-w-180 mx-auto text-center">
          <div className="font-sans text-2.75 font-bold tracking-[.18em] uppercase text-coral mb-3">Get in touch</div>
          <h1 className="font-sans text-[clamp(32px,5vw,52px)] font-extrabold text-white leading-[1.05] tracking-[-.02em] mb-4.5">
            Let's find your place in paradise
          </h1>
          <p className="text-4.25 text-white/72 leading-[1.65] max-w-135 mx-auto">
            Whether you're buying, renting, listing, or just exploring — our bilingual team is here to help.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-275 mx-auto pt-12 sm:pt-15 px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-9 items-start">

          {/* Left — channels */}
          <div>
            <div className="mb-8">
              <div className="font-sans text-2.75 font-bold tracking-[.18em] uppercase text-sea mb-3">Reach us directly</div>
              <h2 className="font-sans text-7 font-bold text-ink mt-1 mb-2 tracking-[-.02em]">
                Multiple ways to connect
              </h2>
              <p className="text-[14.5px] text-ink2 leading-[1.6]">
                We're a bilingual team based in the DR. Pick whichever channel works best for you.
              </p>
            </div>

            <div className="flex flex-col gap-3.5">
              {CHANNELS.map((ch, i) => (
                <div key={i} className="bg-paper border border-line-soft rounded-xl p-5 flex gap-4 items-start">
                  <div className="w-11.5 h-11.5 rounded-lg bg-paper2 grid place-items-center shrink-0"
                    style={{ color: ch.color }}>
                    <Icon d={ch.icon} size={22} />
                  </div>
                  <div>
                    <div className="font-bold text-3.75 text-ink mb-0.5">{ch.title}</div>
                    <div className="text-[12.5px] text-dim mb-1.5">{ch.desc}</div>
                    <div className="text-[13.5px] font-semibold text-sea">{ch.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-6 rounded-xl overflow-hidden border border-line">
              <div className="h-45 flex flex-col items-center justify-center gap-2 text-white relative overflow-hidden"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,58,115,.72) 0%, rgba(11,99,171,.6) 50%, rgba(26,122,191,.55) 100%)' }} />
                <div className="relative text-white/50 text-2.75 tracking-widest uppercase">Map placeholder</div>
                <div className="relative"><Icon d={I.map} size={28} /></div>
                <div className="relative text-white/70 text-3.25 font-medium">Sosúa, Puerto Plata · Santo Domingo</div>
              </div>
              <div className="bg-paper2 py-3.5 px-4.5 flex flex-wrap gap-x-4.5 gap-y-2 text-3.25 text-ink2">
                <span><Icon d={I.map} size={14} /> <strong>North coast:</strong> Sosúa, Puerto Plata</span>
                <span><Icon d={I.map} size={14} /> <strong>Capital:</strong> Santo Domingo</span>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-paper border border-line rounded-2xl p-5 sm:p-9">
            {sent ? (
              <div className="text-center py-10 px-5">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-sans text-2xl font-bold text-ink mb-2.5">Message sent!</h3>
                <p className="text-[14.5px] text-ink2 leading-[1.6] mb-6">We'll get back to you within a few hours. In the meantime, feel free to browse listings.</p>
                <button onClick={() => go('search')} className="font-sans text-sm font-semibold cursor-pointer py-3 px-7 rounded-full bg-coral text-white border-none">
                  Browse listings
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-sans text-2xl font-bold text-ink mb-6">Send us a message</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-ink2 mb-1.5 block">Full name</label>
                    <input value={form.name} onChange={set('name')} placeholder="Your full name" className={inputCls} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-semibold text-ink2 mb-1.5 block">Email</label>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={inputCls} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-ink2">Phone / WhatsApp</label>
                      {phoneValid && (
                        <span className="text-[10.5px] font-semibold text-brand">✓ Valid</span>
                      )}
                    </div>
                    <PhoneInput
                      defaultCountry="do"
                      value={form.phone}
                      onChange={phone => setForm(f => ({ ...f, phone }))}
                      inputStyle={phoneInputStyle}
                      countrySelectorStyleProps={{ buttonStyle: phoneSelectorStyle }}
                      style={{ width: '100%', display: 'flex' }}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-ink2 mb-1.5 block">I'm interested in</label>
                  <select value={form.interest} onChange={set('interest')} className={`${inputCls} cursor-pointer`}>
                    <option>Buying a property</option>
                    <option>Renting a property</option>
                    <option>Listing my property</option>
                    <option>Investment advice</option>
                    <option>Relocation help</option>
                    <option>General inquiry</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-ink2 mb-1.5 block">Message</label>
                  <textarea rows={4} value={form.message} onChange={set('message')}
                    placeholder="Tell us what you're looking for…" className={`${inputCls} resize-y`} />
                </div>

                <label className="flex items-start gap-2.5 my-4 text-[12.5px] text-ink2 leading-[1.55] cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    className="w-3.75 h-3.75 mt-0.5 shrink-0 accent-coral" />
                  I agree to be contacted about my inquiry and accept the privacy policy.
                </label>

                <button
                  onClick={() => agreed && setSent(true)}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full border-none font-sans text-3.75 font-bold transition-colors duration-200 ${agreed ? 'bg-coral text-white cursor-pointer' : 'bg-line-soft text-dim cursor-not-allowed'}`}
                >
                  Send message <Icon d={I.arrow} size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="bg-paper2 border-t border-line py-12 sm:py-14 px-4 sm:px-6">
        <div className="max-w-175 mx-auto text-center">
          <div className="font-sans text-2.75 font-bold tracking-[.18em] uppercase text-sea mb-3">Not sure where to start?</div>
          <h2 className="font-sans text-[clamp(22px,3vw,34px)] font-bold text-ink mt-2 mb-3.5 tracking-[-.02em]">
            Explore our resources first
          </h2>
          <p className="text-3.75 text-ink2 leading-[1.65] mb-7">
            From buying guides to ROI calculators — everything you need to make a confident decision.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => go('buying')} className="font-sans text-sm font-semibold cursor-pointer py-3 px-6.5 rounded-full bg-coral text-white border-none">
              Buying guide
            </button>
            <button onClick={() => go('calculator')} className="font-sans text-sm font-semibold cursor-pointer py-3 px-6.5 rounded-full bg-transparent text-sea border-[1.5px] border-sea">
              ROI Calculator
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
