import { type ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'

const GRADS = [
  'linear-gradient(135deg,#87ceeb,#0099cc 60%,#006994 100%)',
  'linear-gradient(135deg,#a8e6cf,#3cb371 60%,#2e8b57 100%)',
  'linear-gradient(135deg,#ffd700,#ff8c00 50%,#ff4500 100%)',
  'linear-gradient(135deg,#b8e4f9,#0099cc 60%,#004e89 100%)',
]

export function SceneThumb({ v }: { v: number }) {
  return <div className="w-13 h-10 rounded-lg shrink-0" style={{ background: GRADS[v % GRADS.length] }} />
}

export function Card({ title, sub, action, children, padded = true }: {
  title?: ReactNode; sub?: string; action?: ReactNode; children: ReactNode; padded?: boolean
}) {
  return (
    <div className="bg-paper rounded-2xl border border-line overflow-hidden">
      {title && (
        <div className="flex justify-between items-center px-5.5 py-4.5 border-b border-line">
          <div>
            <div className="font-sans text-base font-bold text-ink flex items-center gap-1.5">{title}</div>
            {sub && <div className="text-[11.5px] text-dim mt-0.5">{sub}</div>}
          </div>
          {action}
        </div>
      )}
      <div className={padded ? 'p-5.5' : ''}>{children}</div>
    </div>
  )
}

export function CardLink({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="text-xs font-semibold text-sea bg-transparent border-0 cursor-pointer">
      {children}
    </button>
  )
}

export function StatusPill({ label, tone: forceTone }: { label: string; tone?: string }) {
  const tone = forceTone ?? (
    label === 'Active' || label === 'Confirmed' || label === 'Replied' ? '#1f7a3d' :
    label === 'Pending' || label === 'Warm'                            ? '#f0a800' :
    label === 'Hot'                                                     ? '#e10f1f' :
    label === 'Saved'                                                   ? '#0b63ab' : '#7884a0'
  )
  return (
    <span className="text-[11px] font-bold px-2.5 py-0.75 rounded-full shrink-0 whitespace-nowrap"
      style={{ color: tone, background: `${tone}18` }}>
      {label}
    </span>
  )
}

export function RoleKpiCard({ Icon, label, value, sub, hl, tone }: {
  Icon: LucideIcon; label: string; value: string; sub: string; hl?: boolean; tone: string
}) {
  return (
    <div className={hl ? 'rounded-xl py-4.5 px-5' : 'bg-paper border border-line rounded-xl py-4.5 px-5'}
      style={hl ? { background: `linear-gradient(135deg, ${tone} 0%, ${tone}cc 100%)` } : undefined}>
      <Icon size={20} className={`mb-2 ${hl ? 'text-white/70' : 'text-dim'}`} />
      <div className={`font-sans text-2xl font-bold leading-none ${hl ? 'text-white' : 'text-ink'}`}>{value}</div>
      <div className={`text-[12.5px] font-semibold mt-1.25 ${hl ? 'text-white/80' : 'text-ink2'}`}>{label}</div>
      <div className={`text-[11px] mt-0.75 ${hl ? 'text-white/55' : 'text-dim'}`}>{sub}</div>
    </div>
  )
}

export const fmtPrice = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`
