'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Decoder, PACKAGES, DURATION_OPTIONS, supabase } from '@/lib/supabase'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  decoder: Decoder | null
  onSubmit: (subscriptionData: {
    package: string
    duration: string
    amount: number
  }) => void
}

interface Rate {
  id: string;
  rate_value: number;
}

export default function SubscriptionModal({ isOpen, onClose, decoder, onSubmit }: SubscriptionModalProps) {
  const [selectedPackage, setSelectedPackage] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('1')
  const [rates, setRates] = useState<Rate[]>([]);


   const fetchRates = async () => {
    const { data, error } = await supabase
      .from('rates')
      .select('*')
      .single()
    
    if (!error && data) {
      setRates(data.rate_value);
    }
  };
    

  useEffect(() => {
    fetchRates();
  }, []);



  if (!decoder) return null

  const packages = PACKAGES[decoder.type]
  //@ts-ignore
  const packagePrice = selectedPackage ? packages[selectedPackage as keyof typeof packages]?.price || 0 : 0
  const durationMultiplier = DURATION_OPTIONS.find(d => d.value === selectedDuration)?.multiplier || 1
  const totalAmount = Math.round((packagePrice/Number(rates)) * durationMultiplier) // will add rate 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPackage && selectedDuration) {
      onSubmit({
        package: selectedPackage,
        duration: `${selectedDuration} month${selectedDuration !== '1' ? 's' : ''}`,
        amount: totalAmount
      })
    }
  }

 




  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Subscribe to Package">
      <div className="space-y-6">
        {/* Decoder Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">{decoder.name}</h4>
          <p className="text-sm text-gray-600">Type: {decoder.type}</p>
          <p className="text-sm text-gray-600">Card: {decoder.number}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Package Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Package
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(packages).map(([name, info]) => (
                <label key={name} className="relative">
                  <input
                    type="radio"
                    name="package"
                    value={name}
                    checked={selectedPackage === name}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPackage === name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="font-semibold text-gray-900">{name}</div>
                    <div className="text-sm text-gray-600">GHS {Math.round(info.price/Number(rates))}/month</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {DURATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Total Amount */}
          {selectedPackage && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-lg font-semibold text-green-800">
                Total Amount: GHS {totalAmount}
              </div>
              <div className="text-sm text-green-600">
                {selectedPackage} package for {selectedDuration} month{selectedDuration !== '1' ? 's' : ''}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedPackage}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}