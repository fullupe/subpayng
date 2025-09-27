'use client'

import { Decoder } from '@/lib/supabase'
import { Tv, Settings } from 'lucide-react'

interface DecoderCardProps {
  decoder: Decoder | any
  onClick: () => void
}

export default function DecoderCard({ decoder, onClick }: DecoderCardProps) {
  const getTypeColor = (type: string) => {
    return type === 'DSTV' ? 'bg-blue-500' : 'bg-green-500'
  }

  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${getTypeColor(decoder.type)}`}>
            <Tv className="w-6 h-6 text-white" />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(decoder.type)}`}>
            {decoder.type}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">{decoder.name}</h3>
         <div className="font-mono text-xl tracking-wider">
            {decoder.number.match(/.{1,4}/g).join(' ')}
          </div>

       
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-white">Click to subscribe</span>
          <Settings className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>



  )
}