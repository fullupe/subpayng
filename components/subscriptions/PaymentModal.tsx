'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Smartphone, CreditCard } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  onPaymentComplete: (momoRef: string) => void
}

export default function PaymentModal({ isOpen, onClose, amount, onPaymentComplete }: PaymentModalProps) {
  const [momoRef, setMomoRef] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!momoRef.trim()) return

    setLoading(true)
    // Simulate payment processing
    setTimeout(() => {
      onPaymentComplete(momoRef.trim())
      setMomoRef('')
      setLoading(false)
    }, 1500)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Instructions">
      <div className="space-y-6">
        {/* Payment Amount */}
        <div className="text-center bg-blue-50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">GHS {amount}</div>
          <div className="text-sm text-gray-600">Total Amount to Pay</div>
        </div>

        {/* Payment Instructions */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Smartphone className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
  <h4 className="font-semibold text-gray-900 mb-3 text-lg">MTN Mobile Money Payment Instructions</h4>
  
  <div className="space-y-3">
    <div className="flex items-start">
      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
      <p className="text-sm text-gray-700">
        Dial <span className="font-mono bg-white px-2 py-1 rounded border">*170#</span>
      </p>
    </div>

    <div className="flex items-start">
      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
      <p className="text-sm text-gray-700">
        Select <span className="font-semibold">Option 1</span> (Transfer Money)
      </p>
    </div>

    <div className="flex items-start">
      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
      <p className="text-sm text-gray-700">
        Select <span className="font-semibold">Option 1</span> (MoMo User)
      </p>
    </div>

    <div className="flex items-start">
      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">4</span>
      <div>
        <p className="text-sm text-gray-700 font-semibold mb-1">
          Enter This Number: <span className="font-mono text-red-600 bg-white px-2 py-1 rounded border">0242261979</span>
        </p>
        <p className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
          ✅ Please confirm the number and name (<span className="font-bold">FORTUNE360</span>) before proceeding
        </p>
      </div>
    </div>

    <div className="flex items-start">
      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">5</span>
      <p className="text-sm text-gray-700">
        Enter the exact amount: <span className="font-bold text-green-600">GH₵ {amount}</span>
      </p>
    </div>

    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-4">
      <p className="text-lg font-extrabold text-center text-yellow-800 underline">
        ✅ PROCEED TO PAY ✅
      </p>
      <p className="text-sm text-yellow-700 text-center mt-1">
        After payment, enter your MoMo reference number below
      </p>
    </div>
  </div>
</div>
          </div>

       {/*}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <CreditCard className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Vodafone Cash</h4>
              <p className="text-sm text-gray-600 mb-2">
                Dial *110# and send GHS {amount} to:
              </p>
              <div className="font-mono text-lg font-semibold text-blue-600">
                0202123456
              </div>
            </div>
          </div>
         */}

        </div>
      
        {/* Reference Input */}
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Money Reference Code
            </label>
            <input
              type="text"
              value={momoRef}
              onChange={(e) => setMomoRef(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your MOMO reference code"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              You'll receive this after completing the mobile money transaction
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!momoRef.trim() || loading}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}