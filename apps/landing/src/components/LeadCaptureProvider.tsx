'use client'
import { useState, useEffect, useRef } from 'react'
import LeadCaptureModal from './LeadCaptureModal'

const STORAGE_KEY = 'lead_modal_dismissed'
const AUTO_DELAY_MS = 8000

export default function LeadCaptureProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return
    timerRef.current = setTimeout(() => setOpen(true), AUTO_DELAY_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

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
