'use client'

import { useState, useEffect } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import { useAuth } from '@/lib/auth'
import { supabase, Subscription } from '@/lib/supabase'
import { LogOut, User, CircleCheck as CheckCircle, Clock, Tv, Users, DollarSign, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const { profile, signOut } = useAuth()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    revenue: 0
  })

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          decoder:decoders(name, number, type),
          profile:profiles(name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setSubscriptions(data || [])
      
      // Calculate stats
      const total = data?.length || 0
      const pending = data?.filter(s => s.status === 'pending').length || 0
      const paid = data?.filter(s => s.status === 'paid').length || 0
      const revenue = data?.filter(s => s.status === 'paid').reduce((sum, s) => sum + Number(s.amount_paid), 0) || 0

      setStats({ total, pending, paid, revenue })
    } catch (error) {
      console.error('Error loading subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSubscriptionStatus = async (id: string, status: 'pending' | 'paid') => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      
      loadSubscriptions()
    } catch (error) {
      console.error('Error updating subscription:', error)
      alert('Error updating subscription status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">ShopMe</h1>
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                  Admin Dashboard
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{profile?.name}</span>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Tv className="w-10 h-10 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">GHS {stats.revenue}</p>
                </div>
                <DollarSign className="w-10 h-10 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">All Subscription Requests</h2>
            </div>

            {subscriptions.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscription Requests</h3>
                <p className="text-gray-600">Subscription requests from clients will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Package
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscriptions.map((subscription) => (
                      <tr key={subscription.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {subscription.profile?.name || subscription.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {subscription.decoder?.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{subscription.subscription_type}</div>
                          <div className="text-sm text-gray-500">Card: {subscription.card_number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{subscription.package}</div>
                          <div className="text-sm text-gray-500">{subscription.duration}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            GHS {subscription.amount_paid}
                          </div>
                          {subscription.momo_ref && (
                            <div className="text-xs text-gray-500">
                              Ref: {subscription.momo_ref}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            subscription.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {subscription.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(subscription.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          {subscription.status === 'pending' ? (
                            <button
                              onClick={() => updateSubscriptionStatus(subscription.id, 'paid')}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Mark as Paid
                            </button>
                          ) : (
                            <button
                              onClick={() => updateSubscriptionStatus(subscription.id, 'pending')}
                              className="text-yellow-600 hover:text-yellow-800 font-medium"
                            >
                              Mark as Pending
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}