'use client'
import { useNav } from '../hooks/useNav'
import { useState } from 'react'
import { Star, Home, Users, Handshake } from 'lucide-react'

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://dashboard.ilovedrrealty.com'

const STATS = [
  { value: '4.9',    label: 'Rating',            Icon: Star,      iconCls: 'text-gold fill-gold' },
  { value: '4,800+', label: 'Active Listings',   Icon: Home,      iconCls: 'text-white/80'       },
  { value: '12K+',   label: 'Registered Buyers', Icon: Users,     iconCls: 'text-white/80'       },
  { value: '$2.4B',  label: 'Closed Volume',     Icon: Handshake, iconCls: 'text-white/80'       },
]

export default function Login() {
  const go = useNav()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const inputCls = 'w-full py-3 px-3.5 rounded-xl border border-line bg-paper font-sans text-3.75 text-ink outline-none transition-colors duration-150'

  return (
    <div className="min-h-[calc(100vh-74px)] grid grid-cols-1 md:grid-cols-2 font-sans">

      {/* ── Left panel — decorative ── */}
      <div className="hidden md:flex relative overflow-hidden flex-col justify-between py-15 px-14">
        {/* Background photo */}
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1683336474667-420dabe065b5?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80&auto=format&fit=crop)' }} />
        {/* Dark gradient overlay — heavy top-left, fades to transparent bottom-right */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,8,24,.97) 0%, rgba(0,16,46,.88) 30%, rgba(0,20,50,.55) 60%, rgba(0,10,30,.18) 100%)' }} />

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
        <div className="relative flex items-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 overflow-hidden divide-x divide-white/15">
          {STATS.map((s, i) => (
            <div key={i} className="flex-1 flex items-center gap-3 px-5 py-5">
              <s.Icon size={22} className={s.iconCls} />
              <div>
                <div className="font-serif text-5.5 font-bold text-white leading-none">{s.value}</div>
                <div className="text-xs text-white/55 mt-1.5 leading-none">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="bg-paper2 flex items-center justify-center py-10 sm:py-15 px-4 sm:px-7">
        <div className="w-full max-w-105">

          <h2 className="font-serif text-7.5 font-bold text-ink mb-1.5 tracking-[-.02em]">Log in</h2>
          <p className="text-[14.5px] text-ink2 mb-8">
            Don't have an account?{' '}
            <button onClick={() => go('signup')} className="bg-transparent border-0 cursor-pointer text-coral font-bold text-[14.5px] font-sans p-0">
              Sign up free
            </button>
          </p>

          <div className="bg-paper border border-line rounded-2xl p-8">
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
