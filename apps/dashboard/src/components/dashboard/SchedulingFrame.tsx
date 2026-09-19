import { ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SCHEDULING_COLOR, SCHEDULING_LABEL, schedulingEmbedUrl, schedulingProvider } from '../../lib/scheduling'

/**
 * Body of the Calendar page: the connected scheduling page inline when the provider allows framing,
 * otherwise a card that opens it in a new tab (Google's `calendar.app.google` short links block iframes).
 */
export function SchedulingFrame({ url }: { url: string }) {
  const { t } = useTranslation('common')
  const provider = schedulingProvider(url)
  const embedUrl = schedulingEmbedUrl(url)

  if (!embedUrl) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-4" data-testid="scheduling-link-card">
        <div className="text-center max-w-80">
          <div className="text-[15px] font-bold text-ink mb-1.5">
            {t('scheduling.link_title', { provider: SCHEDULING_LABEL[provider] })}
          </div>
          <p className="text-[13px] text-dim leading-[1.65]">{t('scheduling.link_desc')}</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white no-underline"
          style={{ background: SCHEDULING_COLOR[provider] }}
        >
          {t('scheduling.open_btn')} <ExternalLink size={13} />
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden border border-line" style={{ height: '680px' }}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        title={`${SCHEDULING_LABEL[provider]} scheduling`}
      />
    </div>
  )
}
