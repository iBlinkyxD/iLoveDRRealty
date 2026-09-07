'use client'
import { useEffect, useState } from 'react'
import { fetchPlatformStats, type PlatformStats } from '../api/stats'

export function usePlatformStats(): PlatformStats | null {
  const [stats, setStats] = useState<PlatformStats | null>(null)

  useEffect(() => {
    fetchPlatformStats().then(setStats).catch(() => {})
  }, [])

  return stats
}
