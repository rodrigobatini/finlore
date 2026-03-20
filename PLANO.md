# 📋 PLANO GERAL - Finance News Platform MVP

## 🎯 Objetivo
Criar plataforma de notícias financeiras com IA contextual, Bento Grid, dark mode e RAG para tutor inteligente.

---

## ✅ PROGRESSO ATUAL

### **1. Estrutura Monorepo** ✅ COMPLETO
```
opencode-test/
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── web-client/ ✅
├── api-funcs/
├── app-mobile/
└── knowledge-base/
```

### **2. Web Client Vue** ✅ 60% FEITO
- ✅ Configuração Vite + Vue
- ✅ Stores Pinia: auth, user, knowledge
- ✅ Views: NewsFeed
- ✅ Lib: Supabase client

### **3. Faltantes Críticos** ⏳
1. **Componentes UI** (NewsCard, TutorOverlay, ThemeSwitcher, etc.)
2. **Main App.vue** com layout Bento Grid
3. **Router** com lazy loading
4. **Supabase schema** (migrations SQL)
5. **Supabase Functions** para RAG
6. **Capacitor** para mobile

---

## 📁 LOCALIZAÇÃO DOS ARQUIVOS

O projeto está em: `/home/batini/Projetos/opencode-test/`

### **Web Client:**
```
web-client/
  ├── package.json           ✅
  ├── vite.config.ts         ✅
  ├── index.html             ✅
  └── src/
      ├── lib/
      │   └── supabase.ts    ✅
      ├── stores/
      │   ├── auth.ts        ✅
      │   ├── user.ts        ✅
      │   └── knowledge.ts   ✅
      ├── views/
      │   └── NewsFeed.vue   ✅
      ├── components/        ⏳ (falta criar)
      ├── router/            ⏳ (falta criar)
      └── App.vue            ⏳ (falta criar)
```

### **Onde está o MD deste plano?**
```
/home/batini/Projetos/opencode-test/PLANO.md
```

---

## ⏭️ PRÓXIMOS PASSOS

### **IMEDIATO (30 min):**
1. Criar todos os componentes UI restantes
2. Criar `App.vue` + `router/index.ts`
3. Escrever migrations SQL para Supabase
4. Criar prompts do tutor IA

### **EM SEGUIR (1-2h):**
5. Setup Capacitor no mobile
6. Criar Supabase project + migrations
7. Run local e testar tudo

### **EM SEGUIR (2h):**
8. Deploy Vercel para web
9. Capacitor build para mobile

---

## 🛠️ RECURSOS UTILIZADOS

- **Front:** Vue 3 + Vite + Pinia + Vue Router
- **Backend:** Supabase PostgreSQL + pgvector
- **IA:** Llama 3 (8B) via Ollama local
- **Mobile:** Capacitor (wrapper para Vue)
- **Embeddings:** nomic-embed-text + RAG

---

## 📞 LINKS IMPORTANTES

- **Supabase:** https://supabase.com
- **Ollama:** https://ollama.ai
- **Vue Docs:** https://vuejs.org
- **Capacitor:** https://capacitorjs.com
- **Vercel:** https://vercel.com
- **GitHub:** https://github.com

---

**Status:** 🟢 Em andamento - MVP está 40% completo
**Próximo:** Componentes UI + Supabase schema