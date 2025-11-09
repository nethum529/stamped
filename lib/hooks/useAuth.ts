'use client'

import { useState, useEffect } from 'react'
import { authService } from '@/lib/auth/service'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()

    // Subscribe to auth state changes
    const { data: authListener } = authService.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || 
                session.user.user_metadata?.display_name || 
                session.user.email?.split('@')[0] || 'User',
          avatarUrl: session.user.user_metadata?.avatar_url,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const loadUser = async () => {
    try {
      const currentUser = await authService.getUser()
      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email || '',
          name: currentUser.user_metadata?.full_name || 
                currentUser.user_metadata?.display_name || 
                currentUser.email?.split('@')[0] || 'User',
          avatarUrl: currentUser.user_metadata?.avatar_url,
        })
      }
    } catch (err) {
      console.error('Error loading user:', err)
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, refreshUser: loadUser }
}

