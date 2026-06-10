import { useState, useEffect } from 'react'
import type { UserInfo } from '../lib/auth'
import { getMe } from '../api/auth'

interface UseCurrentUserResult {
  data: UserInfo | null
  loading: boolean
  error: Error | null
}

export function useCurrentUser(): UseCurrentUserResult {
  const [data, setData] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    getMe()
      .then(setData)
      .catch(err => setError(err instanceof Error ? err : new Error('Failed to load user')))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
