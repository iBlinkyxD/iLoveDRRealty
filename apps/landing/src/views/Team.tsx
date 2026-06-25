'use client'
import { useNav } from '../hooks/useNav'
import { PRINCIPALS, TEAM_STATS } from '../data/teamData'


export default function Team() {
  const go = useNav()
  return (
    <div>
      {/* ── HERO ── */}
      <div className="bg-ink pt-14 px-4 sm:px-6 pb-12.5 relative overflow-hidden">
        <div className="absolute -top-30 -right-20 w-90 h-90 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(240,168,0,.15) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-25 -left-20 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(225,15,31,.10) 0%, transparent 70%)' }} />
        <div className="max-w-275 mx-auto text-center relative">
          <div className="font-sans text-2.75 font-bold tracking-[.22em] uppercase text-gold">Our Team</div>
          <h1 className="font-sans text-[clamp(30px,4.5vw,48px)] font-bold text-paper mt-3 mb-2.5 tracking-[-.02em]">
            The people behind{' '}
            <span className="italic text-gold">I♥DR Realty</span>
          </h1>
          <p className="font-sans text-4 text-white/70 leading-[1.6] max-w-155 mx-auto">
            Three principal brokers — Dominicans, investors, and relocation experts who actually live the market they sell.
          </p>
          <div className="mt-5.5 flex justify-center gap-7 flex-wrap">
            {TEAM_STATS.map(([n, label, color]) => (
              <div key={label}>
                <div className="font-sans text-6.5 font-bold" style={{ color }}>{n}</div>
                <div className="font-sans text-2.75 text-white/55 tracking-[.06em] uppercase mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRINCIPALS ── */}
      <div className="max-w-295 mx-auto pt-12.5 px-4 sm:px-6 pb-5">
        <div className="mb-6">
          <div className="font-sans text-2.75 font-bold tracking-[.22em] uppercase text-coral">★ The principals</div>
          <h2 className="font-sans text-6.5 font-semibold text-ink mt-2 mb-1.5">Brokerage leaders</h2>
          <p className="font-sans text-sm text-dim max-w-145 leading-[1.55]">
            Each principal runs an independent brokerage on the platform. See the agents they lead in the section below.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(245px,1fr))] gap-5">
          {PRINCIPALS.map((p, i) => (
            <div key={i} className="bg-paper border border-line-soft rounded-2xl overflow-hidden shadow-[rgba(0,16,46,.25)_0px_8px_24px_-18px]">
              <div className="relative h-55" style={{ backgroundImage: `url(${p.img})`, backgroundSize: 'cover', backgroundPosition: p.bgPos ?? 'center top' }}>
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(0deg,rgba(0,16,46,.4),transparent 55%)' }} />
                <div className="absolute top-3 left-3 bg-gold text-ink py-1 px-2.5 rounded-full text-2.5 font-extrabold tracking-[.12em] uppercase">
                  ★ Principal
                </div>
              </div>
              <div className="py-4.5 px-5 font-sans">
                <h3 className="font-sans text-4.75 font-bold text-ink leading-[1.15]">{p.name}</h3>
                <div className="text-2.75 font-bold tracking-[.08em] uppercase text-coral mt-1">{p.role}</div>
                <p className="text-3.25 text-ink2 leading-[1.55] mt-3">{p.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ── BOTTOM CTA ── */}
      <div className="max-w-275 mx-auto py-14 px-4 sm:px-6">
        <div className="bg-ink rounded-3xl py-9 px-6 sm:py-11 sm:px-12 flex items-center justify-between flex-wrap gap-6 relative overflow-hidden">
          <div className="absolute -top-15 -right-15 w-60 h-60 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(240,168,0,.12) 0%, transparent 70%)' }} />
          <div className="relative">
            <div className="font-sans text-6.5 font-semibold text-paper leading-[1.2] mb-2">
              Ready to start your DR journey?
            </div>
            <p className="font-sans text-sm text-white/65 leading-[1.55] max-w-115">
              Connect with the right agent for your goals — whether you're buying, investing, or relocating.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap relative">
            <button onClick={() => go('contact')}
              className="font-sans text-sm font-semibold cursor-pointer py-3 px-5.5 rounded-full bg-coral text-white border-none">
              Talk to the team
            </button>
            <button onClick={() => go('search')}
              className="font-sans text-sm font-semibold cursor-pointer py-3 px-5.5 rounded-full bg-white/8 text-paper border border-white/18">
              Browse listings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
