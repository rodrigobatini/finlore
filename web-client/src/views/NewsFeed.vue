<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import NewsCard from '@/components/NewsCard.vue'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

interface News {
  id: string
  title: string
  snippet: string
  published_at: string
  url: string
  source?: string
  asset_mentions?: string[]
}

interface Props {
  feedId?: string
  topic?: string
}

const props = defineProps<Props>()
const newsList = ref<News[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const usingMockData = ref(false)

const mockNews: News[] = [
  {
    id: 'mock-1',
    title: 'Banco Central sinaliza pausa no ciclo de juros',
    snippet: 'Mercado reage com alta de setores sensiveis a credito e consumo.',
    published_at: new Date().toISOString(),
    url: 'https://example.com/noticia-1',
    source: 'Mock Feed',
    asset_mentions: ['Selic', 'IBOV']
  },
  {
    id: 'mock-2',
    title: 'Petroleo recua e pressiona petroleiras globais',
    snippet: 'Queda da commodity muda expectativa de caixa para o trimestre.',
    published_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    url: 'https://example.com/noticia-2',
    source: 'Mock Feed',
    asset_mentions: ['Petroleo', 'PETR4']
  },
  {
    id: 'mock-3',
    title: 'Dolar cede com fluxo externo para renda variavel',
    snippet: 'Entrada de capital estrangeiro favorece bolsa e reduz pressao cambial.',
    published_at: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    url: 'https://example.com/noticia-3',
    source: 'Mock Feed',
    asset_mentions: ['USD/BRL', 'B3']
  }
]

const queryTopic = computed(() => {
  const params = new URLSearchParams(window.location.search)
  return params.get('topic') || props.topic || ''
})

const queryFeedId = computed(() => {
  const params = new URLSearchParams(window.location.search)
  return props.feedId || params.get('feed') || ''
})

const pageTitle = computed(() =>
  queryFeedId.value ? `Feed: ${queryFeedId.value}` : `Topico: ${queryTopic.value || 'Geral'}`
)

const fetchNews = async () => {
  loading.value = true
  error.value = null
  usingMockData.value = false

  if (!isSupabaseConfigured || !supabase) {
    usingMockData.value = true
    newsList.value = mockNews
    loading.value = false
    return
  }

  let request = supabase.from('news').select('*').order('published_at', { ascending: false }).limit(50)

  if (queryFeedId.value) {
    request = request.eq('feed_id', queryFeedId.value)
  } else if (queryTopic.value) {
    request = request.ilike('title', `%${queryTopic.value}%`)
  }

  const { data, error: fetchError } = await request

  if (fetchError) {
    usingMockData.value = true
    error.value = `Falha ao carregar do Supabase (${fetchError.message}). Exibindo dados de demonstracao.`
    newsList.value = mockNews
  } else {
    newsList.value = (data || []) as News[]
  }

  loading.value = false
}

const formatDate = (date: string) => {
  const value = new Date(date)
  return Number.isNaN(value.getTime()) ? 'Data indisponivel' : new Intl.DateTimeFormat('pt-BR').format(value)
}

onMounted(fetchNews)
</script>

<template>
  <section class="news-feed">
    <h1 class="feed-title">{{ pageTitle }}</h1>
    <p class="feed-description">Ultimas noticias financeiras com contexto para aprendizado</p>
    <p v-if="usingMockData" class="mock-banner">
      Modo demonstracao ativo: configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para usar dados reais.
    </p>

    <div v-if="loading" class="loading-indicator">Carregando noticias...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="newsList.length === 0" class="empty-state">Nenhuma noticia encontrada.</div>

    <div v-else class="news-grid">
      <NewsCard
        v-for="news in newsList"
        :key="news.id"
        :title="news.title"
        :excerpt="news.snippet"
        :source="news.source || 'Feed publico'"
        :time="formatDate(news.published_at)"
        :tags="news.asset_mentions || []"
        :url="news.url"
      />
    </div>
  </section>
</template>

<style scoped>
.news-feed {
  display: grid;
  gap: 0.8rem;
}

.feed-title {
  font-size: clamp(1.3rem, 4vw, 2rem);
}

.feed-description {
  color: var(--text-soft);
}

.mock-banner {
  margin: 0.2rem 0 0.8rem;
  color: #f6c86a;
  font-size: 0.9rem;
  border: 1px solid color-mix(in srgb, #f6c86a 45%, var(--border));
  background: color-mix(in srgb, #f6c86a 10%, transparent);
  padding: 0.55rem 0.7rem;
  border-radius: 10px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.9rem;
}

.loading-indicator,
.empty-state,
.error-message {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-soft);
  border-radius: 12px;
  padding: 0.9rem;
}
</style>