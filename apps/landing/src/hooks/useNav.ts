'use client'
import { useRouter } from 'next/navigation'

export function useNav() {
  const router = useRouter()
  return (page: string, slug?: string) => {
    const base = page === 'landing' ? '/' : `/${page}`
    router.push(slug ? `${base}/${slug}` : base)
  }
}
