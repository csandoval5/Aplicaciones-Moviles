'use client'
import { useEffect, useState } from 'react'

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  return token
}
