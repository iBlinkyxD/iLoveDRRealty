'use client'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// Used on the dedicated /es/* routes: switches the client UI (Navbar, Footer,
// any client-i18n pages) to Spanish and persists the choice, so a visitor who
// lands on a Spanish article stays in Spanish as they navigate.
export default function EsLangSync() {
  const { i18n } = useTranslation()
  useEffect(() => {
    if (!i18n.language.startsWith('es')) i18n.changeLanguage('es')
    try {
      localStorage.setItem('ildr_lang', 'es')
    } catch {
      /* ignore */
    }
  }, [i18n])
  return null
}
