# PLANO GERAL - Finlore MVP

## Objetivo
Criar uma plataforma de noticias de financas, investimento e economia com:
- ingestao por APIs publicas e RSS
- correlacao de conceitos para contexto
- tutor IA para ajudar o usuario a aprender

---

## Status atual (real)

### 1) Estrutura monorepo - OK
```txt
finlore/
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── web-client/        # frontend Vue funcional
├── api-funcs/         # base backend/funcoes
├── app-mobile/        # estrutura inicial mobile
├── knowledge-base/    # migracoes/schema inicial
├── README.md
└── CONTEXTO-AMANHA.md
```

### 2) Frontend web - OK (MVP visual)
- UI redesenhada e navegacao funcional
- rotas: Noticias, Mercado, Tutor
- tema dark/light com persistencia local
- feed com fallback mock quando Supabase nao esta configurado
- build validado com `pnpm --filter web-client build`

### 3) Pendencias criticas
1. Fechar schema final no Supabase
2. Ingestao real de noticias (RSS/APIs)
3. Correlacao de conceitos (news -> conceitos -> ativos)
4. Endpoint inicial do tutor com contexto real
5. Deploy web com envs e checklist de observabilidade

---

## Localizacao do projeto

- Repo local: `/home/batini/Projetos/finlore`
- Repo GitHub: `https://github.com/rodrigobatini/finlore`

---

## Proximos passos (priorizados)

### Bloco 1 - Dados reais no feed (alta prioridade)
1. Definir tabelas finais: `news`, `sources`, `concepts`, `news_concepts`
2. Criar rotina de ingestao para 3-5 fontes
3. Normalizar e persistir noticias
4. Conectar frontend para leitura em producao de dados reais

### Bloco 2 - Tutor IA v1 (alta prioridade)
5. Criar endpoint simples em `api-funcs` para resposta contextual
6. Adicionar prompt base com estrutura didatica
7. Exibir resposta real no `TutorOverlay`/`TutorView`

### Bloco 3 - Entrega e operacao (media prioridade)
8. Configurar deploy no Vercel
9. Configurar variaveis de ambiente
10. Adicionar logs minimos para ingestao e falhas

---

## Stack
- Front: Vue 3 + Vite + Pinia + Vue Router
- Backend/Dados: Supabase (Postgres)
- IA: pipeline RAG (incremental)
- Mobile: Capacitor (fase posterior)

---

## Referencias
- Supabase: https://supabase.com
- Vue: https://vuejs.org
- Vite: https://vitejs.dev
- Capacitor: https://capacitorjs.com
- Vercel: https://vercel.com

---

**Status:** em andamento, com frontend pronto para demonstracao.  
**Foco seguinte:** dados reais + tutor contextual v1.