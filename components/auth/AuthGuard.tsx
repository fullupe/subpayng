'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (loading) return

    // User not authenticated
    if (!user) {
      router.push('/login')
      return
    }

    // User authenticated but profile not loaded yet
    if (!profile) {
      return
    }

    // Check authorization
    if (requireAdmin && profile.role !== 'admin') {
      router.push('/subscriptions')
      return
    }

    if (!requireAdmin && profile.role === 'admin') {
      router.push('/dashboard')
      return
    }

    // All checks passed - user is authorized
    setIsAuthorized(true)
  }, [user, profile, loading, requireAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}