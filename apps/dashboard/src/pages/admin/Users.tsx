import { useState } from 'react'
import { Search, Eye, Mail, UserCheck } from 'lucide-react'
import { TONE, USERS, ROLE_COLOR, STATUS_STYLE } from './shared'

export function AdminUsers() {
  const [userSearch, setUserSearch] = useState('')
  const filteredUsers = USERS.filter(u =>
    !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  return (
    <div className="bg-paper border border-line rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center gap-2 px-4 sm:px-5.5 py-4 border-b border-line">
        <div className="font-sans text-[17px] font-bold text-ink">All users</div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-white">
            <Search size={13} className="text-dim" />
            <input
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              placeholder="Search name or email…"
              className="text-xs border-0 outline-none bg-transparent text-ink placeholder:text-dim w-36 sm:w-44"
            />
          </div>
          <button className="text-xs font-bold px-3.5 py-1.5 rounded-lg border-0 cursor-pointer text-white" style={{ background: TONE }}>
            + Invite user
          </button>
        </div>
      </div>

      {/* Mobile card rows */}
      <div className="sm:hidden divide-y divide-line">
        {filteredUsers.map((u, i) => {
          const st = STATUS_STYLE[u.status]
          const rc = ROLE_COLOR[u.role] ?? '#7884a0'
          return (
            <div key={i} className="px-4 py-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full grid place-items-center text-white text-xs font-bold shrink-0" style={{ background: rc }}>
                    {u.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold text-ink">{u.name}</div>
                    <div className="text-[11px] text-dim truncate">{u.email}</div>
                  </div>
                </div>
                <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full shrink-0" style={{ color: st.color, background: st.bg }}>
                  {st.label}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full" style={{ color: rc, background: `${rc}18` }}>
                  {u.role}
                </span>
                <div className="flex gap-2">
                  {u.status === 'pending' && (
                    <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border-0 cursor-pointer flex items-center gap-1" style={{ background: '#1f7a3d', color: '#fff' }}>
                      <UserCheck size={11} /> Verify
                    </button>
                  )}
                  {u.status === 'suspended' ? (
                    <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-line cursor-pointer flex items-center gap-1 text-ink2">
                      <UserCheck size={11} /> Restore
                    </button>
                  ) : (
                    <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-line cursor-pointer flex items-center gap-1 text-ink2">
                      <Eye size={11} /> View
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr] px-5.5 py-2.5 border-b border-line bg-line-soft">
          {['User', 'Role', 'Joined', 'Status', 'Actions'].map((h, i) => (
            <div key={i} className="text-[11px] font-bold uppercase tracking-[.07em] text-dim">{h}</div>
          ))}
        </div>
        {filteredUsers.map((u, i) => {
          const st = STATUS_STYLE[u.status]
          const rc = ROLE_COLOR[u.role] ?? '#7884a0'
          return (
            <div key={i} className={`grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr] items-center px-5.5 py-3.5 ${i < filteredUsers.length - 1 ? 'border-b border-line-soft' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full grid place-items-center text-white text-xs font-bold shrink-0" style={{ background: rc }}>
                  {u.name[0]}
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold text-ink">{u.name}</div>
                  <div className="text-[11px] text-dim flex items-center gap-1"><Mail size={9} />{u.email}</div>
                </div>
              </div>
              <div>
                <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full" style={{ color: rc, background: `${rc}18` }}>
                  {u.role}
                </span>
              </div>
              <div className="text-[12.5px] text-ink2">{u.joined}</div>
              <div>
                <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full" style={{ color: st.color, background: st.bg }}>
                  {st.label}
                </span>
              </div>
              <div className="flex gap-2">
                {u.status === 'pending' && (
                  <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border-0 cursor-pointer flex items-center gap-1" style={{ background: '#1f7a3d', color: '#fff' }}>
                    <UserCheck size={11} /> Verify
                  </button>
                )}
                {u.status === 'suspended' ? (
                  <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-line cursor-pointer flex items-center gap-1 text-ink2">
                    <UserCheck size={11} /> Restore
                  </button>
                ) : (
                  <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-line cursor-pointer flex items-center gap-1 text-ink2">
                    <Eye size={11} /> View
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="py-10 text-center text-sm text-dim">No users match your search.</div>
      )}
    </div>
  )
}
