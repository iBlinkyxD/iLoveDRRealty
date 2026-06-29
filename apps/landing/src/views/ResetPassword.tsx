'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { resetPassword } from '../api/auth'

export default function ResetPassword() {
  const { t } = useTranslation('auth')
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [expired, setExpired] = useState(false)
  const [validationErr, setValidationErr] = useState('')
  const [apiErr, setApiErr] = useState('')

  useEffect(() => {
    if (!token) window.location.href = '/forgot-password'
  }, [token])

  const inputCls = 'w-full py-3 px-3.5 rounded-xl border border-line bg-paper font-sans text-3.75 text-ink outline-none transition-colors duration-150'

  async function handleSubmit() {
    setValidationErr('')
    setApiErr('')
    if (password.length < 8) { setValidationErr(t('reset_password.err_min')); return }
    if (password !== confirm) { setValidationErr(t('reset_password.err_match')); return }
    setLoading(true)
    try {
      await resetPassword(token, password)
      setDone(true)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('expired')) {
        setExpired(true)
      } else {
        setApiErr(t('reset_password.err_generic'))
      }
    } finally {
      setLoading(false)
    }
  }

  const EyeOpen = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
  const EyeOff = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
    </svg>
  )

  if (!token) return null

  return (
    <div className="min-h-[calc(100vh-74px)] flex items-center justify-center bg-paper2 px-4 py-14 font-sans">
      <div className="w-full max-w-105">
        <div className="mb-7 text-center">
          <h1 className="font-sans text-7.5 font-bold text-ink mb-1.5 tracking-[-.02em]">
            {t('reset_password.heading')}
          </h1>
          {!done && !expired && <p className="text-[14.5px] text-ink2">{t('reset_password.sub')}</p>}
        </div>

        <div className="bg-paper border border-line rounded-2xl p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="font-sans text-5 font-bold text-ink mb-2">{t('reset_password.success_heading')}</h2>
              <p className="text-[14px] text-ink2 leading-relaxed mb-6">{t('reset_password.success_sub')}</p>
              <a
                href="/login"
                className="inline-block bg-coral text-white font-sans text-3.75 font-bold py-3 px-8 rounded-full no-underline"
              >
                {t('reset_password.go_login')}
              </a>
            </div>
          ) : expired ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h2 className="font-sans text-5 font-bold text-ink mb-2">{t('reset_password.err_invalid')}</h2>
              <p className="text-[14px] text-ink2 leading-relaxed mb-6">{t('reset_password.expired_sub')}</p>
              <a href="/forgot-password" className="text-xs text-sea font-semibold font-sans">{t('reset_password.request_new')}</a>
            </div>
          ) : (
            <>
              <div className="mb-4.5">
                <label className="text-xs font-semibold text-ink2 block mb-1.75">{t('reset_password.password_label')}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputCls} pr-10`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer p-0 text-ink2 hover:text-ink transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              <div className="mb-5.5">
                <label className="text-xs font-semibold text-ink2 block mb-1.75">{t('reset_password.confirm_label')}</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="••••••••"
                    className={`${inputCls} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer p-0 text-ink2 hover:text-ink transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              {(validationErr || apiErr) && (
                <p className="text-xs text-red-600 mb-4">{validationErr || apiErr}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || !password || !confirm}
                className="w-full py-3.25 rounded-full border-none cursor-pointer bg-coral text-white font-sans text-3.75 font-bold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('reset_password.submitting') : t('reset_password.submit')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
