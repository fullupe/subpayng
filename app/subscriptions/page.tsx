'use client'

import { useState, useEffect } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import DecoderCard from '@/components/decoders/DecoderCard'
import AddDecoderModal from '@/components/decoders/AddDecoderModal'
import SubscriptionModal from '@/components/subscriptions/SubscriptionModal'
import PaymentModal from '@/components/subscriptions/PaymentModal'
import SubscriptionList from '@/components/subscriptions/SubscriptionList'
import { useAuth } from '@/lib/auth'
import { supabase, Decoder, Subscription } from '@/lib/supabase'
import { Plus, LogOut, User } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

export default function SubscriptionsPage() {
  const { user, profile, signOut } = useAuth()
  const [decoders, setDecoders] = useState<Decoder[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDecoder, setShowAddDecoder] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedDecoder, setSelectedDecoder] = useState<Decoder | null>(null)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)

    const toast = useToast()

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) return

    try {
      // Load decoders
      const { data: decodersData, error: decodersError } = await supabase
        .from('decoders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (decodersError) throw decodersError
      setDecoders(decodersData || [])

      // Load subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (subscriptionsError) throw subscriptionsError
      setSubscriptions(subscriptionsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDecoderClick = (decoder: Decoder) => {
    setSelectedDecoder(decoder)
    setShowSubscription(true)
  }

  const handleSubscriptionSubmit = (data: any) => {
    setSubscriptionData(data)
    setShowSubscription(false)
    setShowPayment(true)
  }

  const handlePaymentComplete = async (momoRef: string) => {
    if (!user || !selectedDecoder || !subscriptionData) return

    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert([
          {
            user_id: user.id,
            decoder_id: selectedDecoder.id,
            name: profile?.name || '',
            card_number: selectedDecoder.number,
            subscription_type: selectedDecoder.type,
            package: subscriptionData.package,
            duration: subscriptionData.duration,
            amount_paid: subscriptionData.amount,
            momo_ref: momoRef,
            status: 'pending'
          }
        ])

      if (error) throw error

      setShowPayment(false)
      setSelectedDecoder(null)
      setSubscriptionData(null)
      loadData()
      //alert('Subscription request submitted successfully!')
       toast.success('subscriptions added successfully!')

    } catch (error) {
      console.error('Error submitting subscription:', error)
      //alert('Error submitting subscription. Please try again.')

       toast.error('Error adding subscriptions. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="sm:flex items-center gap-3 hidden">
                <h1 className="text-2xl font-bold text-gray-900">SubPayNg</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  Client Portal
                </span>
              </div>
              <div className=" flex flex-1  items-center gap-4 justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{profile?.name}</span>
                </div>
                <button
                  onClick={signOut}
                  className="flex  items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Decoders Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Decoders</h2>
              <button
                onClick={() => setShowAddDecoder(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Decoder
              </button>
            </div>

            {decoders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="text-gray-400 mb-4">
                  <Plus className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Decoders Added</h3>
                <p className="text-gray-600 mb-6">Add your first decoder to start managing subscriptions</p>
                <button
                  onClick={() => setShowAddDecoder(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Decoder.
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {decoders.map((decoder) => (
                  <DecoderCard
                    key={decoder.id}
                    decoder={decoder}
                    onClick={() => handleDecoderClick(decoder)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Subscriptions Section */}
          <SubscriptionList subscriptions={subscriptions} />
        </main>

        {/* Modals */}
        <AddDecoderModal
          isOpen={showAddDecoder}
          onClose={() => setShowAddDecoder(false)}
          onSuccess={loadData}
        />

        <SubscriptionModal
          isOpen={showSubscription}
          onClose={() => setShowSubscription(false)}
          decoder={selectedDecoder}
          onSubmit={handleSubscriptionSubmit}
        />

        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          amount={subscriptionData?.amount || 0}
          onPaymentComplete={handlePaymentComplete}
        />
      </div>
    </AuthGuard>
  )
}