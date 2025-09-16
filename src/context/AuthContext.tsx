import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

type Role = 'admin' | 'partner' | 'patient'
type Profile = { id: string; role: Role; full_name: string | null }

type AuthState = {
  user: User | null
  profile: Profile | null
  role: Role | null
  loading: boolean
  signInWithOtp: (email: string) => Promise<void>
  verifyOtp: (email: string, token: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_evt, sess) => {
      setSession(sess)
    })
    return () => { listener.subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadProfile(uid: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, full_name')
        .eq('id', uid)
        .maybeSingle()
      if (error) console.error(error)
      if (cancelled) return

      if (data) {
        setProfile(data as Profile)
      } else {
        const insert = await supabase.from('profiles').insert({
          id: uid, role: 'patient', full_name: null
        }).select('id, role, full_name').single()
        if (!insert.error) setProfile(insert.data as Profile)
      }
    }
    if (session?.user?.id) loadProfile(session.user.id)
    else setProfile(null)
    return () => { cancelled = true }
  }, [session?.user?.id])

  const value: AuthState = useMemo(() => ({
    user: session?.user ?? null,
    profile,
    role: profile?.role ?? null,
    loading,
    signInWithOtp: async (email: string) => {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
    },
    verifyOtp: async (email: string, token: string) => {
      const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
      if (error) throw error
    },
    signOut: async () => {
      await supabase.auth.signOut()
      setProfile(null)
    }
  }), [session, profile, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
