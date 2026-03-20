import { defineStore } from 'pinia'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export const useKnowledgeStore = defineStore('knowledge', {
  state: () => ({
    articles: [] as any,
    tutorContext: {} as any
  }),
  actions: {
    async fetchArticles() {
      if (!isSupabaseConfigured || !supabase) {
        this.articles = []
        return
      }
      const { data } = await supabase.from('news').select('*')
      this.articles = data || []
    }
  }
})
