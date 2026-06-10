'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useNav } from '../hooks/useNav'
import { NAV_ITEMS } from '../design'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'


export function Logo({ size = 42 }: { size?: number }) {
  return (
    <Link href="/" className="p-0 leading-none block">
      <img
        src="/ILoveDRRealty_Dark.png"
        alt="I Love DR Realty"
        className="block w-auto"
        style={{ height: size }}
      />
    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const go = useNav()
  const current = !pathname || pathname === '/' ? 'landing' : pathname.replace(/^\/|\/$/g, '')
  const [open, setOpen] = useState(false)

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-3.5 border-b border-line">
      <div className="max-w-335 mx-auto px-4 sm:px-7 h-24 flex items-center gap-3.5">

        <div className="flex-1 flex justify-start">
          <Logo size={48} />
        </div>

        {/* Desktop nav */}
        <nav className="hidden min-[1080px]:flex flex-none gap-1 items-center">
          {NAV_ITEMS.map(([key, label]) => {
            const active = current === key
            return (
              <button
                key={key}
                onClick={() => go(key)}
                className={`font-sans text-3.25 cursor-pointer bg-transparent border-x-0 border-t-0 px-2.25 py-2 whitespace-nowrap transition-all duration-150 border-b-2 ${
                  active
                    ? 'font-bold text-ink border-coral'
                    : 'font-medium text-ink2 border-transparent'
                }`}
              >
                {label}
              </button>
            )
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden min-[1080px]:flex flex-1 gap-2 items-center justify-end">
          <button
            onClick={() => go('login')}
            className="font-sans text-[13.5px] font-semibold cursor-pointer text-ink bg-transparent border-none py-2.25 px-3.5"
          >
            Log in
          </button>
          <button
            onClick={() => go('signup')}
            className="font-sans text-[13.5px] font-semibold cursor-pointer text-white bg-coral border border-coral py-2.25 px-4.5 rounded-full transition-colors duration-150"
          >
            Sign up
          </button>
        </div>

        {/* Mobile: Sign up + hamburger */}
        <div className="flex min-[1080px]:hidden items-center gap-2">
          <button
            onClick={() => go('signup')}
            className="font-sans text-[13px] font-semibold cursor-pointer text-white bg-coral border border-coral py-2 px-4 rounded-full transition-colors duration-150"
          >
            Sign up
          </button>
          <button
            onClick={() => setOpen(v => !v)}
            className="cursor-pointer bg-transparent border-none p-1.5 text-ink flex items-center"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="min-[1080px]:hidden bg-white border-t border-line px-4 py-3 flex flex-col">
          {NAV_ITEMS.map(([key, label]) => {
            const active = current === key
            return (
              <button
                key={key}
                onClick={() => { go(key); setOpen(false) }}
                className={`font-sans text-sm cursor-pointer bg-transparent border-none py-3 px-3 rounded-xl text-left transition-colors duration-150 ${
                  active ? 'font-bold text-ink bg-paper2' : 'font-medium text-ink2'
                }`}
              >
                {label}
              </button>
            )
          })}
          <div className="h-px bg-line my-2" />
          <button
            onClick={() => { go('login'); setOpen(false) }}
            className="font-sans text-sm font-semibold cursor-pointer text-ink bg-transparent border border-line py-3 px-4 rounded-xl text-left mb-2"
          >
            Log in
          </button>
        </div>
      )}
    </div>
  )
}
