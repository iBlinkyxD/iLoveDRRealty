'use client'
import { useState, useEffect, useRef } from 'react'
import { MessageCircle } from 'lucide-react'
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

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-100 flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold text-white shadow-lg border-0 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{ background: '#e10f1f' }}
        >
          <MessageCircle size={15} />
          Talk to an agent
        </button>
      )}
    </>
  )
}
