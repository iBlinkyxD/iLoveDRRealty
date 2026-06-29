'use client'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNav } from '../hooks/useNav'
import { ARTICLES, GUIDES, EDITOR_PICKS, FEATURED, catInfo } from '../data/blogData'
import { ARTICLES_ES, CARDS_ES } from '../data/blogData.es'

// Parse inline internal-link markup: [[Label|page]] or [[Label|article|slug]]
function renderRich(text: string, go: ReturnType<typeof useNav>, color: string): ReactNode {
  const parts = text.split(/(\[\[[^\]]+\]\])/g)
  return parts.map((part, i) => {
    const m = part.match(/^\[\[(.+?)\]\]$/)
    if (!m) return part
    const [label, page, slug] = m[1].split('|')
    return (
      <button
        key={i}
        onClick={() => go(page, slug)}
        className="bg-transparent border-none p-0 cursor-pointer font-semibold underline underline-offset-2 font-sans"
        style={{ color }}
      >
        {label}
      </button>
    )
  })
}

export default function ArticleDetail({ slug, lang }: { slug: string; lang?: 'en' | 'es' }) {
  const go = useNav()
  const { i18n } = useTranslation('blog')
  // When `lang` is passed (dedicated /es route) the article renders that language
  // deterministically; otherwise it follows the client's active language.
  const lng: 'en' | 'es' = lang ?? (i18n.language.startsWith('es') ? 'es' : 'en')
  const isEs = lng === 'es'
  const t = i18n.getFixedT(lng, 'blog')
  // Article-to-article links stay in Spanish (/es/article/...) only when a
  // translation exists; otherwise fall back to the English article URL.
  const navTo = (page: string, target?: string) =>
    isEs && page === 'article' && target && ARTICLES_ES[target]
      ? go('es/article', target)
      : go(page, target)
  const a = (isEs ? ARTICLES_ES[slug] : undefined) ?? ARTICLES[slug]

  if (!a) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="text-ink2 text-4.5 mb-4">{t('article.not_found')}</div>
          <button
            onClick={() => go('blog')}
            className="bg-coral text-white border-none py-2.5 px-6 rounded-full font-bold cursor-pointer font-sans text-sm"
          >
            {t('article.back')}
          </button>
        </div>
      </div>
    )
  }

  const catColor = catInfo(a.catKey).a
  const trTitle = (s: string, fallback: string) => (isEs && CARDS_ES[s]?.title) || fallback

  // Related: up to 3 articles from all slugs, excluding current
  const allSlugs = [
    { slug: FEATURED.slug, title: trTitle(FEATURED.slug, FEATURED.title), cat: 'Buying', read: isEs ? (CARDS_ES[FEATURED.slug]?.read ?? FEATURED.read) : FEATURED.read },
    ...EDITOR_PICKS.map(p => ({ slug: p.slug, title: trTitle(p.slug, p.title), cat: p.cat, read: `${p.read} ${t('article.read_label')}` })),
    ...GUIDES.map(g => ({ slug: g.slug, title: trTitle(g.slug, g.title), cat: g.cat, read: `${g.read} ${t('article.read_label')}` })),
  ]
  const related = allSlugs
    .filter(s => s.slug !== slug)
    .filter((s, i, arr) => arr.findIndex(x => x.slug === s.slug) === i)
    .slice(0, 3)

  return (
    <div lang={lng} className="bg-paper min-h-screen font-sans">
      <div className="max-w-310 mx-auto px-4 sm:px-7 pt-5 sm:pt-7 pb-14 sm:pb-20">

        {/* Back */}
        <button
          onClick={() => go('blog')}
          className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-ink2 text-3.25 font-medium font-sans mb-7 hover:text-ink transition-colors"
        >
          {t('article.back')}
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
              <img
                src="/iLoveDRRealty_Icon.png"
                alt="I Love DR Realty"
                className="w-9.5 h-9.5 rounded-full object-contain bg-white border border-line-soft shrink-0 p-0.5"
              />
              <div>
                <div className="text-3.5 font-bold text-ink font-sans">{a.author}</div>
                <div className="text-[11.5px] text-dim font-sans">{a.role} · {a.read} {t('article.read_label')}{a.reads && a.reads !== '—' ? ` · ${a.reads} ${t('article.reads_label')}` : ''}</div>
              </div>
            </div>

            {/* Hero image */}
            <div
              className="mt-6 mb-8 rounded-2xl overflow-hidden h-52 sm:h-72 lg:h-80 bg-paper2"
              style={{ backgroundImage: `url(${a.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />

            {/* Body */}
            <div>
              {a.body.map((block, i) => {
                switch (block[0]) {
                  case 'h':
                    return (
                      <h2 key={i} className="font-sans text-6 font-semibold text-ink mt-8 mb-3 leading-[1.2]">
                        {block[1]}
                      </h2>
                    )
                  case 'h3':
                    return (
                      <h3 key={i} className="font-sans text-5 font-semibold text-ink mt-6 mb-2.5 leading-tight">
                        {block[1]}
                      </h3>
                    )
                  case 'p':
                    return (
                      <p key={i} className="text-4 text-ink2 leading-[1.75] mb-4 font-sans">
                        {renderRich(block[1], navTo, catColor)}
                      </p>
                    )
                  case 'ul':
                    return (
                      <ul key={i} className="list-disc pl-5.5 mb-5 flex flex-col gap-2">
                        {block[1].map((li, j) => (
                          <li key={j} className="text-4 text-ink2 leading-[1.7] font-sans">
                            {renderRich(li, navTo, catColor)}
                          </li>
                        ))}
                      </ul>
                    )
                  case 'ol':
                    return (
                      <ol key={i} className="list-decimal pl-5.5 mb-5 flex flex-col gap-2.5 marker:font-bold marker:text-ink">
                        {block[1].map((li, j) => (
                          <li key={j} className="text-4 text-ink2 leading-[1.7] font-sans pl-1">
                            {renderRich(li, navTo, catColor)}
                          </li>
                        ))}
                      </ol>
                    )
                  case 'tip':
                    return (
                      <div
                        key={i}
                        className="my-6 rounded-xl p-4 sm:p-5 flex gap-3.5 items-start"
                        style={{ background: `${catColor}0d`, borderLeft: `4px solid ${catColor}` }}
                      >
                        <span className="text-5.5 leading-none shrink-0 mt-0.5">💡</span>
                        <div>
                          <div className="text-2.5 font-extrabold tracking-[.12em] uppercase font-sans mb-1.5" style={{ color: catColor }}>
                            {t('article.expert_tip')}
                          </div>
                          <p className="text-3.75 text-ink2 leading-[1.7] font-sans m-0">
                            {renderRich(block[1], navTo, catColor)}
                          </p>
                        </div>
                      </div>
                    )
                  case 'table':
                    return (
                      <div key={i} className="my-6 overflow-x-auto rounded-xl border border-line-soft">
                        <table className="w-full border-collapse text-left font-sans text-3.5">
                          <thead>
                            <tr style={{ background: catColor }}>
                              {block[1].headers.map((h, j) => (
                                <th key={j} className="text-white font-semibold py-3 px-3.5 text-3.25">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block[1].rows.map((row, r) => (
                              <tr key={r} className={r % 2 ? 'bg-paper2' : 'bg-paper'}>
                                {row.map((cell, ci) => (
                                  <td key={ci} className={`py-2.75 px-3.5 text-ink2 align-top leading-[1.55] ${ci === 0 ? 'font-semibold text-ink' : ''}`}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  case 'cta':
                    return (
                      <button
                        key={i}
                        onClick={() => navTo(block[1].page, block[1].slug)}
                        className="my-5 inline-flex items-center gap-2 bg-coral text-white border-none py-3 px-6 rounded-full font-sans font-bold text-[14px] cursor-pointer"
                      >
                        {block[1].label} →
                      </button>
                    )
                  default:
                    return null
                }
              })}
            </div>

            {/* FAQ */}
            {a.faqs && a.faqs.length > 0 && (
              <div className="mt-10 pt-8 border-t border-line-soft">
                <h2 className="font-sans text-6 font-semibold text-ink mb-5 leading-[1.2]">
                  {t('article.faq_heading')}
                </h2>
                <div className="flex flex-col gap-3">
                  {a.faqs.map(({ q, a: ans }, i) => (
                    <div key={i} className="rounded-xl border border-line-soft p-4 sm:p-5 bg-paper">
                      <div className="font-sans text-4.25 font-semibold text-ink mb-2 leading-[1.3]">{q}</div>
                      <p className="text-3.75 text-ink2 leading-[1.7] font-sans m-0">{ans}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer CTA */}
            <div className="flex flex-wrap gap-2.5 mt-8 pt-7 border-t border-line-soft">
              <button
                onClick={() => go('contact')}
                className="bg-coral text-white border-none py-2.75 px-5.5 rounded-full font-sans font-bold text-[13.5px] cursor-pointer"
              >
                {t('article.talk')}
              </button>
              <button
                onClick={() => go('blog')}
                className="bg-transparent text-ink2 border border-line py-2.75 px-5.5 rounded-full font-sans font-semibold text-[13.5px] cursor-pointer"
              >
                {t('article.more_guides')}
              </button>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-22.5">

            {/* Key facts */}
            <div className="bg-ink rounded-2xl p-5.5">
              <div className="text-2.75 font-extrabold tracking-[.14em] uppercase font-sans mb-4" style={{ color: '#f0a800' }}>
                {t('article.key_facts')}
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
                {t('article.keep_reading')}
              </div>
              <div className="flex flex-col">
                {related.map(({ slug: rSlug, title, cat, read }, i) => {
                  const info = catInfo(cat)
                  return (
                    <button
                      key={rSlug}
                      onClick={() => navTo('article', rSlug)}
                      className={`text-left bg-transparent border-none cursor-pointer py-3 ${i ? 'border-t border-line-soft' : ''}`}
                    >
                      <div className="text-2.5 font-extrabold uppercase tracking-[.08em] font-sans mb-1" style={{ color: info.a }}>
                        {t(`cats.${cat}`)}
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
                {t('article.cta_title')}
              </div>
              <p className="text-[12.5px] font-sans leading-[1.6] mb-4" style={{ color: 'rgba(247,244,236,.7)' }}>
                {t('article.cta_body')}
              </p>
              <button
                onClick={() => go('contact')}
                className="w-full py-2.75 rounded-full bg-coral text-white border-none font-sans font-bold text-sm cursor-pointer"
              >
                {t('article.cta_button')}
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
