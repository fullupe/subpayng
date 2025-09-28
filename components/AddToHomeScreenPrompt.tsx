// components/AddToHomeScreenPrompt.tsx
'use client'

import { useEffect, useState } from 'react'
import { X, Download, Smartphone } from 'lucide-react'

export default function AddToHomeScreenPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true)
      return
    }

    // Check if iOS
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    setIsIOS(isIos)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show prompt after 3 seconds if not dismissed before
      const hasDismissed = localStorage.getItem('a2hs-dismissed')
      if (!hasDismissed) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowPrompt(false)
      }
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('a2hs-dismissed', 'true')
  }

  if (isStandalone || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-in slide-in-from-bottom duration-300">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Install ShopMe App</h3>
              <p className="text-sm text-gray-600 mt-1">
                {isIOS 
                  ? 'Tap the share button and "Add to Home Screen"'
                  : 'Install our app for a better experience'
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Install App
          </button>
        )}
        
        {isIOS && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              📱 Tap <span className="font-bold">Share</span> → <span className="font-bold">Add to Home Screen</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}