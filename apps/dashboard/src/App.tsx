import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useCurrentUser } from './hooks/useCurrentUser'
import { logout } from './api/auth'
import DashLayout from './layouts/DashLayout'
import Dashboard from './pages/Dashboard'
import AdminDash from './pages/AdminDash'

const LANDING_URL = import.meta.env.VITE_LANDING_URL ?? 'http://localhost:3000'

export type Role = 'Buyer' | 'Owner' | 'Realtor' | 'Admin'

const ROLE_MAP: Record<string, Role> = {
  buyer: 'Buyer',
  owner: 'Owner',
  realtor: 'Realtor',
  admin: 'Admin',
}

function DashboardPage() {
  const { view = 'home' } = useParams<{ view?: string }>()
  const navigate = useNavigate()
  const { data: user, loading, error, updateUser } = useCurrentUser()

  useEffect(() => {
    if (!loading && (error || !user)) {
      window.location.href = `${LANDING_URL}/login`
    }
  }, [loading, user, error])

  if (loading || !user) return null

  const role: Role = ROLE_MAP[user.role] ?? 'Buyer'
  const go = (v: string, openId?: string) => {
    const path = v === 'home' ? '/' : `/${v}`
    navigate(openId ? `${path}?openId=${encodeURIComponent(openId)}` : path)
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = `${LANDING_URL}/login`
  }

  return (
    <DashLayout role={role} view={view} go={go} onLogout={handleLogout} user={user}>
      {role === 'Admin'
        ? <AdminDash go={go} view={view} user={user} onUserUpdate={updateUser} />
        : <Dashboard go={go} view={view} role={role} user={user} onUserUpdate={updateUser} />
      }
    </DashLayout>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/"       element={<DashboardPage />} />
      <Route path="/:view"  element={<DashboardPage />} />
      <Route path="*"       element={<Navigate to="/" replace />} />
    </Routes>
  )
}
