'use client'
import { useNav } from '../hooks/useNav'
import { useState } from 'react'
import {
  CATS, type CatKey, catInfo,
  STATS, STAT_COLORS, FEATURED, EDITOR_PICKS, GUIDES,
  STEPS, STEP_COLORS, FAQS, FAQ_COLORS,
} from '../data/blogData'

export default function Blog() {
  const go = useNav()
  const [cat, setCat] = useState<CatKey>('All')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [email, setEmail] = useState('')

  const shownGuides = cat === 'All' ? GUIDES : GUIDES.filter(g => g.cat === cat)

  return (
    <div className="bg-paper">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-ink min-h-100 sm:min-h-130">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 20% 30%, rgba(225,15,31,.35) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(11,99,171,.45) 0%, transparent 50%), radial-gradient(ellipse at 60% 10%, rgba(240,168,0,.3) 0%, transparent 45%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(0,16,46,.65) 0%, rgba(0,16,46,.85) 100%)' }} />
        {/* Right-side image grid — hidden on mobile */}
        <div className="hidden lg:grid absolute top-0 right-0 w-[42%] h-full opacity-[.28] grid-cols-2 grid-rows-2 gap-1.5 p-3">
          <div className="rounded-xl" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="rounded-xl" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="rounded-xl" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="rounded-xl" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
        <div className="relative max-w-310 mx-auto pt-14 sm:pt-17.5 px-4 sm:px-7 pb-12 sm:pb-15">
          <div className="max-w-180">
            <span className="inline-block py-1.5 px-3.5 rounded-full bg-gold text-ink text-2.75 font-extrabold tracking-[.14em] uppercase font-sans">
              📚 Education &amp; Relocation Hub
            </span>
            <h1 className="font-serif text-[clamp(28px,5.5vw,60px)] font-bold text-white mt-5 mb-4 tracking-[-.02em] leading-[1.02]">
              Your guide to{' '}
              <span style={{ background: 'linear-gradient(135deg, #f0a800, #e10f1f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontStyle: 'italic' }}>
                living &amp; investing
              </span>
              {' '}in the DR
            </h1>
            <p className="text-white/78 text-4 sm:text-4.25 leading-[1.65] max-w-145 font-sans">
              Expert-curated guides, market intelligence, and community wisdom — for first-time visitors, future residents, and serious investors.
            </p>
            {/* Stats strip */}
            <div className="flex flex-wrap gap-7 sm:gap-9 mt-9.5">
              {STATS.map(([n, l], i) => (
                <div key={i}>
                  <div className="font-serif text-7 font-bold" style={{ color: STAT_COLORS[i] }}>{n}</div>
                  <div className="text-[11.5px] text-white/65 mt-0.5 tracking-[.02em] font-sans">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Featured article ── */}
      <div className="bg-paper pt-12 sm:pt-15 px-4 sm:px-7 pb-7.5">
        <div className="max-w-310 mx-auto">
          <div className="text-2.75 font-bold tracking-[.22em] uppercase text-coral font-sans">★ Featured this week</div>
          <h2 className="font-serif text-6 sm:text-7 font-semibold text-ink mt-2 mb-5 sm:mb-6.5">
            Where to start your Dominican journey
          </h2>
          <div className="relative rounded-3xl overflow-hidden cursor-pointer shadow-[0_30px_80px_-30px_rgba(0,16,46,.35)] flex flex-col lg:grid lg:grid-cols-[1.1fr_1fr] lg:min-h-95">
            <div className="relative">
              <div className="h-56 sm:h-72 lg:h-full lg:min-h-95" style={{ backgroundImage: `url(${FEATURED.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(31,122,61,.4), rgba(0,16,46,.1))' }} />
              <div className="absolute top-5.5 left-5.5">
                <span className="bg-gold text-ink text-2.5 font-extrabold py-1.25 px-3 rounded-full tracking-[.12em] font-sans">
                  {FEATURED.tag}
                </span>
              </div>
            </div>
            {/* Content */}
            <div className="pt-8 sm:pt-12 px-7 sm:px-11 pb-8 sm:pb-12 flex flex-col justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #00102e 0%, #1a3a6e 100%)' }}>
              <h3 className="font-serif text-6 sm:text-8 font-semibold text-white leading-[1.12] mb-4 tracking-[-.01em]">
                {FEATURED.title}
              </h3>
              <p className="text-3.75 text-white/78 leading-[1.65] mb-6 font-sans">
                {FEATURED.desc}
              </p>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-9.5 h-9.5 rounded-full text-white grid place-items-center text-3.25 font-bold font-sans shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0b63ab, #005f8a)' }}>
                  {FEATURED.initials}
                </span>
                <div>
                  <div className="text-3.25 font-semibold text-white font-sans">{FEATURED.author}</div>
                  <div className="text-[11.5px] text-white/55 font-sans">{FEATURED.role} · {FEATURED.read}</div>
                </div>
              </div>
              <button
                onClick={() => go('article', FEATURED.slug)}
                className="inline-flex items-center gap-1.75 bg-coral text-white border-none py-2.75 px-5.5 rounded-full font-sans font-bold text-[13.5px] cursor-pointer self-start"
              >
                Read the guide →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Editor's picks ── */}
      <div className="max-w-310 mx-auto pt-5 px-4 sm:px-7 pb-12.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5.5">
          {EDITOR_PICKS.map((p, i) => {
            const info = catInfo(p.cat)
            return (
              <div key={i} onClick={() => go('article', p.slug)}
                className="relative rounded-2xl overflow-hidden cursor-pointer bg-paper border border-line-soft shadow-[0_12px_30px_-20px_rgba(0,16,46,.15)] flex flex-col sm:flex-row">
                <div className="relative h-48 sm:h-auto sm:w-44 sm:shrink-0">
                  <div className="h-full" style={{ backgroundImage: `url(${p.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div className="absolute top-3 left-3 bg-white/95 rounded-lg py-1.25 px-2.25 text-4">
                    {p.icon}
                  </div>
                </div>
                <div className="py-5 px-5.5">
                  <div className="text-2.5 font-extrabold tracking-[.14em] uppercase font-sans"
                    style={{ color: info.a }}>{info.label}</div>
                  <h3 className="font-serif text-4.75 font-semibold text-ink mt-2 mb-1.5 leading-[1.2]">{p.title}</h3>
                  <p className="text-3.25 text-ink2 leading-[1.55] font-sans">{p.desc}</p>
                  <div className="text-[11.5px] text-dim mt-2.5 font-sans">{p.author} · {p.read} read</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Category navigator ── */}
      <div className="bg-paper2 py-12 sm:py-15 px-4 sm:px-7">
        <div className="max-w-310 mx-auto">
          <div className="text-2.75 font-bold tracking-[.22em] uppercase text-sea font-sans">Browse by topic</div>
          <h2 className="font-serif text-6 sm:text-7 font-semibold text-ink mt-2 mb-5 sm:mb-6.5">
            What are you exploring?
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            {CATS.map(({ key, label, icon, a, b }) => {
              const active = cat === key
              return (
                <button
                  key={key}
                  onClick={() => setCat(key as CatKey)}
                  className={`rounded-2xl py-4 sm:py-5 px-2 sm:px-3.5 cursor-pointer font-sans flex flex-col items-center gap-2 transition-all duration-200 ${active ? '-translate-y-0.5' : ''}`}
                  style={{
                    background: active ? `linear-gradient(135deg, ${a}, ${b})` : '#ffffff',
                    color: active ? '#fff' : '#00102e',
                    border: `1px solid ${active ? a : '#eee9dd'}`,
                    boxShadow: active ? `0 12px 30px -10px ${a}66` : '0 1px 0 rgba(0,16,46,.03)',
                  }}
                >
                  <span className="text-6 sm:text-7">{icon}</span>
                  <span className="text-[11px] sm:text-[12.5px] font-bold text-center leading-[1.2]">{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Guides grid ── */}
      <div className="max-w-310 mx-auto py-12 sm:py-15 px-4 sm:px-7">
        <div className="flex justify-between items-end mb-5 sm:mb-6.5 flex-wrap gap-3">
          <div>
            <div className="text-2.75 font-bold tracking-[.22em] uppercase font-sans"
              style={{ color: catInfo(cat).a }}>{cat === 'All' ? 'All guides' : catInfo(cat).label}</div>
            <h2 className="font-serif text-6 sm:text-7 font-semibold text-ink mt-2">{shownGuides.length} guides</h2>
          </div>
          <span className="text-3.25 text-dim font-sans">Sorted by reader favorites</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shownGuides.map((g, i) => {
            const info = catInfo(g.cat)
            return (
              <div key={i} onClick={() => go('article', g.slug)}
                className="bg-paper rounded-2xl overflow-hidden cursor-pointer shadow-[0_6px_20px_-12px_rgba(0,16,46,.15)] border border-line-soft">
                <div className="relative">
                  <div className="h-37.5" style={{ backgroundImage: `url(${g.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,16,46,.5))' }} />
                  <div className="absolute top-3 left-3 text-white rounded-full py-1 px-2.5 text-2.5 font-extrabold tracking-widest uppercase font-sans"
                    style={{ background: `linear-gradient(135deg, ${info.a}, ${info.b})` }}>
                    {info.label}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 rounded-lg py-1.5 px-2.5 text-5.5">
                    {g.icon}
                  </div>
                </div>
                <div className="p-5" style={{ borderTop: `3px solid ${info.a}` }}>
                  <h3 className="font-serif text-4.5 font-semibold text-ink leading-tight mb-2">{g.title}</h3>
                  <p className="text-3.25 text-ink2 leading-[1.55] mb-3.5 font-sans">{g.desc}</p>
                  <div className="flex justify-between items-center text-xs text-dim pt-3 border-t border-line-soft font-sans">
                    <span>📖 {g.read} read</span>
                    <span className="font-bold" style={{ color: info.a }}>Read guide →</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Buying process timeline ── */}
      <div className="text-white py-14 sm:py-17.5 px-4 sm:px-7 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #00102e 0%, #1a3a6e 50%, #0b3a6e 100%)' }}>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(240,168,0,.2) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(225,15,31,.18) 0%, transparent 50%)' }} />
        <div className="max-w-310 mx-auto relative">
          <div className="text-2.75 font-bold tracking-[.22em] uppercase text-gold font-sans">Step-by-step</div>
          <h2 className="font-serif text-7 sm:text-8 font-semibold text-white mt-2.5 mb-2">
            The Dominican buying process
          </h2>
          <p className="text-[15.5px] text-white/70 mb-9 max-w-150 font-sans">
            From browsing to keys in hand — a clear, honest guide to buying property in the DR as a foreigner.
          </p>
          <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Connecting line — only meaningful at 6-col layout */}
            <div className="hidden lg:block absolute top-10 left-[8%] right-[8%] h-0.5"
              style={{ background: 'linear-gradient(90deg, rgba(247,244,236,.1), rgba(240,168,0,.5), rgba(225,15,31,.5), rgba(11,99,171,.5), rgba(31,122,61,.5), rgba(247,244,236,.1))' }} />
            {STEPS.map(([n, icon, title, desc], i) => (
              <div key={i} onClick={() => go('blog')} className="relative cursor-pointer">
                <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 rounded-full grid place-items-center text-7 sm:text-8 border-0.75 border-white/15 relative z-2"
                  style={{ background: `linear-gradient(135deg, ${STEP_COLORS[i]}, ${STEP_COLORS[i]}99)`, boxShadow: `0 12px 32px -8px ${STEP_COLORS[i]}99` }}>
                  {icon}
                </div>
                <div className="text-center">
                  <div className="font-sans text-3.25 font-bold tracking-widest"
                    style={{ color: STEP_COLORS[i] }}>STEP {n}</div>
                  <h3 className="font-serif text-4 font-semibold text-white mt-1.5 mb-2 leading-[1.2]">{title}</h3>
                  <p className="text-xs text-white/65 leading-normal font-sans">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="bg-paper py-14 sm:py-17.5 px-4 sm:px-7">
        <div className="max-w-230 mx-auto">
          <div className="text-center mb-9">
            <div className="text-2.75 font-bold tracking-[.22em] uppercase text-coral font-sans">❓ Frequently asked</div>
            <h2 className="font-serif text-7 sm:text-8 font-semibold text-ink mt-2.5 mb-2">
              Your questions, answered
            </h2>
            <p className="text-3.75 text-ink2 max-w-135 mx-auto font-sans">
              The six questions buyers ask us most, with honest answers from our team.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map(([q, a], i) => {
              const open = openFaq === i
              const accent = FAQ_COLORS[i]
              return (
                <div key={i} className="bg-paper rounded-xl overflow-hidden transition-[border-color] duration-200"
                  style={{ border: `2px solid ${open ? accent : '#eee9dd'}`, boxShadow: open ? `0 10px 28px -16px ${accent}66` : 'none' }}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex justify-between items-center gap-3 py-4.5 px-4 sm:px-5.5 bg-transparent border-none cursor-pointer text-left font-sans text-sm sm:text-[15.5px] font-semibold text-ink"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-7.5 h-7.5 rounded-full text-white grid place-items-center text-3.25 font-extrabold shrink-0"
                        style={{ background: accent }}>
                        {i + 1}
                      </span>
                      {q}
                    </span>
                    <span className={`text-5.5 transition-transform duration-200 leading-none shrink-0 ${open ? 'rotate-45' : ''}`}
                      style={{ color: accent }}>
                      +
                    </span>
                  </button>
                  {open && (
                    <div className="pt-0 pr-4 sm:pr-5.5 pb-5 pl-14 sm:pl-16 text-sm text-ink2 leading-[1.65] font-sans">
                      {a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Newsletter CTA ── */}
      <div className="py-14 sm:py-17.5 px-4 sm:px-7 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #e10f1f 0%, #b80a17 60%, #8a0a18 100%)' }}>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(240,168,0,.3) 0%, transparent 50%), radial-gradient(ellipse at 20% 100%, rgba(255,255,255,.1) 0%, transparent 50%)' }} />
        <div className="relative max-w-230 mx-auto text-center">
          <span className="inline-block py-1.5 px-3.5 rounded-full bg-white/18 text-white text-2.75 font-extrabold tracking-[.14em] uppercase backdrop-blur-2.5 border border-white/25 font-sans">
            ✉️ Weekly briefing
          </span>
          <h2 className="font-serif text-7 sm:text-9 font-semibold text-white mt-4.5 mb-3 leading-[1.1] tracking-[-.01em]">
            DR real estate intelligence, every Friday
          </h2>
          <p className="text-4 text-white/88 leading-[1.6] max-w-135 mx-auto mb-7 font-sans">
            Market updates, new listings, and community stories — curated for buyers, investors, and DR-curious readers. Free.
          </p>
          <div className="flex gap-2.5 max-w-120 mx-auto bg-white/18 p-1.5 rounded-full backdrop-blur-2.5 border border-white/30">
            <input
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 min-w-0 py-3.25 px-4.5 rounded-full border-none font-sans text-sm bg-transparent text-white outline-none"
            />
            <button className="bg-white text-coral-deep border-none py-2.75 px-4 sm:px-5.5 rounded-full font-sans text-[13.5px] font-bold cursor-pointer shrink-0">
              Subscribe free
            </button>
          </div>
          <div className="mt-4.5 text-xs text-white/65 font-sans">
            Join 14,000+ subscribers · Unsubscribe anytime
          </div>
        </div>
      </div>

    </div>
  )
}
