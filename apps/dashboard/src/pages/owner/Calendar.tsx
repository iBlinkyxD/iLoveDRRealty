import { Calendar, CalendarDays, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/dashboard/shared'
import type { UserInfo } from '../../lib/auth'

export function OwnerCalendar({ user, go }: { user: UserInfo; go: (v: string) => void }) {
  const { t } = useTranslation('owner')
  const calendlyUrl = user.calendly_url ?? null

  if (!calendlyUrl) {
    return (
      <Card title={<><Calendar size={14} /> {t('calendar_page.title')}</>} sub={t('calendar_page.sub')}>
        <div className="flex flex-col items-center justify-center py-14 gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#006BFF]/10">
            <CalendarDays size={26} className="text-[#006BFF]" />
          </div>
          <div className="text-center max-w-72">
            <div className="text-[15px] font-bold text-ink mb-1.5">{t('calendar_page.connect_title')}</div>
            <p className="text-[13px] text-dim leading-[1.65]">{t('calendar_page.connect_desc')}</p>
          </div>
          <button
            onClick={() => go('settings:connections')}
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white border-0 cursor-pointer bg-brand"
          >
            {t('calendar_page.connect_btn')}
          </button>
        </div>
      </Card>
    )
  }

  return (
    <Card
      title={<><Calendar size={14} /> {t('calendar_page.title')}</>}
      sub={
        <span className="flex items-center gap-1.5">
          {t('calendar_page.embed_sub')}
          <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="text-[#006BFF] inline-flex items-center gap-0.5 hover:underline">
            <ExternalLink size={11} />
          </a>
        </span>
      }
    >
      <div className="rounded-xl overflow-hidden border border-line" style={{ height: '680px' }}>
        <iframe
          src={`${calendlyUrl}?hide_gdpr_banner=1&embed_type=inline`}
          width="100%"
          height="100%"
          frameBorder="0"
          title="Calendly scheduling"
        />
      </div>
    </Card>
  )
}
