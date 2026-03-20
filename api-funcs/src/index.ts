import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'

const app = express()
app.use(cors())
app.use(express.json())

const port = Number(process.env.PORT || 8787)
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || ''
const cronSecret = process.env.CRON_SECRET || ''

const hasSupabase = Boolean(supabaseUrl && supabaseServiceRole)
const supabase = hasSupabase ? createClient(supabaseUrl, supabaseServiceRole) : null
const alphaVantageApiKey = process.env.ALPHA_VANTAGE_API_KEY || ''

type IngestItem = {
  sourceSlug: string
  externalId: string
  title: string
  summary: string
  url: string
  publishedAt: string
}

const fetchText = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'finlore-mvp/1.0'
    }
  })
  if (!response.ok) {
    throw new Error(`Falha ao buscar ${url}: ${response.status}`)
  }
  return response.text()
}

const stripHtml = (value: string) => {
  const decoded = value
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

  return decoded
    .replace(/<a[^>]*>/gi, ' ')
    .replace(/<\/a>/gi, ' ')
    .replace(/<font[^>]*>/gi, ' ')
    .replace(/<\/font>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/\bhref\s*=\s*['"][^'"]*['"]/gi, ' ')
    .replace(/\btarget\s*=\s*['"][^'"]*['"]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const parseRssItems = (xml: string, sourceSlug: string, limit = 20): IngestItem[] => {
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  const items = [...xml.matchAll(itemRegex)].slice(0, limit)
  return items.map((match, index) => {
    const block = match[1]
    const get = (tag: string) => {
      const reg = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i')
      return stripHtml(block.match(reg)?.[1] || '')
    }
    const link = get('link')
    const title = get('title')
    const description = get('description')
    const pubDateRaw = get('pubDate')
    const publishedAt = pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString()
    return {
      sourceSlug,
      externalId: link || `${sourceSlug}-${index}-${title.slice(0, 40)}`,
      title: title || 'Sem titulo',
      summary: description || title || 'Sem resumo',
      url: link || 'https://news.google.com',
      publishedAt
    }
  })
}

const inferConcepts = (text: string) => {
  const normalized = text.toLowerCase()
  const rules: Record<string, string[]> = {
    juros: ['juros', 'selic', 'copom', 'taxa'],
    inflacao: ['inflacao', 'ipca', 'igp', 'precos'],
    acoes: ['acao', 'bolsa', 'ibovespa', 'b3'],
    dolar: ['dolar', 'usd', 'cambio'],
    'macro-global': ['fed', 'ecb', 'china', 'eua', 'global']
  }
  return Object.entries(rules)
    .filter(([, keywords]) => keywords.some((k) => normalized.includes(k)))
    .map(([slug]) => slug)
}

const fetchGoogleNews = async (): Promise<IngestItem[]> => {
  const url = 'https://news.google.com/rss/search?q=economia+OR+investimentos+OR+juros&hl=pt-BR&gl=BR&ceid=BR:pt-419'
  const xml = await fetchText(url)
  return parseRssItems(xml, 'google-news-br', 35)
}

const fetchBcbNews = async (): Promise<IngestItem[]> => {
  const url = 'https://www.bcb.gov.br/rss/noticias'
  const xml = await fetchText(url)
  return parseRssItems(xml, 'bcb', 20)
}

const fetchIbgeNews = async (): Promise<IngestItem[]> => {
  const url = 'https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=20'
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Falha IBGE API: ${response.status}`)
  }
  const data = (await response.json()) as any
  const items = Array.isArray(data?.items) ? data.items : []
  return items.slice(0, 20).map((item: any) => {
    const rawDate = String(item?.data_publicacao || '').replace(' ', 'T')
    const publishedAt = rawDate ? new Date(rawDate).toISOString() : new Date().toISOString()
    return {
      sourceSlug: 'ibge',
      externalId: String(item?.id || item?.link || Math.random()),
      title: stripHtml(item?.titulo || 'Noticia IBGE'),
      summary: stripHtml(item?.introducao || item?.titulo || 'Sem resumo'),
      url: String(item?.link || 'https://www.ibge.gov.br'),
      publishedAt
    }
  })
}

const fetchAlphaVantageSnapshot = async (): Promise<IngestItem[]> => {
  if (!alphaVantageApiKey) return []
  const pair = 'USDBRL'
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=BRL&apikey=${alphaVantageApiKey}`
  const response = await fetch(url)
  if (!response.ok) return []
  const data = (await response.json()) as any
  const quote = data?.['Realtime Currency Exchange Rate']
  if (!quote) return []
  const rate = quote['5. Exchange Rate']
  const updated = quote['6. Last Refreshed']
  return [
    {
      sourceSlug: 'alpha-vantage',
      externalId: `usdbbl-${updated}`,
      title: 'Atualizacao cambial USD/BRL',
      summary: `Alpha Vantage reportou USD/BRL em ${rate}. Use como contexto de mercado, nao como recomendacao.`,
      url: 'https://www.alphavantage.co/',
      publishedAt: new Date(updated || Date.now()).toISOString()
    }
  ]
}

const ensureConcepts = async () => {
  if (!supabase) return
  const conceptRows = [
    { slug: 'juros', label: 'Juros' },
    { slug: 'inflacao', label: 'Inflacao' },
    { slug: 'acoes', label: 'Acoes' },
    { slug: 'dolar', label: 'Dolar' },
    { slug: 'macro-global', label: 'Macro Global' }
  ]
  await supabase.from('concepts').upsert(conceptRows, { onConflict: 'slug' })
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, supabaseConfigured: hasSupabase })
})

