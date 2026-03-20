<template>
  <section class="onboarding">
    <h1>Personalize sua jornada</h1>
    <p class="subtitle">Escolha temas, fontes e seu nivel para montar um feed com contexto util.</p>

    <div class="card">
      <label>Nivel atual</label>
      <select v-model="level">
        <option value="intro">Intro</option>
        <option value="intermediario">Intermediario</option>
        <option value="avancado">Avancado</option>
      </select>

      <label>Temas</label>
      <div class="chips">
        <button v-for="topic in topicOptions" :key="topic" :class="{ active: topics.includes(topic) }" @click="toggleTopic(topic)">
          {{ topic }}
        </button>
      </div>

      <label>Fontes</label>
      <div class="chips">
        <button v-for="source in sourceOptions" :key="source" :class="{ active: sources.includes(source) }" @click="toggleSource(source)">
          {{ source }}
        </button>
      </div>

      <button class="save" @click="save">Salvar onboarding</button>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const authStore = useAuthStore()
const userStore = useUserStore()

const level = ref('intro')
const topics = ref<string[]>(['juros', 'inflacao'])
const sources = ref<string[]>(['google-news-br', 'bcb'])
const message = ref('')

const topicOptions = ['juros', 'inflacao', 'acoes', 'dolar', 'macro-global']
const sourceOptions = ['google-news-br', 'bcb', 'ibge', 'alpha-vantage']

const toggleTopic = (topic: string) => {
  topics.value = topics.value.includes(topic) ? topics.value.filter((t) => t !== topic) : [...topics.value, topic]
}

const toggleSource = (source: string) => {
  sources.value = sources.value.includes(source)
    ? sources.value.filter((s) => s !== source)
    : [...sources.value, source]
}

const save = async () => {
  if (!authStore.user) {
    message.value = 'Faça login com Google para salvar suas preferencias.'
    return
  }
  await userStore.saveOnboarding(authStore.user.id, {
    level: level.value,
    topics: topics.value,
    sources: sources.value,
    email: authStore.user.email || '',
    displayName: authStore.user.user_metadata?.full_name || authStore.user.user_metadata?.name || null
  })
  message.value = 'Onboarding salvo com sucesso.'
}
</script>

<style scoped>
.onboarding { display: grid; gap: 0.75rem; }
.subtitle { color: var(--text-soft); }
.card {
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 14px;
  padding: 1rem;
  display: grid;
  gap: 0.7rem;
}
label { font-size: 0.85rem; color: var(--text-soft); }
select {
  border: 1px solid var(--border);
  background: var(--surface-soft);
  color: var(--text);
  border-radius: 10px;
  padding: 0.55rem;
}
.chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.chips button {
  border: 1px solid var(--border);
  background: var(--surface-soft);
  color: var(--text-soft);
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
}
.chips button.active {
  color: var(--text);
  border-color: color-mix(in srgb, var(--accent) 60%, var(--border));
  background: color-mix(in srgb, var(--accent) 18%, transparent);
}
.save {
  border: 1px solid color-mix(in srgb, var(--accent) 60%, var(--border));
  background: color-mix(in srgb, var(--accent) 18%, transparent);
  color: var(--text);
  border-radius: 10px;
  padding: 0.65rem;
  cursor: pointer;
}
.message { color: var(--success); font-size: 0.88rem; }
</style>
