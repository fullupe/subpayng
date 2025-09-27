'use client'

import { Subscription } from '@/lib/supabase'
import { Calendar, CircleCheck as CheckCircle, Clock, Tv } from 'lucide-react'

interface SubscriptionListProps {
  subscriptions: Subscription[]
}

export default function SubscriptionList({ subscriptions }: SubscriptionListProps) {
  const getStatusIcon = (status: string) => {
    return status === 'paid' ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <Clock className="w-5 h-5 text-yellow-600" />
    )
  }

  const getStatusColor = (status: string) => {
    return status === 'paid'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800'
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <Tv className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscriptions Yet</h3>
        <p className="text-gray-600">Your subscription requests will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Subscriptions</h2>
      {subscriptions.map((subscription) => (
        <div key={subscription.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(subscription.status)}
              <div>
                <h3 className="font-semibold text-gray-900">{subscription.name}</h3>
                <p className="text-sm text-gray-600">{subscription.subscription_type} - {subscription.package}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
              {subscription.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Card Number</p>
              <p className="font-medium">{subscription.card_number}</p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-medium">{subscription.duration}</p>
            </div>
            <div>
              <p className="text-gray-500">Amount</p>
              <p className="font-medium">GHS {subscription.amount_paid}</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{new Date(subscription.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {subscription.momo_ref && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">MOMO Reference: <span className="font-medium">{subscription.momo_ref}</span></p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}