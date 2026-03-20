import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useKnowledgeStore = defineStore('knowledge', {
  state: () => ({
    articles: [] as any,
    tutorContext: {} as any
  }),
  actions: {
    async fetchArticles() {
      const { data } = await supabase.from('news').select('*')
      this.articles = data || []
    }
  }
})
