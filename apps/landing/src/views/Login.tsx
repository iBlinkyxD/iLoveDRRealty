'use client'
import { useNav } from '../hooks/useNav'
import { useState } from 'react'
import { DEMO_ROLES } from '../data/loginData'

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://dashboard.ilovedrrealty.com'

export default function Login() {
  const go = useNav()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showDemo, setShowDemo] = useState(false)

  const inputCls = 'w-full py-3 px-3.5 rounded-2.5 border border-line bg-paper font-sans text-3.75 text-ink outline-none transition-colors duration-150'

  return (
    <div className="min-h-[calc(100vh-74px)] grid grid-cols-2 font-sans">

      {/* ── Left panel — decorative ── */}
      <div className="relative overflow-hidden flex flex-col justify-between py-15 px-14"
        style={{ background: 'linear-gradient(155deg, #00102e 0%, #0d2250 55%, #003a73 100%)' }}>
        {/* Background orbs */}
        <div className="absolute -top-20 -right-20 w-105 h-105 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(225,15,31,.15) 0%, transparent 65%)' }} />
        <div className="absolute -bottom-15 -left-15 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(11,99,171,.2) 0%, transparent 65%)' }} />

        <div className="relative">
          <button onClick={() => go('landing')} className="bg-transparent border-0 cursor-pointer p-0 mb-12 block">
            <img src="/ILoveDRRealty_Logo.png" alt="I Love DR Realty" className="h-10 w-auto block" />
          </button>

          <div className="text-2.75 font-bold tracking-[.18em] uppercase text-gold mb-3.5">Welcome back</div>
          <h1 className="font-serif text-[clamp(28px,3vw,42px)] font-extrabold text-white leading-[1.1] tracking-[-.02em] mb-4.5 max-w-95">
            Your place in paradise is waiting
          </h1>
          <p className="text-3.75 text-white/65 leading-[1.7] max-w-85">
            Access saved searches, manage your listings, and run ROI models — all in one place.
          </p>
        </div>

        {/* Stats strip */}
        <div className="relative grid grid-cols-2 gap-4">
          {[['4,800+', 'Active listings'], ['12K+', 'Registered buyers'], ['320+', 'Verified realtors'], ['$2.4B', 'Properties listed']].map(([v, l], i) => (
            <div key={i} className="rounded-3 py-3.5 px-4 bg-white/6 border border-white/10">
              <div className="font-serif text-5.5 font-bold text-white">{v}</div>
              <div className="text-xs text-white/50 mt-0.75">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="bg-paper2 flex items-center justify-center py-15 px-7">
        <div className="w-full max-w-105">

          <h2 className="font-serif text-7.5 font-bold text-ink mb-1.5 tracking-[-.02em]">Log in</h2>
          <p className="text-[14.5px] text-ink2 mb-8">
            Don't have an account?{' '}
            <button onClick={() => go('signup')} className="bg-transparent border-0 cursor-pointer text-coral font-bold text-[14.5px] font-sans p-0">
              Sign up free
            </button>
          </p>

          <div className="bg-paper border border-line rounded-4 p-8">
            <div className="mb-4.5">
              <label className="text-xs font-semibold text-ink2 block mb-1.75">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className={inputCls} />
            </div>

            <div className="mb-5.5">
              <div className="flex justify-between items-center mb-1.75">
                <label className="text-xs font-semibold text-ink2">Password</label>
                <button className="bg-transparent border-0 cursor-pointer text-xs text-sea font-semibold font-sans p-0">Forgot password?</button>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
            </div>

            <button
              onClick={() => window.open(DASHBOARD_URL, '_blank')}
              className="w-full py-3.25 rounded-full border-none cursor-pointer bg-coral text-white font-sans text-3.75 font-bold transition-colors duration-150"
            >
              Log in
            </button>

            <div className="flex items-center gap-3 my-5.5">
              <div className="flex-1 h-px bg-line" />
              <span className="text-xs text-dim font-medium">or</span>
              <div className="flex-1 h-px bg-line" />
            </div>

            {/* Social auth stubs */}
            <div className="flex flex-col gap-2.5">
              {[['🇬 Google', '#fff', '#00102e', '#e4ddcf'], ['📘 Facebook', '#1877F2', '#fff', '#1877F2']].map(([l, bg, fg, bd], i) => (
                <button key={i} style={{ background: bg as string, color: fg as string, border: `1px solid ${bd}` }}
                  className="w-full py-2.75 rounded-full font-sans text-sm font-semibold cursor-pointer">
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Demo roles toggle */}
          <div className="mt-5">
            <button onClick={() => setShowDemo(d => !d)}
              className="w-full py-3 rounded-3 border border-line bg-paper text-ink2 font-sans text-[13.5px] font-semibold cursor-pointer flex items-center justify-center gap-2">
              👤 {showDemo ? 'Hide' : 'Explore'} demo accounts & role access
            </button>

            {showDemo && (
              <div className="mt-3 flex flex-col gap-2.5">
                <p className="text-[12.5px] text-dim text-center mb-1">
                  Tap a role to preview the dashboard — no account needed.
                </p>
                {DEMO_ROLES.map((r, i) => (
                  <button key={i} onClick={() => window.open(`${DASHBOARD_URL}?role=${r.role}`, '_blank')}
                    className="bg-paper border border-line-soft rounded-3 overflow-hidden cursor-pointer p-0 text-left w-full">
                    <div className="flex items-center gap-3 py-3 px-3.5 bg-paper2">
                      <div className="w-9 h-9 rounded-2.25 text-white grid place-items-center shrink-0 text-4.5"
                        style={{ background: r.tone }}>
                        {r.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-serif text-3.75 font-semibold text-ink">{r.role}</div>
                        <div className="text-2.75 text-dim font-mono">{r.email} · demo123</div>
                      </div>
                      <span className="text-xs font-bold" style={{ color: r.tone }}>Log in →</span>
                    </div>
                    <div className="py-2.5 px-3.5 grid grid-cols-2 gap-x-3 gap-y-1.5">
                      {r.can.map((item, j) => (
                        <div key={j} className="flex items-start gap-1.5 text-[11.5px] text-ink2 leading-[1.35]">
                          <span className="shrink-0" style={{ color: r.tone }}>✓</span>{item}
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
                <p className="text-2.75 text-dim text-center mt-1 leading-normal">
                  Demo accounts are illustrative — no real login required.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}
