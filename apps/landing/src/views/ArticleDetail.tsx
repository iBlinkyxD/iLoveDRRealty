'use client'
import { useNav } from '../hooks/useNav'
import { ARTICLES, GUIDES, EDITOR_PICKS, FEATURED, catInfo } from '../data/blogData'

export default function ArticleDetail({ slug }: { slug: string }) {
  const go = useNav()
  const a = ARTICLES[slug]

  if (!a) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="text-ink2 text-4.5 mb-4">Article not found.</div>
          <button
            onClick={() => go('blog')}
            className="bg-coral text-white border-none py-2.5 px-6 rounded-full font-bold cursor-pointer font-sans text-sm"
          >
            ← Back to Resources
          </button>
        </div>
      </div>
    )
  }

  const catColor = catInfo(a.catKey).a

  // Related: up to 3 articles from all slugs, excluding current
  const allSlugs = [
    { slug: FEATURED.slug, title: FEATURED.title, cat: 'Moving', read: FEATURED.read },
    ...EDITOR_PICKS.map(p => ({ slug: p.slug, title: p.title, cat: p.cat, read: p.read + ' read' })),
    ...GUIDES.map(g => ({ slug: g.slug, title: g.title, cat: g.cat, read: g.read + ' read' })),
  ]
  const related = allSlugs.filter(s => s.slug !== slug).slice(0, 3)

  return (
    <div className="bg-paper min-h-screen font-sans">
      <div className="max-w-310 mx-auto px-4 sm:px-7 pt-5 sm:pt-7 pb-14 sm:pb-20">

        {/* Back */}
        <button
          onClick={() => go('blog')}
          className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-ink2 text-3.25 font-medium font-sans mb-7 hover:text-ink transition-colors"
        >
          ← Back to Resources
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-10 items-start">

          {/* ── Main article ── */}
          <article>
            {/* Category tag */}
            <span
              className="inline-block py-1.25 px-3 rounded-full text-2.5 font-extrabold tracking-[.12em] uppercase font-sans text-white mb-4"
              style={{ background: catColor }}
            >
              {a.catLabel} · {a.date}
            </span>

            <h1 className="font-sans text-[clamp(26px,4vw,44px)] font-bold text-ink leading-[1.08] tracking-[-.02em] mb-4">
              {a.title}
            </h1>

            <p className="font-sans text-[19px] italic text-ink2 leading-[1.6] mb-6">
              {a.lede}
            </p>

            {/* Author strip */}
            <div className="flex items-center gap-3 pb-6 border-b border-line-soft">
              <span
                className="w-9.5 h-9.5 rounded-full text-white grid place-items-center text-3.25 font-bold font-sans shrink-0"
                style={{ background: catColor }}
              >
                {a.initials}
              </span>
              <div>
                <div className="text-3.5 font-bold text-ink font-sans">{a.author}</div>
                <div className="text-[11.5px] text-dim font-sans">{a.role} · {a.read} read · {a.reads} reads</div>
              </div>
            </div>

            {/* Hero image */}
            <div
              className="mt-6 mb-8 rounded-2xl overflow-hidden h-52 sm:h-72 lg:h-80 bg-paper2"
              style={{ backgroundImage: `url(${a.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />

            {/* Body */}
            <div>
              {a.body.map(([type, content], i) =>
                type === 'h' ? (
                  <h2
                    key={i}
                    className="font-sans text-6 font-semibold text-ink mt-8 mb-3 leading-[1.2]"
                  >
                    {content}
                  </h2>
                ) : (
                  <p
                    key={i}
                    className="text-4 text-ink2 leading-[1.75] mb-4 font-sans"
                  >
                    {content}
                  </p>
                )
              )}
            </div>

            {/* Footer CTA */}
            <div className="flex flex-wrap gap-2.5 mt-8 pt-7 border-t border-line-soft">
              <button
                onClick={() => go('contact')}
                className="bg-coral text-white border-none py-2.75 px-5.5 rounded-full font-sans font-bold text-[13.5px] cursor-pointer"
              >
                Talk to our team →
              </button>
              <button
                onClick={() => go('blog')}
                className="bg-transparent text-ink2 border border-line py-2.75 px-5.5 rounded-full font-sans font-semibold text-[13.5px] cursor-pointer"
              >
                ← More guides
              </button>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-22.5">

            {/* Key facts */}
            <div className="bg-ink rounded-2xl p-5.5">
              <div className="text-2.75 font-extrabold tracking-[.14em] uppercase font-sans mb-4" style={{ color: '#f0a800' }}>
                Key facts
              </div>
              <div className="flex flex-col gap-4">
                {a.facts.map(([n, l], i) => (
                  <div key={i}>
                    <div className="font-sans text-6 font-bold" style={{ color: '#f0a800' }}>{n}</div>
                    <div className="text-[11.5px] font-sans mt-0.5" style={{ color: 'rgba(247,244,236,.65)' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keep reading */}
            <div className="bg-paper border border-line-soft rounded-2xl p-5">
              <div className="text-2.5 font-extrabold tracking-[.14em] uppercase text-dim font-sans mb-3">
                Keep reading
              </div>
              <div className="flex flex-col">
                {related.map(({ slug: rSlug, title, cat, read }, i) => {
                  const info = catInfo(cat)
                  return (
                    <button
                      key={rSlug}
                      onClick={() => go('article', rSlug)}
                      className={`text-left bg-transparent border-none cursor-pointer py-3 ${i ? 'border-t border-line-soft' : ''}`}
                    >
                      <div className="text-2.5 font-extrabold uppercase tracking-[.08em] font-sans mb-1" style={{ color: info.a }}>
                        {info.label}
                      </div>
                      <div className="text-3.5 font-semibold text-ink leading-[1.3] font-sans mb-1">{title}</div>
                      <div className="text-[11.5px] text-dim font-sans">{read}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* CTA card */}
            <div className="rounded-2xl p-5.5 text-white" style={{ background: 'linear-gradient(135deg, #00102e 0%, #1a3a6e 100%)' }}>
              <div className="font-sans text-5 font-semibold text-white leading-[1.2] mb-2.5">
                Ready to make your move?
              </div>
              <p className="text-[12.5px] font-sans leading-[1.6] mb-4" style={{ color: 'rgba(247,244,236,.7)' }}>
                Our bilingual team has helped 12,000+ buyers and investors navigate the DR market.
              </p>
              <button
                onClick={() => go('contact')}
                className="w-full py-2.75 rounded-full bg-coral text-white border-none font-sans font-bold text-sm cursor-pointer"
              >
                Get in touch →
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
