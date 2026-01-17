// components/WhatsAppFloatingButton.tsx
'use client'

import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'

export default function WhatsAppFloatingButton() {
  const [isExpanded, setIsExpanded] = useState(false)

  const phoneNumber = "2348109016165" // Nigeria number
  const predefinedMessages = [
    { text: "Hello! I need help with my subscription", label: "General Help" },
    { text: "I have a payment issue", label: "Payment Issue" },
    { text: "My subscription is not working", label: "Subscription Issue" },
    { text: "I want to inquire about packages", label: "Package Inquiry" }
  ]

  const handleWhatsAppClick = (customMessage?: string) => {
    const message = customMessage || "Hello! I need help with my subscription"
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
    setIsExpanded(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isExpanded && (
        <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-64 animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Quick Help</h3>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {predefinedMessages.map((msg, index) => (
              <button
                key={index}
                onClick={() => handleWhatsAppClick(msg.text)}
                className="w-full text-left p-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                {msg.label}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handleWhatsAppClick()}
            className="w-full mt-3 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Custom Message
          </button>
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors animate-bounce"
        style={{ animationDuration: '2s' }}
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  )
}