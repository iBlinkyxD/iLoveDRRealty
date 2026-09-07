import { useTranslation } from 'react-i18next'
import { REALTOR_PIPELINE, STAGES, STAGE_TONE } from '../../components/dashboard/RealtorHome'

export function Pipeline() {
  const { t } = useTranslation('realtor')
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
      {STAGES.map(stage => {
        const items = REALTOR_PIPELINE.filter(p => p.stage === stage)
        const st = STAGE_TONE[stage]
        const total = items.reduce((s, p) => {
          const n = parseFloat(p.value.replace(/[^0-9.]/g, ''))
          const mult = p.value.includes('T') ? 1_000_000_000_000
            : p.value.includes('B') ? 1_000_000_000
            : p.value.includes('M') ? 1_000_000
            : p.value.includes('K') ? 1_000 : 1
          return s + n * mult
        }, 0)
        return (
          <div key={stage} className="bg-paper border border-line rounded-2xl overflow-hidden">
            <div className="py-3.5 px-4.5 border-b border-line" style={{ background: `${st}10` }}>
              <div className="flex justify-between items-center">
                <div className="font-bold text-[13px] uppercase tracking-widest" style={{ color: st }}>{stage}</div>
                <span className="text-xs font-bold py-0.75 px-2.25 rounded-full" style={{ color: st, background: `${st}20` }}>{items.length}</span>
              </div>
              <div className="text-xs text-dim mt-0.75">
                ${total >= 1_000_000_000_000 ? (total / 1_000_000_000_000).toFixed(2) + 'T'
                  : total >= 1_000_000_000 ? (total / 1_000_000_000).toFixed(2) + 'B'
                  : total >= 1_000_000 ? (total / 1_000_000).toFixed(2) + 'M'
                  : (total / 1_000).toFixed(0) + 'K'} {t('pipeline_page.total')}
              </div>
            </div>
            <div className="p-3.5 flex flex-col gap-2.5">
              {items.map((item, j) => (
                <div key={j} className="bg-[#F8F9FC] border border-line rounded-[10px] py-3 px-3.5 border-l-[3px]" style={{ borderLeftColor: st }}>
                  <div className="text-[13px] font-bold text-ink mb-1">{item.name}</div>
                  <div className="text-[11.5px] text-dim leading-[1.35] mb-1.5">{item.property}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-bold text-brand">{item.value}</span>
                    <button className="text-[11.5px] font-semibold py-1 px-2.5 rounded-lg border border-line bg-white text-ink2 cursor-pointer">{t('pipeline_page.view')}</button>
                  </div>
                </div>
              ))}
              <button className="w-full py-2.25 rounded-lg text-[12.5px] font-semibold cursor-pointer border border-dashed bg-transparent" style={{ borderColor: st, color: st }}>
                {t('pipeline_page.add_deal')}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
