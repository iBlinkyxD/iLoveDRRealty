import client from './axios'
import type { UserInfo } from '../lib/auth'

export async function getMe(): Promise<UserInfo> {
  const res = await client.get<UserInfo>('/auth/me')
  return res.data
}

export async function logout(): Promise<void> {
  await client.post('/auth/logout')
}
