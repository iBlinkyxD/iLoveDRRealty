'use client'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../i18n'

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()

  useEffect(() => {
    const saved = localStorage.getItem('ildr_lang')
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved)
    }
  }, [])

  return <>{children}</>
}