app.get('/feed', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase nao configurado no backend' })
  }

  const topic = String(req.query.topic || '')
  const source = String(req.query.source || '') // source slug
  const userId = String(req.query.user_id || '')
  const limit = Math.min(Number(req.query.limit || 30), 50)

  let query = supabase
    .from('news')
    .select('id,title,summary,url,published_at,sources(name,slug)')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (source) {
    const { data: sourceRow } = await supabase.from('sources').select('id').eq('slug', source).maybeSingle()
    if (sourceRow?.id) query = query.eq('source_id', sourceRow.id)
  }

  if (topic) {
    const { data: conceptRows } = await supabase.from('concepts').select('id').eq('slug', topic).limit(1)
    const conceptId = conceptRows?.[0]?.id
    if (conceptId) {
      const { data: newsRefs } = await supabase
        .from('news_concepts')
        .select('news_id')
        .eq('concept_id', conceptId)
        .limit(limit)
      const ids = (newsRefs || []).map((n: any) => n.news_id)
      if (ids.length) query = query.in('id', ids)
    }
  }

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  let normalized = (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    snippet: item.summary,
    url: item.url,
    published_at: item.published_at,
    source_id: item.source_id,
    source: item.sources?.name || 'Fonte'
  }))

  if (userId && !topic && !source) {
    const { data: prefSources } = await supabase.from('user_sources').select('source_id').eq('user_id', userId)
    const preferredSourceIds = new Set((prefSources || []).map((row: any) => row.source_id))

    const { data: prefTopics } = await supabase.from('user_topics').select('topic_id').eq('user_id', userId)
    const topicIds = (prefTopics || []).map((row: any) => row.topic_id)
    let preferredNewsIds = new Set<string>()

    if (topicIds.length) {
      const { data: topicRows } = await supabase.from('topics').select('slug,id').in('id', topicIds)
      const slugs = (topicRows || []).map((row: any) => row.slug)
      if (slugs.length) {
        const { data: conceptRows } = await supabase.from('concepts').select('id,slug').in('slug', slugs)
        const conceptIds = (conceptRows || []).map((row: any) => row.id)
        if (conceptIds.length) {
          const { data: refs } = await supabase.from('news_concepts').select('news_id').in('concept_id', conceptIds)
          preferredNewsIds = new Set((refs || []).map((row: any) => row.news_id))
        }
      }
    }

    normalized = normalized
      .map((item: any) => {
        let score = 0
        if (preferredSourceIds.has(item.source_id)) score += 2
        if (preferredNewsIds.has(item.id)) score += 1
        return { ...item, _score: score }
      })
      .sort((a: any, b: any) => {
        if (b._score !== a._score) return b._score - a._score
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      })
  }

  normalized = normalized.slice(0, limit).map(({ source_id, _score, ...item }: any) => item)
  return res.json({ data: normalized })
})

