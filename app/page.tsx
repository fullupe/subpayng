'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function HomePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [redirected, setRedirected] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (redirected) return

    // If loading is complete but we have an unexpected state
    if (!loading) {
      console.log('Auth state:', { user: user?.email, profile: profile?.role, loading })

      if (!user) {
        console.log('No user found, redirecting to login')
        setRedirected(true)
        router.push('/login')
      } else if (user && profile) {
        console.log('User and profile loaded, redirecting based on role')
        setRedirected(true)
        const redirectPath = profile.role === 'admin' ? '/dashboard' : '/subscriptions'
        router.push(redirectPath)
      } else if (user && !profile) {
        // This should not happen normally, but if it does, show error
        console.error('User exists but profile is null - this should not happen')
        setError('Profile loading failed. Please try refreshing the page.')
      }
    }
  }, [user, profile, loading, router, redirected])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
        {user && !profile && (
          <p className="text-sm text-orange-600 mt-2">
            Setting up your profile...
          </p>
        )}
      </div>
    </div>
  )
}