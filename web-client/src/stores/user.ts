import { defineStore } from 'pinia'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export const useUserStore = defineStore('user', {
  state: () => ({
    preferences: {
      level: 'intro',
      topics: [] as string[],
      sources: [] as string[]
    },
    profile: null as any,
    onboardingComplete: false as boolean
  }),
  actions: {
    async loadProfile(userId: string) {
      if (!isSupabaseConfigured || !supabase) return
      const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle()
      this.profile = data || null
      this.onboardingComplete = Boolean(data)
      if (data?.user_level) {
        this.preferences.level = data.user_level
      }
    },

    async saveOnboarding(
      userId: string,
      payload: { level: string; topics: string[]; sources: string[]; email: string; displayName?: string }
    ) {
      this.preferences.level = payload.level
      this.preferences.topics = payload.topics
      this.preferences.sources = payload.sources

      if (!isSupabaseConfigured || !supabase) {
        this.onboardingComplete = true
        return
      }

      await supabase.from('profiles').upsert({
        user_id: userId,
        email: payload.email,
        display_name: payload.displayName || null,
        user_level: payload.level,
        updated_at: new Date().toISOString()
      })

      const { data: topicsData } = await supabase.from('topics').select('id,slug').in('slug', payload.topics)
      const { data: sourcesData } = await supabase.from('sources').select('id,slug').in('slug', payload.sources)

      await supabase.from('user_topics').delete().eq('user_id', userId)
      await supabase.from('user_sources').delete().eq('user_id', userId)

      if (topicsData?.length) {
        await supabase.from('user_topics').insert(
          topicsData.map((t: any) => ({ user_id: userId, topic_id: t.id, weight: 3 }))
        )
      }

      if (sourcesData?.length) {
        await supabase.from('user_sources').insert(
          sourcesData.map((s: any) => ({ user_id: userId, source_id: s.id }))
        )
      }

      this.onboardingComplete = true
    }
  }
})
