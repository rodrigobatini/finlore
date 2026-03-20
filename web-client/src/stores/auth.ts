import { defineStore } from 'pinia'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null,
    loading: false as boolean
  }),
  actions: {
    async initSession() {
      if (!isSupabaseConfigured || !supabase) return
      const { data } = await supabase.auth.getSession()
      this.user = data.session?.user || null
      this.token = data.session?.access_token || null

      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user || null
        this.token = session?.access_token || null
      })
    },

    async signInWithGoogle() {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase nao configurado')
      }
      this.loading = true
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })
      this.loading = false
      if (error) throw error
    },

    async signIn(email: string, password: string) {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase nao configurado')
      }
      this.loading = true
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      this.loading = false
      if (error) throw error
      this.user = data.user
      this.token = data.session?.access_token
    },

    async signOut() {
      if (!isSupabaseConfigured || !supabase) {
        this.user = null
        this.token = null
        return
      }
      await supabase.auth.signOut()
      this.user = null
      this.token = null
    }
  }
})
