import { useState, useEffect } from 'react'
import { Lock, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Role } from '../../App'
import { OwnerHome } from './OwnerHome'
import { RealtorHome } from './RealtorHome'
import { getMyUpgradeRequests } from '../../api/upgradeRequests'
import { getMyLeads } from '../../api/leads'
import { OwnerLeadModal, RealtorModal } from '../../pages/buyer/Upgrade'

export function LockedView({ tab, tone, go }: { tab: Role; tone: string; go: (v: string) => void }) {
  const { t } = useTranslation('common')

  const label = tab === 'Owner' ? t('locked.label_owner') : t('locked.label_realtor')
  const desc  = tab === 'Owner' ? t('locked.desc_owner') : t('locked.desc_realtor')

  const [ownerModalOpen, setOwnerModalOpen] = useState(false)
  const [realtorModalOpen, setRealtorModalOpen] = useState(false)
  const [realtorPending, setRealtorPending] = useState(false)
  const [ownerPending, setOwnerPending] = useState(false)

  useEffect(() => {
    if (tab !== 'Realtor') return
    getMyUpgradeRequests().then(reqs => {
      if (reqs.some(r => r.requested_role === 'realtor' && r.status === 'pending')) {
        setRealtorPending(true)
      }
    }).catch(() => {})
  }, [tab])

  useEffect(() => {
    if (tab !== 'Owner') return
    getMyLeads().then(leads => {
      if (leads.some(l => l.type === 'seller_interest' && !l.property_id)) {
        setOwnerPending(true)
      }
    }).catch(() => {})
  }, [tab])

  return (
    <>
    {ownerModalOpen && <OwnerLeadModal onClose={() => setOwnerModalOpen(false)} onDone={() => setOwnerPending(true)} />}
    {realtorModalOpen && (
      <RealtorModal
        onClose={() => setRealtorModalOpen(false)}
        onDone={() => { setRealtorPending(true); setRealtorModalOpen(false) }}
      />
    )}
    <div className="relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none select-none" style={{ opacity: 0.35 }}>
        {tab === 'Owner'   && <OwnerHome   go={() => {}} tone={tone} />}
        {tab === 'Realtor' && <RealtorHome go={() => {}} tone={tone} />}
      </div>

      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(248,249,252,0.72)' }}>
        <div className="text-center max-w-xs px-6 py-8">
          {((tab === 'Realtor' && realtorPending) || (tab === 'Owner' && ownerPending)) ? (
            <>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${tone}18` }}>
                <Clock size={24} style={{ color: tone }} />
              </div>
              <div className="font-sans text-xl font-bold text-ink mb-2">{t('locked.request_submitted')}</div>
              <p className="text-[13px] text-dim leading-[1.55]">
                {tab === 'Owner' ? t('locked.request_pending_owner') : t('locked.request_pending_realtor')}
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${tone}18` }}>
                <Lock size={24} style={{ color: tone }} />
              </div>
              <div className="font-sans text-xl font-bold text-ink mb-2">{t('locked.unlock', { label })}</div>
              <p className="text-[13px] text-dim leading-[1.55] mb-5">{desc}</p>
              {tab === 'Owner' ? (
                <button
                  onClick={() => setOwnerModalOpen(true)}
                  className="px-6 py-2.5 rounded-full text-[13px] font-bold text-white border-none cursor-pointer"
                  style={{ background: tone }}
                >
                  {t('locked.cta_owner')}
                </button>
              ) : (
                <button
                  onClick={() => setRealtorModalOpen(true)}
                  className="px-6 py-2.5 rounded-full text-[13px] font-bold text-white border-none cursor-pointer"
                  style={{ background: tone }}
                >
                  {t('locked.cta_realtor')}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
