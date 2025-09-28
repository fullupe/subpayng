'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Profile } from './supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return

        setUser(session?.user ?? null)
        
        if (session?.user) {
          await getOrCreateProfile(session.user)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      setUser(session?.user ?? null)
      
      if (session?.user) {
        await getOrCreateProfile(session.user)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const getOrCreateProfile = async (user: User) => {
    try {
      // First, try to get the profile
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // If profile doesn't exist, create one
      if (error && error.code === 'PGRST116') {
        console.log('Profile not found, creating new profile...')
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
              role: 'user'
            }
          ])
          .select()
          .single()

        if (insertError) {
          console.error('Error creating profile:', insertError)
          throw insertError
        }

        profile = newProfile
      } else if (error) {
        console.error('Error fetching profile:', error)
        throw error
      }

      setProfile(profile)
    } catch (error) {
      console.error('Error in getOrCreateProfile:', error)
      // Even if there's an error, we should set loading to false
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      console.error('Error signing in:', error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    user,
    profile,
    loading,
    signInWithGoogle,
    signOut
  }
}