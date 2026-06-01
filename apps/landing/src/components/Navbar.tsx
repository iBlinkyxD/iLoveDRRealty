'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useNav } from '../hooks/useNav'
import { NAV_ITEMS } from '../design'

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://dashboard.ilovedrrealty.com'

export function Logo({ size = 44 }: { size?: number }) {
  return (
    <Link href="/" className="p-0 leading-none block">
      <img
        src="/ILoveDRRealty_Logo.png"
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

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-3.5 border-b border-line">
      <div className="max-w-335 mx-auto px-7 h-18.5 flex items-center gap-3.5">

        <div className="flex-1 flex justify-start">
          <Logo />
        </div>

        <nav className="flex-none flex gap-1 items-center">
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

        <div className="flex-1 flex gap-2 items-center justify-end">
          <a
            href={DASHBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[13.5px] font-semibold text-sea bg-transparent border border-sea py-2 px-3.5 rounded-full no-underline"
          >
            Dashboard →
          </a>
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

      </div>
    </div>
  )
}
