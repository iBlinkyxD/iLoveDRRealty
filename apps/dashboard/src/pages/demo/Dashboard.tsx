import type { ComponentType } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import type { Role } from '../../App'
import DashLayout from '../../layouts/DashLayout'
import BuyerDash    from './BuyerDash'
import InvestorDash from './InvestorDash'
import OwnerDash    from './OwnerDash'
import RealtorDash  from './RealtorDash'
import AdminDash    from './AdminDash'

const VIEW_MAP: Record<Role, ComponentType<{ go: (v: string) => void; view?: string }>> = {
  Buyer:    BuyerDash,
  Investor: InvestorDash,
  Owner:    OwnerDash,
  Realtor:  RealtorDash,
  Admin:    AdminDash,
}

export default function Dashboard() {
  const { role: roleSlug = '', view = 'home' } = useParams<{ role: string; view?: string }>()
  const navigate = useNavigate()

  const roleKey = (Object.keys(VIEW_MAP) as Role[]).find(
    r => r.toLowerCase() === roleSlug.toLowerCase()
  )

  if (!roleKey) return <Navigate to="/" replace />

  const View = VIEW_MAP[roleKey]
  const go = (v: string) => navigate(v === 'home' ? `/${roleSlug}` : `/${roleSlug}/${v}`)
  const handleLogout = () => navigate('/')

  return (
    <DashLayout role={roleKey} view={view} go={go} onLogout={handleLogout}>
      <View go={go} view={view} />
    </DashLayout>
  )
}
