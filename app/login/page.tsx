'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Tv, Users, Shield } from 'lucide-react'

export default function LoginPage() {
  const { user, profile, signInWithGoogle, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && profile) {
      if (profile?.role === 'admin') {
        router.push('/dashboard')
      } else {
        router.push('/subscriptions')
      }
    }
  }, [user, profile, router])


  useEffect(() => {
    if (user) {
      // Show A2HS prompt after successful signup
      const timer = setTimeout(() => {
        const event = new Event('showA2HSPrompt')
        window.dispatchEvent(event)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [user])

  //return null




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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4">
              <Tv className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SubPayNg</h1>
            <p className="text-gray-600">DSTV | SLTv & GoTV Subscription Management</p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-gray-700">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm">Manage subscriptions for clients in Ghana</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm">Secure Google authentication</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Tv className="w-5 h-5 text-purple-600" />
              <span className="text-sm">Support for DSTV | SLTv and GoTV packages</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Welcome to ShopMe
            </h2>
            
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}