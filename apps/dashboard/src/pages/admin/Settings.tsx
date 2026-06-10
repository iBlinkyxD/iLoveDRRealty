import { useState } from 'react'
import { Settings, Bell, Shield, Save } from 'lucide-react'
import { TONE, Toggle } from './shared'

export function AdminSettings() {
  const [settings, setSettings] = useState({
    newRegistrations: true,
    autoApprove: false,
    maintenanceMode: false,
    approvalAlerts: true,
    dailyDigest: true,
    require2FA: false,
    publicListings: true,
  })
  const toggleSetting = (k: keyof typeof settings) => setSettings(s => ({ ...s, [k]: !s[k] }))

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

      {/* Platform */}
      <div className="bg-paper border border-line rounded-2xl overflow-hidden">
        <div className="px-5.5 py-4 border-b border-line flex items-center gap-2">
          <Settings size={15} className="text-ink2" />
          <div className="font-sans text-[16px] font-bold text-ink">Platform</div>
        </div>
        <div className="flex flex-col">
          {[
            { key: 'newRegistrations' as const, label: 'Allow new registrations',  sub: 'New users can sign up on the platform'    },
            { key: 'autoApprove'      as const, label: 'Auto-approve listings',     sub: 'Skip manual review for verified realtors' },
            { key: 'maintenanceMode'  as const, label: 'Maintenance mode',          sub: 'Disable public access for all visitors'   },
            { key: 'publicListings'   as const, label: 'Public listing visibility', sub: 'Listings visible without login'           },
          ].map(({ key, label, sub }, i) => (
            <div key={i} className={`flex items-center justify-between px-5.5 py-4 ${i < 3 ? 'border-b border-line-soft' : ''}`}>
              <div>
                <div className="text-[13.5px] font-semibold text-ink">{label}</div>
                <div className="text-[11.5px] text-dim mt-0.5">{sub}</div>
              </div>
              <Toggle on={settings[key]} onToggle={() => toggleSetting(key)} />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications + Security */}
      <div className="bg-paper border border-line rounded-2xl overflow-hidden">
        <div className="px-5.5 py-4 border-b border-line flex items-center gap-2">
          <Bell size={15} className="text-ink2" />
          <div className="font-sans text-[16px] font-bold text-ink">Notifications</div>
        </div>
        <div className="flex flex-col">
          {[
            { key: 'approvalAlerts' as const, label: 'Approval alerts', sub: 'Email when new items need review'  },
            { key: 'dailyDigest'    as const, label: 'Daily digest',     sub: 'Summary email each morning at 8am' },
          ].map(({ key, label, sub }, i) => (
            <div key={i} className={`flex items-center justify-between px-5.5 py-4 ${i === 0 ? 'border-b border-line-soft' : ''}`}>
              <div>
                <div className="text-[13.5px] font-semibold text-ink">{label}</div>
                <div className="text-[11.5px] text-dim mt-0.5">{sub}</div>
              </div>
              <Toggle on={settings[key]} onToggle={() => toggleSetting(key)} />
            </div>
          ))}
        </div>

        <div className="px-5.5 py-4 border-t border-b border-line flex items-center gap-2 mt-2">
          <Shield size={15} className="text-ink2" />
          <div className="font-sans text-[16px] font-bold text-ink">Security</div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-5.5 py-4">
            <div>
              <div className="text-[13.5px] font-semibold text-ink">Require 2FA for admins</div>
              <div className="text-[11.5px] text-dim mt-0.5">Enforce two-factor for all admin accounts</div>
            </div>
            <Toggle on={settings.require2FA} onToggle={() => toggleSetting('require2FA')} />
          </div>
        </div>

        {/* Admin account */}
        <div className="px-5.5 py-4 border-t border-line">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full grid place-items-center text-white text-sm font-bold shrink-0" style={{ background: TONE }}>A</div>
            <div>
              <div className="text-[13.5px] font-semibold text-ink">Demo Admin</div>
              <div className="text-[11.5px] text-dim">admin@demo.do</div>
            </div>
          </div>
          <button className="w-full py-2 rounded-lg border-0 cursor-pointer text-[13px] font-bold text-white flex items-center justify-center gap-2" style={{ background: TONE }}>
            <Save size={13} /> Save changes
          </button>
        </div>
      </div>

    </div>
  )
}
