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

export async function unlinkGoogle(): Promise<void> {
  await client.delete('/auth/unlink-google')
}

export async function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  const form = new FormData()
  form.append('file', file)
  const res = await client.post<{ avatar_url: string }>('/auth/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}
