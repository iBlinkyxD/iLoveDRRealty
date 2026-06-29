import client from './axios'
import type { UserInfo } from '../lib/auth'

export async function getMe(): Promise<UserInfo> {
  const res = await client.get<UserInfo>('/auth/me')
  return res.data
}

export async function logout(): Promise<void> {
  await client.post('/auth/logout')
}

export async function updateProfile(data: { display_name: string; phone?: string }): Promise<{ display_name: string; phone?: string }> {
  const res = await client.put<{ display_name: string; phone?: string }>('/auth/me', data)
  return res.data
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await client.put('/auth/password', { current_password: currentPassword, new_password: newPassword })
}

export async function setPassword(newPassword: string): Promise<void> {
  await client.post('/auth/set-password', { new_password: newPassword })
}

export async function linkGoogle(accessToken: string): Promise<void> {
  await client.post('/auth/link-google', { access_token: accessToken })
}

export async function unlinkGoogle(): Promise<void> {
  await client.delete('/auth/unlink-google')
}

export async function getMyAgent(): Promise<{ realtor_id: string | null; realtor_name: string | null; realtor_email: string | null; realtor_phone: string | null }> {
  const res = await client.get<{ realtor_id: string | null; realtor_name: string | null; realtor_email: string | null; realtor_phone: string | null }>('/auth/me/agent')
  return res.data
}

export async function deactivateAccount(): Promise<void> {
  await client.put('/auth/me/deactivate')
}

export async function requestAccountDeletion(): Promise<void> {
  await client.post('/auth/me/delete-request')
}

export async function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  const form = new FormData()
  form.append('file', file)
  const res = await client.post<{ avatar_url: string }>('/auth/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}
