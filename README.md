# Finlore

Plataforma de noticias de financas, investimento e economia com apoio de IA para aprendizado guiado.

## Visao do produto

O objetivo do Finlore e transformar noticia em entendimento:
- Agregar conteudo de fontes publicas (APIs e RSS)
- Enriquecer com correlacao de conceitos (macro, ativos, fundamentos)
- Ajudar o usuario a aprender com um tutor de IA contextual

## Status atual

Projeto em monorepo com frontend funcional e redesenhado:
- `web-client`: Vue 3 + Vite + Pinia + Vue Router
- `api-funcs`: base para funcoes/backend
- `knowledge-base`: base de migracoes/schema para RAG
- `app-mobile`: estrutura inicial para app mobile

Hoje o frontend ja sobe e permite testar UX/UI mesmo sem backend pronto.
Quando Supabase nao esta configurado, o feed usa dados mock automaticamente.

## Estrutura

```txt
finlore/
├── web-client/
├── api-funcs/
├── app-mobile/
├── knowledge-base/
├── PLANO.md
└── README.md
```

## Como rodar (frontend)

Prerequisitos:
- Node.js 18+
- pnpm 10+

Instalacao:

```bash
pnpm install
```

Subir ambiente de desenvolvimento:

```bash
pnpm dev
```

Abrir:
- http://localhost:3000

Build de producao:

```bash
pnpm build
```

## Variaveis de ambiente (opcional, para dados reais)

Crie `web-client/.env`:

```bash
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

Sem essas variaveis, o app entra em modo demonstracao (mock data).

## Contexto geral para retomar amanha

### O que ja esta pronto
- Base de monorepo organizada
- Frontend com nova identidade visual e navegacao
- Feed de noticias com fallback mock
- Paginas iniciais de Mercado e Tutor
- Tema dark/light com persistencia local

### O que ainda falta (prioridade)
1. Integracao real de ingestao de noticias (RSS/APIs)
2. Modelagem de correlacao de conceitos (tags, topicos, ativos)
3. Pipeline de RAG (embeddings + retrieval)
4. Backend/tutor com respostas contextualizadas em dados reais
5. Observabilidade minima (logs, falhas de sync)

### Plano de execucao recomendado (proxima sessao)
1. Definir schema final no Supabase (`news`, `sources`, `concepts`, `news_concepts`)
2. Criar job de ingestao (RSS/APIs) com normalizacao basica
3. Popular feed real e validar no frontend
4. Implementar endpoint simples de tutor com contexto de noticia
5. Fechar deploy web (Vercel) com envs configuradas

## Referencias

- Supabase: https://supabase.com
- Vue: https://vuejs.org
- Vite: https://vitejs.dev
- Capacitor: https://capacitorjs.com

