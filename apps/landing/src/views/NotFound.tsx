'use client'
import { useNav } from '../hooks/useNav'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const go = useNav()
  const { t } = useTranslation('not_found')

  return (
    <div className="bg-paper min-h-screen font-sans flex items-center justify-center px-5 py-12">
      <div className="max-w-lg w-full text-center">

        {/* Large 404 */}
        <div
          className="font-sans font-bold leading-none mb-2 select-none"
          style={{ fontSize: 'clamp(100px, 22vw, 180px)', color: 'rgba(230,80,60,.12)' }}
        >
          404
        </div>

        {/* Palm icon */}
        <div className="text-5xl mb-5">🌴</div>

        <h1 className="font-sans text-[clamp(22px,4vw,34px)] font-bold text-ink leading-[1.1] tracking-[-0.02em] mb-3">
          {t('heading')}
        </h1>

        <p className="text-4 text-ink2 leading-[1.7] mb-8 font-sans max-w-sm mx-auto">
          {t('sub')}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center mb-10">
          <button
            onClick={() => go('landing')}
            className="bg-coral text-white border-none py-3 px-6 rounded-full font-sans font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            {t('back_home')}
          </button>
          <button
            onClick={() => go('search')}
            className="bg-transparent text-ink border border-line py-3 px-6 rounded-full font-sans font-semibold text-sm cursor-pointer hover:border-ink transition-colors w-full sm:w-auto"
          >
            {t('browse')}
          </button>
          <button
            onClick={() => go('contact')}
            className="bg-transparent text-ink2 border border-line-soft py-3 px-6 rounded-full font-sans font-semibold text-sm cursor-pointer hover:text-ink transition-colors w-full sm:w-auto"
          >
            {t('contact')}
          </button>
        </div>

        {/* Quick links */}
        <div className="border-t border-line-soft pt-7">
          <p className="text-2.75 font-extrabold tracking-[.12em] uppercase text-dim font-sans mb-4">
            {t('popular')}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {[
              { label: t('links.buy'), page: 'buying' },
              { label: t('links.sell'), page: 'selling' },
              { label: t('links.calculator'), page: 'calculator' },
              { label: t('links.blog'), page: 'blog' },
              { label: t('links.team'), page: 'team' },
            ].map(({ label, page }) => (
              <button
                key={page}
                onClick={() => go(page)}
                className="text-3.25 text-coral font-semibold font-sans bg-transparent border-none cursor-pointer hover:underline"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
