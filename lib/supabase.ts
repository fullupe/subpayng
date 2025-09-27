import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const createClientSupabase = () => createClientComponentClient()

export type Profile = {
  id: string
  name: string
  role: 'user' | 'admin'
  created_at: string
}

export type Decoder = {
  id: string
  user_id: string
  name: string
  number: string
  type: 'DSTV' | 'GoTv' | 'SLTv'
  created_at: string
}

export type Subscription = {
  id: string
  user_id: string
  decoder_id: string
  name: string
  card_number: string
  subscription_type: 'DSTV' | 'GoTv' | 'SLTv'
  package: string
  duration: string
  amount_paid: number
  momo_ref?: string
  status: 'pending' | 'paid'
  created_at: string
  decoder?: Decoder
  profile?: Profile
}

// Package options and pricing
export const PACKAGES = {
  DSTV: {
    'Padi': { price: 4400, duration: '1 month' },
    'Padi-1Extra View': { price: 6560, duration: '1 month' },
    'Yanga': { price: 6000, duration: '1 month' },
    'Yanga-1Extra View': { price: 8160, duration: '1 month' },
    'Confam': { price: 11000, duration: '1 month' },
    'Confam-1Extra View': { price: 13160, duration: '1 month' },
    'Compact': { price: 19000, duration: '1 month' },
    'Compact-1Extra View': { price: 21160, duration: '1 month' },
    'Compact Plus': { price: 30000, duration: '1 month' },
    'CompactPlus-1Extra View': { price: 32160, duration: '1 month' },
    'Premium': { price: 44500, duration: '1 month' },
    'Premium-1 Extra': { price: 46660, duration: '1 month' }
  },
 
  SLTv: {
    'Basic': { price: 2500, duration: '1 month' },
    'Gold': { price: 5000, duration: '1 month' },
  }
}

export const DURATION_OPTIONS = [
  { value: '1', label: '1 Month', multiplier: 1 },
  { value: '3', label: '3 Months', multiplier: 3 },
  { value: '6', label: '6 Months', multiplier: 6 },
  { value: '12', label: '12 Months', multiplier: 12 }
]