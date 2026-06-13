'use client'
import { useRouter } from 'next/navigation'

export function useNav() {
  const router = useRouter()
  return (page: string, slug?: string, params?: Record<string, string>) => {
    const base = page === 'landing' ? '/' : `/${page}`
    const path = slug ? `${base}/${slug}` : base
    if (params && Object.keys(params).length > 0) {
      router.push(`${path}?${new URLSearchParams(params).toString()}`)
    } else {
      router.push(path)
    }
  }
}
