import client from './axios'

export interface UpgradeRequest {
  id: string
  user_id: string
  requested_role: 'owner' | 'realtor'
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
}

export interface RealtorQuestionnaire {
  license_number?: string
  territory?: string
  years_experience?: number
  specialties?: string
  bio?: string
}

export async function submitUpgradeRequest(
  requested_role: 'owner' | 'realtor',
  questionnaire?: RealtorQuestionnaire,
): Promise<UpgradeRequest> {
  const res = await client.post<UpgradeRequest>('/upgrade-requests', { requested_role, ...questionnaire })
  return res.data
}

export async function getMyUpgradeRequests(): Promise<UpgradeRequest[]> {
  const res = await client.get<UpgradeRequest[]>('/upgrade-requests/me')
  return res.data
}
