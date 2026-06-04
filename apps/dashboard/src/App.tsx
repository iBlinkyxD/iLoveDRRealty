import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard  from './pages/demo/Dashboard'
import RoleSelect from './pages/demo/RoleSelect'

export type Role = 'Buyer' | 'Investor' | 'Owner' | 'Realtor' | 'Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<RoleSelect />} />
      <Route path="/:role"     element={<Dashboard />} />
      <Route path="/:role/:view" element={<Dashboard />} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  )
}
