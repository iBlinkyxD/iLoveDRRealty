'use client'
import { useRouter } from 'next/navigation'

export function useNav() {
  const router = useRouter()
  return (page: string) => router.push(page === 'landing' ? '/' : `/${page}`)
}
