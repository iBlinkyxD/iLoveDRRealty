'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import LeadCaptureModal from './LeadCaptureModal'

const STORAGE_KEY = 'lead_modal_dismissed'
const AUTO_DELAY_MS = 8000
const EXCLUDED_PATHS = new Set(['/login', '/signup', '/forgot-password', '/reset-password'])

export default function LeadCaptureProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (EXCLUDED_PATHS.has(pathname)) { setOpen(false); return }
    if (sessionStorage.getItem(STORAGE_KEY)) return
    timerRef.current = setTimeout(() => setOpen(true), AUTO_DELAY_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [pathname])

  function handleClose() {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  return (
    <>
      {children}
      <LeadCaptureModal open={open} onClose={handleClose} />

    </>
  )
}