app.post('/ingest/run', async (_req, res) => {
  if (cronSecret) {
    const authHeader = String(_req.headers.authorization || '')
    const provided = authHeader.replace('Bearer ', '').trim()
    if (provided !== cronSecret) {
      return res.status(401).json({ error: 'Nao autorizado para ingestao' })
    }
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase nao configurado no backend' })
  }

  await ensureConcepts()

  const sourceMapRows = await supabase.from('sources').select('id,slug')
  if (sourceMapRows.error) {
    return res.status(500).json({
      error: `Falha ao ler fontes: ${sourceMapRows.error.message}. Aplique a migration em knowledge-base/migrations/001_initial_schema.sql.`
    })
  }
  const sourceMap = new Map<string, string>((sourceMapRows.data || []).map((s: any) => [s.slug, s.id]))
  if (!sourceMap.size) {
    return res.status(500).json({
      error: 'Tabela sources sem dados seed. Aplique migration/seed antes da ingestao.'
    })
  }
  const conceptRows = await supabase.from('concepts').select('id,slug')
  if (conceptRows.error) {
    return res.status(500).json({
      error: `Falha ao ler conceitos: ${conceptRows.error.message}. Aplique a migration em knowledge-base/migrations/001_initial_schema.sql.`
    })
  }
  const conceptMap = new Map<string, string>((conceptRows.data || []).map((c: any) => [c.slug, c.id]))

  const ingestionResults = {
    google: { fetched: 0, inserted: 0, failed: 0 },
    bcb: { fetched: 0, inserted: 0, failed: 0 },
    ibge: { fetched: 0, inserted: 0, failed: 0 },
    alpha: { fetched: 0, inserted: 0, failed: 0 }
  }
  const errors: string[] = []

  const allItems: IngestItem[] = []
  try {
    const items = await fetchGoogleNews()
    ingestionResults.google.fetched = items.length
    allItems.push(...items)
  } catch {
    ingestionResults.google.failed += 1
  }
  try {
    const items = await fetchBcbNews()
    ingestionResults.bcb.fetched = items.length
    allItems.push(...items)
  } catch {
    ingestionResults.bcb.failed += 1
  }
  try {
    const items = await fetchIbgeNews()
    ingestionResults.ibge.fetched = items.length
    allItems.push(...items)
  } catch {
    ingestionResults.ibge.failed += 1
  }
  try {
    const items = await fetchAlphaVantageSnapshot()
    ingestionResults.alpha.fetched = items.length
    allItems.push(...items)
  } catch {
    ingestionResults.alpha.failed += 1
  }

  for (const item of allItems) {
    const sourceId = sourceMap.get(item.sourceSlug)
    if (!sourceId) continue

    const { data: upsertData, error } = await supabase
      .from('news')
      .upsert(
        {
          source_id: sourceId,
          external_id: item.externalId,
          title: item.title,
          summary: item.summary,
          url: item.url,
          published_at: item.publishedAt,
          language: 'pt-BR'
        },
        { onConflict: 'url' }
      )
      .select('id')
      .single()

    if (error || !upsertData?.id) {
      if (errors.length < 8) {
        errors.push(`${item.sourceSlug}: ${error?.message || 'upsert sem id retornado'}`)
      }
      continue
    }

    const concepts = inferConcepts(`${item.title} ${item.summary}`)
    const links = concepts
      .map((slug) => conceptMap.get(slug))
      .filter(Boolean)
      .map((conceptId) => ({
        news_id: upsertData.id,
        concept_id: conceptId as string,
        confidence: 0.7
      }))

    if (links.length) {
      await supabase.from('news_concepts').upsert(links, { onConflict: 'news_id,concept_id' })
    }

    if (item.sourceSlug === 'google-news-br') ingestionResults.google.inserted += 1
    if (item.sourceSlug === 'bcb') ingestionResults.bcb.inserted += 1
    if (item.sourceSlug === 'ibge') ingestionResults.ibge.inserted += 1
    if (item.sourceSlug === 'alpha-vantage') ingestionResults.alpha.inserted += 1
  }

  return res.json({ ok: true, ingestion: ingestionResults, totalProcessed: allItems.length, errors })
})

app.post('/tutor/ask', async (req, res) => {
  const question = String(req.body?.question || '').trim()
  const newsId = String(req.body?.news_id || '')

  if (!question) {
    return res.status(400).json({ error: 'Pergunta obrigatoria' })
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase nao configurado no backend' })
  }

  let contextSummary = 'Sem contexto adicional'
  if (newsId) {
    const { data } = await supabase.from('news').select('title,summary,url').eq('id', newsId).maybeSingle()
    if (data) {
      contextSummary = `${data.title}: ${data.summary}`
    }
  }

  const answer = {
    conceito_chave: 'Relacao entre contexto macro, expectativa e precificacao.',
    como_ler_a_noticia: `Pergunta: ${question}. Contexto: ${contextSummary}`,
    o_que_acompanhar: ['proximos dados macro', 'sinalizacao institucional', 'mudancas de consenso'],
    fontes_usadas: newsId ? ['noticia_relacionada'] : ['base_publica'],
    disclaimer_educacional:
      'Conteudo educacional. Nao representa recomendacao de compra, venda ou alocacao de ativos.'
  }

  return res.json({ data: answer })
})

app.listen(port, () => {
  console.log(`api-funcs running on http://localhost:${port}`)
})
