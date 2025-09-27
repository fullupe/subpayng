'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/hooks/useToast'

interface AddDecoderModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type DecoderType = 'DSTV' | 'SLTv' | 'GoTv';

interface FormData {
  name: string;
  number: string;
  type: DecoderType;
}

export default function AddDecoderModal({ isOpen, onClose, onSuccess }: AddDecoderModalProps) {
    const toast = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    number: '',
    type: 'DSTV', 
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('decoders')
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            number: formData.number,
            type: formData.type
          }
        ])

      if (error) throw error

      setFormData({ name: '', number: '', type: 'DSTV' })
       toast.success('Decoder added successfully!')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding decoder:', error)
       toast.error('Error adding decoder. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Decoder">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Decoder Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Living Room TV"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Decoder Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'DSTV' | 'GoTv' | 'SLTv' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="DSTV">DSTV</option>
            {/*<option value="GoTv">GoTv</option>*/}
            <option value="SLTv">SLTv</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <input
            type="text"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 1234567890"
            required
          />
        </div>

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
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Adding...' : 'Add Decoder'}
          </button>
        </div>
      </form>
    </Modal>
  )
}