export interface UserInfo {
  id: string
  user_code: number | null
  email: string
  role: string
  display_name: string
  phone?: string
  avatar_url?: string
  has_password?: boolean
  has_google?: boolean
  calendly_url?: string
}
