'use client'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { forgotPassword } from '../api/auth'

export default function ForgotPassword() {
  const { t } = useTranslation('auth')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const inputCls = 'w-full py-3 px-3.5 rounded-xl border border-line bg-paper font-sans text-3.75 text-ink outline-none transition-colors duration-150'

  async function handleSubmit() {
    if (!email) return
    setLoading(true)
    setError('')
    try {
      await forgotPassword(email)
      setDone(true)
    } catch {
      setError(t('forgot_password.toast_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-74px)] flex items-center justify-center bg-paper2 px-4 py-14 font-sans">
      <div className="w-full max-w-105">
        <div className="mb-7 text-center">
          <h1 className="font-sans text-7.5 font-bold text-ink mb-1.5 tracking-[-.02em]">
            {t('forgot_password.heading')}
          </h1>
          <p className="text-[14.5px] text-ink2">{t('forgot_password.sub')}</p>
        </div>

        <div className="bg-paper border border-line rounded-2xl p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="font-sans text-5 font-bold text-ink mb-2">{t('forgot_password.success_heading')}</h2>
              <p className="text-[14px] text-ink2 leading-relaxed mb-6">{t('forgot_password.success_sub')}</p>
              <a href="/login" className="text-xs text-sea font-semibold font-sans">{t('forgot_password.back_login')}</a>
            </div>
          ) : (
            <>
              <div className="mb-5.5">
                <label className="text-xs font-semibold text-ink2 block mb-1.75">{t('forgot_password.email_label')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="you@email.com"
                  className={inputCls}
                  autoFocus
                />
              </div>

              {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading || !email}
                className="w-full py-3.25 rounded-full border-none cursor-pointer bg-coral text-white font-sans text-3.75 font-bold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mb-5"
              >
                {loading ? t('forgot_password.submitting') : t('forgot_password.submit')}
              </button>

              <div className="text-center">
                <a href="/login" className="text-xs text-sea font-semibold font-sans">{t('forgot_password.back_login')}</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
