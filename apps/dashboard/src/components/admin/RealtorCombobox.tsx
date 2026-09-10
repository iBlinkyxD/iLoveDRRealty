import { useEffect, useRef, useState } from 'react'
import { Search, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { AdminUser } from '../../api/admin'
import { TONE } from '../../pages/admin/shared'

export function RealtorCombobox({
  realtors,
  currentId,
  onSelect,
  saving,
}: {
  realtors: AdminUser[]
  currentId: string | null
  onSelect: (id: string) => void
  saving: boolean
}) {
  const { t } = useTranslation('admin')
  const current = realtors.find(r => r.id === currentId)
  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState('')
  const containerRef        = useRef<HTMLDivElement>(null)
  const inputRef            = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const filtered = realtors.filter(r => {
    const name = (r.display_name || r.email).toLowerCase()
    return name.includes(query.toLowerCase())
  })

  function handleOpen() {
    setOpen(true)
    setQuery('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function handleSelect(r: AdminUser) {
    onSelect(r.id)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        onClick={handleOpen}
        disabled={saving}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-line bg-paper text-[13px] cursor-pointer hover:bg-paper2 transition-colors disabled:opacity-50 text-left"
      >
        <span className={current ? 'text-ink font-medium' : 'text-dim'}>
          {current ? (current.display_name || current.email) : t('lead_panel.unassigned')}
        </span>
        {saving
          ? <span className="text-[11px] text-dim">{t('lead_panel.saving')}</span>
          : <Search size={13} className="text-dim shrink-0" />}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-paper border border-line rounded-xl shadow-lg z-10 overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-line-soft">
            <Search size={13} className="text-dim shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('lead_panel.search_realtors_ph')}
              className="flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-dim"
            />
          </div>

          {/* Results */}
          <div className="max-h-48 overflow-y-auto py-1">
            {/* Unassigned option */}
            <button
              onClick={() => { onSelect(''); setOpen(false); setQuery('') }}
              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-dim hover:bg-paper2 cursor-pointer border-0 bg-transparent text-left"
            >
              {!currentId && <Check size={12} style={{ color: TONE }} />}
              <span className={!currentId ? 'font-semibold text-ink' : ''}>{t('lead_panel.unassigned')}</span>
            </button>

            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-[12px] text-dim">{t('lead_panel.no_realtors')}</div>
            ) : filtered.map(r => {
              const label    = r.display_name || r.email
              const isActive = r.id === currentId
              return (
                <button
                  key={r.id}
                  onClick={() => handleSelect(r)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-ink hover:bg-paper2 cursor-pointer border-0 bg-transparent text-left"
                >
                  {isActive && <Check size={12} style={{ color: TONE }} />}
                  <div className="min-w-0">
                    <div className={`truncate ${isActive ? 'font-semibold' : ''}`}>{label}</div>
                    {r.display_name && (
                      <div className="text-[11px] text-dim truncate">{r.email}</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
