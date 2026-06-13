import { X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createAdminUser } from '../../api/admin'
import { TONE } from '../../pages/admin/shared'

const ROLE_OPTIONS = ['buyer', 'owner', 'realtor']
const INPUT_CLS = 'w-full px-3 py-2 rounded-lg border border-line bg-white text-[13px] text-ink outline-none focus:border-coral placeholder:text-dim'
const LABEL_CLS = 'block text-[11.5px] font-semibold text-ink2 mb-1.5'

interface Props {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function AddUserPanel({ open, onClose, onCreated }: Props) {
  const [form, setForm]       = useState({ display_name: '', email: '', password: '', role: 'buyer' })
  const [working, setWorking] = useState(false)

  if (!open) return null

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setWorking(true)
    try {
      await createAdminUser(form)
      onCreated()
      onClose()
      setForm({ display_name: '', email: '', password: '', role: 'buyer' })
      toast.success('User created.')
    } catch (err: any) {
      if (err?.response?.status === 409) toast.error('Email already registered.')
      else toast.error('Failed to create user.')
    } finally {
      setWorking(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <div>
            <div className="font-bold text-[16px] text-ink">Add User</div>
            <div className="text-[12px] text-dim mt-0.5">Create a new platform account</div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-line-soft cursor-pointer border-0 bg-transparent">
            <X size={18} className="text-dim" />
          </button>
        </div>

        <form id="add-user-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <div>
            <label className={LABEL_CLS}>Display Name</label>
            <input
              required
              className={INPUT_CLS}
              value={form.display_name}
              onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Email</label>
            <input
              type="email"
              required
              className={INPUT_CLS}
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Password</label>
            <input
              type="password"
              required
              minLength={8}
              className={INPUT_CLS}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Min 8 characters"
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Role</label>
            <select
              className={INPUT_CLS}
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            >
              {ROLE_OPTIONS.map(r => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>
        </form>

        <div className="px-5 py-4 border-t border-line flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-line text-[13px] font-semibold text-ink2 cursor-pointer hover:bg-line-soft bg-transparent"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-user-form"
            disabled={working}
            className="flex-1 px-4 py-2.5 rounded-xl border-0 text-[13px] font-semibold text-white cursor-pointer disabled:opacity-50"
            style={{ background: TONE }}
          >
            {working ? 'Creating…' : 'Create User'}
          </button>
        </div>
      </div>
    </>
  )
}
