import client from './axios'

export interface PlatformStats {
  active_listings: number
  total_value: number
  realtors: number
  registered_users: number
}

export async function fetchPlatformStats(): Promise<PlatformStats> {
  const res = await client.get<PlatformStats>('/stats/platform')
  return res.data
}
