<template>
  <article class="news-card" :class="{ dark: isDark }">
    <div class="header">
      <span class="source">{{ source }}</span>
      <span class="time">{{ time }}</span>
    </div>
    <h3 class="title">{{ title }}</h3>
    <p class="excerpt">{{ excerpt }}</p>
    <div class="tags" v-if="tags?.length">
      <span v-for="(tag, i) in tags" :key="i" class="tag">{{ tag }}</span>
    </div>
    <button class="read-btn" @click="open">Ler analise</button>
  </article>
</template>

<script setup>
import { useDark } from '@/composables/useDark.js'

const props = defineProps({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  source: { type: String, required: true },
  time: { type: String, required: true },
  tags: { type: Array, required: true },
  url: { type: String, required: true }
})

const { isDark } = useDark()

const open = () => {
  window.open(props.url, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
.news-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1rem;
  transition: transform 0.2s ease, border-color 0.2s ease;
  overflow: hidden;
}

.news-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--accent) 60%, var(--border));
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  color: var(--text-soft);
}

.title {
  margin: 0.7rem 0 0.5rem;
  font-size: 1.04rem;
  color: var(--text);
  line-height: 1.35;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.excerpt {
  margin: 0 0 1rem;
  color: var(--text-soft);
  font-size: 0.9rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 38%, var(--border));
  color: var(--text);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
}

.read-btn {
  width: 100%;
  padding: 0.65rem;
  background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 88%, #000), var(--accent-2));
  color: #f7f9ff;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.read-btn:hover {
  filter: brightness(1.08);
}
</style>
