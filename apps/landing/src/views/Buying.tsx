'use client'
import { useNav } from '../hooks/useNav'
import { ArrowRight, Check } from 'lucide-react'
import { I, PILLARS, SERVICES, STEPS, TRUST_ITEMS, HERO_BG } from '../data/buyingData'

function Icon({ d, size = 22 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  )
}

export default function Buying() {
  const go = useNav()
  return (
    <div className="bg-paper">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-ink">
        <div className="w-full h-115" style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(0,16,46,.95) 0%, rgba(0,16,46,.7) 50%, rgba(0,16,46,.4) 100%)' }} />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-310 w-full mx-auto px-7">
            <div className="font-sans text-2.75 font-bold tracking-[.22em] uppercase text-gold">For buyers &amp; investors</div>
            <h1 className="font-serif text-[clamp(34px,5.5vw,60px)] font-bold text-white leading-[1.04] tracking-[-.02em] mt-4 mb-4.5 max-w-190">
              Buying in the DR doesn't have to be a leap of faith.
            </h1>
            <p className="font-sans text-4.5 text-white/78 leading-[1.6] max-w-140 mb-7">
              There's no MLS in the Dominican Republic. Listings are scattered across WhatsApp groups, agent sites, and Facebook posts. We built I♥DR Realty so you have one trusted place to start — verified properties, real data, and a team that lives where you're buying.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => go('search')}
                className="font-sans text-sm font-semibold cursor-pointer py-2.75 px-5.5 rounded-full inline-flex items-center gap-2 bg-coral text-white border border-coral">
                Browse listings <ArrowRight size={16} />
              </button>
              <button onClick={() => go('contact')}
                className="font-sans text-sm font-semibold cursor-pointer py-2.75 px-5.5 rounded-full inline-flex items-center gap-2 bg-white/8 text-white border border-white/25">
                Book a discovery call
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Problem framing ── */}
      <div className="bg-paper2 py-14 px-7">
        <div className="max-w-275 mx-auto grid grid-cols-2 gap-12 items-center">
          <div>
            <div className="font-sans text-2.75 font-bold tracking-[.22em] uppercase text-coral">Why this matters</div>
            <h2 className="font-serif text-8 font-semibold text-ink mt-2.5 leading-[1.15]">
              The DR market is fragmented. Local expertise is the whole difference.
            </h2>
          </div>
          <div className="font-sans text-[15.5px] text-ink2 leading-[1.65]">
            Most countries have a central listing service that keeps everyone honest. The DR doesn't. That means the same property can be listed at three different prices, "off-market" deals get passed around between agents, and foreign buyers regularly overpay because they have no way to compare.{' '}
            <strong className="text-ink">Working with a team that lives here, sees every new listing, and has a track record you can verify isn't a nice-to-have — it's the entire game.</strong>
          </div>
        </div>
      </div>

      {/* ── Four pillars ── */}
      <div className="max-w-310 mx-auto pt-17.5 px-7 pb-12.5">
        <div className="text-center max-w-155 mx-auto mb-11">
          <div className="font-sans text-2.75 font-bold tracking-[.22em] uppercase text-sea">Why buyers work with us</div>
          <h2 className="font-serif text-9 font-semibold text-ink mt-2.5 tracking-[-.01em]">
            What you get with I♥DR Realty
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {PILLARS.map((p, i) => (
            <div key={i} className="bg-paper border border-line-soft rounded-2xl p-7 flex gap-4.5">
              <div className="w-13 h-13 rounded-xl text-white grid place-items-center shrink-0"
                style={{ background: p.tone }}>
                <Icon d={p.icon} size={26} />
              </div>
              <div>
                <h3 className="font-serif text-5 font-semibold text-ink mb-2">{p.title}</h3>
                <p className="font-sans text-sm text-ink2 leading-[1.6]">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── What our team does ── */}
      <div className="bg-ink py-17.5 px-7">
        <div className="max-w-310 mx-auto">
          <div className="text-center max-w-160 mx-auto mb-11">
            <div className="font-sans text-2.75 font-bold tracking-[.22em] uppercase text-gold">More than a "real estate agent"</div>
            <h2 className="font-serif text-9 font-semibold text-white mt-2.5 tracking-[-.01em]">
              What our team actually does for you
            </h2>
            <p className="font-sans text-3.75 text-white/65 leading-[1.6] mt-3">
              The right agent wears six hats. Each one matters in a market like the DR.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4.5">
            {SERVICES.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5.5">
                <div className="w-10 h-10 rounded-lg bg-gold text-ink grid place-items-center mb-3.5">
                  <Icon d={s.icon} size={22} />
                </div>
                <h3 className="font-serif text-4.25 font-semibold text-white mb-2">{s.title}</h3>
                <p className="font-sans text-[13.5px] text-white/70 leading-[1.6]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Process steps ── */}
      <div className="max-w-275 mx-auto py-17.5 px-7">
        <div className="text-center max-w-155 mx-auto mb-11">
          <div className="font-sans text-2.75 font-bold tracking-[.22em] uppercase text-coral">The process</div>
          <h2 className="font-serif text-9 font-semibold text-ink mt-2.5 tracking-[-.01em]">
            From first call to keys in hand
          </h2>
          <p className="font-sans text-3.75 text-ink2 leading-[1.6] mt-3">
            The whole journey is usually 60–120 days. Here's exactly how it goes.
          </p>
        </div>
        <div className="flex flex-col gap-3.5">
          {STEPS.map(([num, title, desc], i) => (
            <div key={i} className="flex gap-5.5 p-5.5 bg-paper border border-line-soft rounded-2xl">
              <div className="font-serif text-8 font-bold text-coral leading-none min-w-12.5">{num}</div>
              <div>
                <h3 className="font-serif text-4.75 font-semibold text-ink mb-1.5">{title}</h3>
                <p className="font-sans text-sm text-ink2 leading-[1.6]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust checklist ── */}
      <div className="bg-paper2 py-17.5 px-7">
        <div className="max-w-275 mx-auto grid gap-14 items-center"
          style={{ gridTemplateColumns: '.9fr 1.1fr' }}>
          <div className="rounded-2xl overflow-hidden h-90 shadow-[rgba(0,16,46,.3)_0px_30px_60px_-30px]"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div>
            <div className="font-sans text-2.75 font-bold tracking-[.22em] uppercase text-brand">Find a trusted partner</div>
            <h2 className="font-serif text-8 font-semibold text-ink mt-2.5 tracking-[-.01em] mb-5">
              What working with I♥DR Realty actually means
            </h2>
            <ul className="list-none p-0 m-0">
              {TRUST_ITEMS.map((item, i) => (
                <li key={i} className="font-sans flex items-start gap-2.5 py-2.5 text-sm text-ink2 leading-normal">
                  <span className="w-5 h-5 rounded-full bg-brand text-white grid place-items-center shrink-0 mt-px">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── What we believe ── */}
      <div className="bg-ink py-17.5 px-7">
        <div className="max-w-200 mx-auto text-center">
          <div className="font-sans text-2.75 font-bold tracking-[.22em] uppercase text-gold">What we believe</div>
          <p className="font-serif text-2xl font-medium italic text-white leading-nromal mt-4.5">
            "Buying property abroad shouldn't feel like a gamble. It should feel like making an informed decision — with someone in your corner who knows the country, the law, and the market better than you do, and is willing to tell you the truth."
          </p>
          <p className="font-sans text-3.25 text-white/55 mt-4.5 tracking-[.06em] uppercase font-bold">
            — The I♥DR Realty team
          </p>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div className="bg-coral-deep py-15 px-7">
        <div className="max-w-240 mx-auto flex justify-between items-center gap-6 flex-wrap">
          <div>
            <h2 className="font-serif text-7.5 font-semibold text-white mb-2">
              Ready to find your place in paradise?
            </h2>
            <p className="font-sans text-3.75 text-white/85 leading-normal">
              Browse listings or book a 30-minute discovery call — no commitment, no pressure.
            </p>
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => go('search')}
              className="font-sans text-sm font-semibold cursor-pointer py-2.75 px-5.5 rounded-full inline-flex items-center gap-2 bg-white text-coral-deep border border-white">
              Browse listings
            </button>
            <button onClick={() => go('contact')}
              className="font-sans text-sm font-semibold cursor-pointer py-2.75 px-5.5 rounded-full inline-flex items-center gap-2 bg-transparent text-white border border-white/40">
              Talk to our team
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
