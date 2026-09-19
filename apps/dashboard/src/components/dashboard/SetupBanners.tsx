import { CalendarDays, Wallet, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { UserInfo } from '../../lib/auth'
import { PAYPAL_ENABLED } from '../../lib/features'

export type SetupKind = 'owner' | 'realtor'

/**
 * What an account still has to connect before it can add listings.
 * Realtors need Calendly. Owners need Calendly and, while PayPal is enabled, a PayPal payout email.
 * Every "add listing" button and the setup banners read this, so they always agree.
 */
export function useListingSetup(user: UserInfo | undefined, kind: SetupKind) {
  const { t } = useTranslation('common')
  const calendlyMissing = !user?.calendly_url
  const paypalMissing = kind === 'owner' && PAYPAL_ENABLED && !user?.paypal_email
  return {
    calendlyMissing,
    paypalMissing,
    canAddListings: !calendlyMissing && !paypalMissing,
    /** Tooltip for a disabled "add listing" button (undefined when nothing is missing). */
    blockedReason: calendlyMissing
      ? t('setup_banner.calendly.tooltip')
      : paypalMissing
        ? t('setup_banner.paypal.tooltip')
        : undefined,
  }
}

const BANNERS: Record<'calendly' | 'paypal', {
  Icon: LucideIcon; bg: string; border: string; iconBg: string; accent: string
}> = {
  calendly: { Icon: CalendarDays, bg: '#f0f7ff', border: '#bfdbfe', iconBg: '#006BFF18', accent: '#006BFF' },
  paypal:   { Icon: Wallet,       bg: '#fffbeb', border: '#fde68a', iconBg: '#f59e0b1a', accent: '#d97706' },
}

interface Props {
  kind: SetupKind
  user: UserInfo | undefined
  go: (v: string) => void
  /** Skip the Calendly banner on screens that already show their own full-page Calendly prompt. */
  hideCalendly?: boolean
}

/** Reminder banners for the integrations required before adding listings. Renders nothing once everything is connected. */
export function SetupBanners({ kind, user, go, hideCalendly = false }: Props) {
  const { t } = useTranslation('common')
  const { calendlyMissing, paypalMissing } = useListingSetup(user, kind)

  const missing: ('calendly' | 'paypal')[] = []
  if (calendlyMissing && !hideCalendly) missing.push('calendly')
  if (paypalMissing) missing.push('paypal')
  if (missing.length === 0) return null

  return (
    <div className="flex flex-col gap-3 mb-5" data-testid="setup-banners">
      {missing.map(key => {
        const { Icon, bg, border, iconBg, accent } = BANNERS[key]
        return (
          <div
            key={key}
            data-testid={`setup-banner-${key}`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border"
            style={{ background: bg, borderColor: border }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: iconBg }}>
              <Icon size={16} style={{ color: accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-ink">{t(`setup_banner.${key}.title`)}</div>
              <div className="text-[11.5px] text-dim mt-0.5">{t(`setup_banner.${key}.desc`)}</div>
            </div>
            <button
              onClick={() => go('settings:connections')}
              className="shrink-0 px-3.5 py-1.5 rounded-lg text-[12px] font-bold text-white border-0 cursor-pointer"
              style={{ background: accent }}
            >
              {t(`setup_banner.${key}.btn`)}
            </button>
          </div>
        )
      })}
    </div>
  )
}
