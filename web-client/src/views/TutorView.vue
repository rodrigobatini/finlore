<template>
  <section class="tutor-page">
    <h1>Trilhas de aprendizado</h1>
    <p class="subtitle">Use essas trilhas para estudar por tema e conectar noticias com fundamentos.</p>
    <div class="list">
      <article class="item" v-for="trail in trails" :key="trail.title">
        <h3>{{ trail.title }}</h3>
        <p>{{ trail.description }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const trails = [
  {
    title: 'Macro para investidores',
    description: 'Inflacao, juros, cambio e como cada variavel afeta ativos de risco.'
  },
  {
    title: 'Analise fundamentalista',
    description: 'Leitura de demonstracoes, margens, crescimento e qualidade de lucro.'
  },
  {
    title: 'Risco e alocacao',
    description: 'Diversificacao, correlacao e ajuste de carteira por perfil.'
  }
]
</script>

<style scoped>
.tutor-page {
  display: grid;
  gap: 1rem;
}

h1 {
  color: var(--text);
}

.subtitle {
  color: var(--text-soft);
}

.list {
  display: grid;
  gap: 0.8rem;
}

.item {
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 14px;
  padding: 1rem;
}

h3 {
  margin-bottom: 0.35rem;
  color: var(--text);
}

p {
  color: var(--text-soft);
}
</style>
