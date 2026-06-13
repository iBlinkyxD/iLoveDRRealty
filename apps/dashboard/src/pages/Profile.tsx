import { useRef, useState } from 'react'
import { Camera, Save } from 'lucide-react'
import { PhoneInput } from 'react-international-phone'
import { isValidPhoneNumber } from 'libphonenumber-js'
import 'react-international-phone/style.css'
import toast from 'react-hot-toast'
import type { Role } from '../App'
import type { UserInfo } from '../lib/auth'
import { updateProfile, uploadAvatar } from '../api/auth'

const inp = 'w-full px-3 py-2.5 rounded-lg border border-line bg-white text-[13.5px] text-ink outline-none transition-colors focus:border-[#0d9488] disabled:bg-[#f4f5f7] disabled:text-dim'

export function Profile({ user, role, tone }: { user: UserInfo; role: Role; tone: string }) {
  const [displayName, setDisplayName] = useState(user.display_name)
  const [phone, setPhone] = useState(user.phone ?? '')
  const [avatarSrc, setAvatarSrc] = useState(user.avatar_url ?? '')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const initials = (displayName || user.display_name || user.email)[0].toUpperCase()

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setAvatarSrc(preview)
    setAvatarUploading(true)
    try {
      const { avatar_url } = await uploadAvatar(file)
      setAvatarSrc(avatar_url)
      toast.success('Profile picture updated')
    } catch (err: unknown) {
      setAvatarSrc(user.avatar_url ?? '')
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setAvatarUploading(false)
      e.target.value = ''
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) { toast.error('Full name is required'); return }
    if (phone && !isValidPhoneNumber(phone)) { toast.error('Enter a valid phone number'); return }
    setSaving(true)
    try {
      await updateProfile({ display_name: displayName.trim(), phone: phone || undefined })
      toast.success('Profile saved')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-paper border border-line rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="px-5.5 py-4 border-b border-line flex items-center gap-2">
          <Camera size={15} className="text-ink2" />
          <div className="font-sans text-[16px] font-bold text-ink">Profile</div>
        </div>

        {/* Avatar + identity */}
        <div className="px-5.5 py-5 border-b border-line flex items-center gap-4">
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={avatarUploading}
              className="w-16 h-16 rounded-full overflow-hidden border-2 border-line cursor-pointer bg-transparent p-0 relative group disabled:opacity-70 disabled:cursor-wait"
              title="Change profile picture"
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full grid place-items-center text-white text-xl font-bold"
                  style={{ background: `linear-gradient(135deg,${tone},${tone}aa)` }}
                >
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
                {avatarUploading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Camera size={16} className="text-white" />
                }
              </div>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <div className="font-sans text-[17px] font-bold text-ink">{displayName || user.display_name}</div>
            <div className="text-[12.5px] text-dim mt-0.5">{role} · {user.email}</div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={avatarUploading}
              className="mt-1.5 text-[11.5px] font-semibold border-0 bg-transparent cursor-pointer p-0 transition-opacity disabled:opacity-50"
              style={{ color: tone }}
            >
              {avatarUploading ? 'Uploading…' : 'Change photo'}
            </button>
          </div>
        </div>

        {/* Editable form */}
        <form onSubmit={handleSave} className="px-5.5 py-5 flex flex-col gap-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-dim uppercase tracking-wide mb-1.5">Full name</label>
              <input
                className={inp}
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your name"
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-dim uppercase tracking-wide mb-1.5">Phone</label>
              <PhoneInput
                defaultCountry="do"
                value={phone}
                onChange={setPhone}
                inputClassName="!w-full !px-3 !py-2.5 !rounded-r-lg !border-line !bg-white !text-[13.5px] !text-ink !outline-none focus:!border-[#0d9488] !h-auto"
                countrySelectorStyleProps={{
                  buttonClassName: '!border-line !bg-white !rounded-l-lg !h-auto !px-2.5 !py-2.5',
                }}
                style={{ '--react-international-phone-border-radius': '0.5rem' } as React.CSSProperties}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-dim uppercase tracking-wide mb-1.5">Email</label>
              <input className={inp} value={user.email} disabled />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-dim uppercase tracking-wide mb-1.5">Role</label>
              <input className={inp} value={role} disabled />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white border-0 cursor-pointer transition-opacity disabled:opacity-60"
              style={{ background: tone }}
            >
              <Save size={13} />
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
