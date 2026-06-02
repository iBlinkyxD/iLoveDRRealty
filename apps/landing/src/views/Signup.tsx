'use client'
import { useNav } from '../hooks/useNav'
import { useState } from 'react'
import { type Role, ROLES, BENEFITS } from '../data/signupData'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'

export default function Signup() {
  const go = useNav()
  const [role, setRole] = useState<Role>('Buyer')
  const [residency, setResidency] = useState<'Resident' | 'Non-resident' | ''>('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [done, setDone] = useState(false)

  const needsVerify = role === 'Realtor'
  const active = ROLES.find(r => r.key === role)!

  const inputCls = 'w-full py-3 px-3.5 rounded-xl border border-line bg-paper font-sans text-3.75 text-ink outline-none transition-colors duration-150'
  const labelCls = 'text-xs font-semibold text-ink2 block mb-1.75'

  if (done) {
    return (
      <div className="min-h-[calc(100vh-74px)] flex items-center justify-center bg-paper2 font-sans">
        <div className="text-center max-w-120 py-10 px-6">
          <div className="text-16 mb-5">🎉</div>
          <h2 className="font-serif text-8 font-extrabold text-ink mb-3 tracking-[-.02em]">You're in!</h2>
          <p className="text-3.75 text-ink2 leading-[1.65] mb-7">
            {needsVerify
              ? `Your ${role} account is created. Our team will review and verify your profile — you'll get an email within 24 hours.`
              : `Your account is ready. Verify your email and start exploring.`}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => go('search')}
              className="font-sans text-sm font-bold cursor-pointer py-3 px-7 rounded-full bg-coral text-white border-none">
              Browse listings
            </button>
            {role === 'Investor' && (
              <button onClick={() => go('calculator')}
                className="font-sans text-sm font-bold cursor-pointer py-3 px-7 rounded-full bg-transparent text-sea border-[1.5px] border-sea">
                Open ROI Calculator
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-74px)] grid grid-cols-1 md:grid-cols-2 font-sans">

      {/* ── Left panel ── */}
      <div className="hidden md:flex flex-col py-15 px-14 relative overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1683336474667-420dabe065b5?q=80&w=1471&auto=format&fit=crop)' }} />
        {/* Dark gradient overlay — heavy top-left, fades to transparent bottom-right */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,8,24,.97) 0%, rgba(0,16,46,.88) 30%, rgba(0,20,50,.55) 60%, rgba(0,10,30,.18) 100%)' }} />

        <div className="relative">
          <button onClick={() => go('landing')} className="bg-transparent border-0 cursor-pointer p-0 mb-12 block">
            <img src="/ILoveDRRealty_Logo.png" alt="I Love DR Realty" className="h-10 w-auto block" />
          </button>

          <div className="text-2.75 font-bold tracking-[.18em] uppercase text-gold mb-3.5">Create your account</div>
          <h1 className="font-serif text-[clamp(26px,3vw,40px)] font-extrabold text-white leading-[1.1] tracking-[-.02em] mb-4.5 max-w-90">
            Join{' '}
            <span className="text-coral">12,000+</span> buyers, investors, and realtors
          </h1>
          <p className="text-3.75 text-white/65 leading-[1.7] max-w-80 mb-10">
            Free to join. Verified listings. A bilingual team that's lived the process.
          </p>
        </div>

        {/* What you get — updates with selected role */}
        <div className="relative bg-white/10 border border-white/10 rounded-2xl pt-5.5 px-5.5 pb-4.5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl grid place-items-center text-4.5"
              style={{ background: active.tone }}>{active.icon}</div>
            <div>
              <div className="text-sm font-bold text-white">{role} account</div>
              <div className="text-xs text-white/50">{active.desc}</div>
            </div>
          </div>
          <div className="flex flex-col gap-2.25">
            {BENEFITS[role].map((b, i) => (
              <div key={i} className="flex items-start gap-2.25 text-3.25 text-white/80 leading-[1.35]">
                <span className="font-bold shrink-0 mt-px" style={{ color: active.tone }}>✓</span>{b}
              </div>
            ))}
          </div>
          {needsVerify && (
            <div className="mt-4 py-2.5 px-3 bg-gold/12 border border-gold/25 rounded-xl text-xs text-white/70 leading-normal">
              <strong className="text-gold">Verified role.</strong>{' '}
              {role === 'Realtor' ? "You'll upload your license after signup." : "You'll upload ID / cédula when listing a property."}
            </div>
          )}
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="bg-paper2 flex items-center justify-center py-10 sm:py-12 px-4 sm:px-7 overflow-y-auto">
        <div className="w-full max-w-110">

          <h2 className="font-serif text-7 font-bold text-ink mb-1.5 tracking-[-.02em]">Create account</h2>
          <p className="text-[14.5px] text-ink2 mb-7">
            Already have an account?{' '}
            <button onClick={() => go('login')}
              className="bg-transparent border-0 cursor-pointer text-coral font-bold text-[14.5px] font-sans p-0">
              Log in
            </button>
          </p>

          <div className="bg-paper border border-line rounded-2xl p-5 sm:p-7">

            {/* Role picker */}
            <div className="mb-5.5">
              <div className="text-xs font-semibold text-ink2 mb-2.5">I'm signing up as a…</div>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => {
                  const on = role === r.key
                  return (
                    <button key={r.key} onClick={() => setRole(r.key)}
                      className="py-2.5 px-3 rounded-xl cursor-pointer text-left font-sans transition-all duration-150"
                      style={{
                        border: `1.5px solid ${on ? r.tone : '#e4ddcf'}`,
                        background: on ? `${r.tone}0f` : '#ffffff',
                      }}>
                      <div className="flex items-center gap-1.75 mb-0.75">
                        <span className="text-4">{r.icon}</span>
                        <span className="text-[13.5px] font-bold" style={{ color: on ? r.tone : '#00102e' }}>{r.key}</span>
                      </div>
                      <div className="text-[11.5px] text-dim leading-[1.3]">{r.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Name */}
            <div className="mb-3.5">
              <label className={labelCls}>Full name</label>
              <input placeholder="Maria Rodríguez" className={inputCls} />
            </div>

            {/* Phone */}
            <div className="mb-3.5">
              <label className={labelCls}>Phone / WhatsApp</label>
              <PhoneInput
                defaultCountry="do"
                value={phone}
                onChange={setPhone}
                placeholder="+1 (809) 000-0000"
                inputStyle={{
                  flex: 1, width: '100%', outline: 'none',
                  border: '1px solid #e4ddcf', borderLeft: 'none',
                  borderRadius: '0 0.75rem 0.75rem 0',
                  background: '#ffffff', padding: '0.75rem 0.875rem',
                  fontFamily: 'inherit', fontSize: '0.9375rem', color: '#00102e',
                  height: 'auto', boxSizing: 'border-box',
                }}
                countrySelectorStyleProps={{
                  buttonStyle: {
                    border: '1px solid #e4ddcf', borderRight: 'none',
                    borderRadius: '0.75rem 0 0 0.75rem',
                    background: '#ffffff', padding: '0 0.75rem',
                    cursor: 'pointer', height: '100%',
                  },
                }}
                style={{ width: '100%', display: 'flex' }}
              />
            </div>

            <div className="mb-3.5">
              <label className={labelCls}>Email address</label>
              <input type="email" placeholder="you@email.com" className={inputCls} />
            </div>

            {/* Password + confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div>
                <label className={labelCls}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className={`${inputCls} ${confirmPassword && confirmPassword !== password ? 'border-coral' : confirmPassword && confirmPassword === password ? 'border-brand' : ''}`}
                />
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[11px] text-coral mt-1">Passwords don't match</p>
                )}
              </div>
            </div>

            {/* Residency question */}
            <div className="mb-4.5">
              <div className="text-xs font-semibold text-ink2 mb-2">
                Are you a DR resident? <span className="text-dim font-normal">(self-reported)</span>
              </div>
              <div className="flex gap-2">
                {(['Resident', 'Non-resident'] as const).map(r => {
                  const on = residency === r
                  return (
                    <button key={r} onClick={() => setResidency(r)}
                      className={`flex-1 py-2.25 rounded-xl cursor-pointer font-sans text-3.25 transition-all duration-150 ${on ? 'border border-sea bg-sea text-white font-bold' : 'border border-line bg-paper text-ink2 font-medium'}`}>
                      {r}
                    </button>
                  )
                })}
              </div>
              {residency === 'Non-resident' && needsVerify && (
                <div className="text-[11.5px] text-dim mt-2 leading-normal">
                  Non-residents can refer buyers to a local DR agent but can't list directly (per DR residency law).
                </div>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.25 mb-4.5 text-[12.5px] text-ink2 leading-normal cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="accent-coral w-3.75 h-3.75 mt-0.5 shrink-0" />
              <span>
                I agree to the{' '}
                <button className="bg-transparent border-0 cursor-pointer text-sea font-semibold font-sans text-[12.5px] p-0">Terms & Conditions</button>
                {' '}and{' '}
                <button className="bg-transparent border-0 cursor-pointer text-sea font-semibold font-sans text-[12.5px] p-0">Privacy Policy</button>
                .
              </span>
            </label>

            <button
              onClick={() => agreed && password && password === confirmPassword && setDone(true)}
              className={`w-full py-3.25 rounded-full border-none font-sans text-3.75 font-bold transition-colors duration-150 ${agreed && password && password === confirmPassword ? 'bg-coral text-white cursor-pointer' : 'bg-line-soft text-dim cursor-not-allowed'}`}
            >
              Create account
            </button>

            {needsVerify && (
              <p className="text-[11.5px] text-dim text-center mt-2.5 leading-normal">
                {role === 'Realtor' ? 'Realtors' : 'Owners'} are manually verified by our team before going live.
              </p>
            )}

            <div className="flex items-center gap-3 mt-4.5 mb-3.5">
              <div className="flex-1 h-px bg-line" />
              <span className="text-xs text-dim font-medium">or sign up with</span>
              <div className="flex-1 h-px bg-line" />
            </div>

            <button className="w-full py-2.75 rounded-full font-sans text-sm font-semibold cursor-pointer bg-white border border-[#dadce0] text-[#3c4043] flex items-center justify-center gap-3 hover:bg-[#f8f9fa] transition-colors duration-150">
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}
