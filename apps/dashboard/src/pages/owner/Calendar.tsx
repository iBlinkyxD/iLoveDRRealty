import { Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/dashboard/shared'

export function OwnerCalendar({ tone }: { tone: string }) {
  const { t } = useTranslation('owner')
  return (
    <Card title={<><Calendar size={14} /> {t('calendar_page.title')}</>} sub={t('calendar_page.coming_soon_label')}>
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${tone}15` }}>
          <Calendar size={26} style={{ color: tone }} />
        </div>
        <div className="text-center">
          <div className="text-[15px] font-bold text-ink mb-1">{t('calendar_page.title')}</div>
          <p className="text-[13px] text-dim leading-[1.6] max-w-65">
            {t('calendar_page.desc')}
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl text-[12px] font-semibold" style={{ background: `${tone}15`, color: tone }}>
          {t('calendar_page.coming_soon_badge')}
        </div>
      </div>
    </Card>
  )
}
