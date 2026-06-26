import { AlertTriangle } from 'lucide-react'

interface Props {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  const isDanger  = variant === 'danger'
  const iconColor = isDanger ? '#dc2626' : '#d97706'
  const iconBg    = isDanger ? '#fef2f2' : '#fffbeb'
  const iconBord  = isDanger ? '#fecaca' : '#fde68a'
  const btnBg     = isDanger ? '#dc2626' : '#f59e0b'

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        className="relative bg-white rounded-2xl shadow-xl border border-line w-full max-w-sm p-6 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full grid place-items-center shrink-0 border"
            style={{ background: iconBg, borderColor: iconBord }}
          >
            <AlertTriangle size={18} style={{ color: iconColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-ink">{title}</div>
            <div className="text-[12.5px] text-dim mt-1 leading-relaxed">{description}</div>
          </div>
        </div>

        <div className="flex gap-2.5 justify-end pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-line bg-white text-[13px] font-semibold text-ink cursor-pointer hover:bg-line-soft transition-colors disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl border-0 text-white text-[13px] font-bold cursor-pointer transition-opacity disabled:opacity-60"
            style={{ background: btnBg }}
          >
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
