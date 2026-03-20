<template>
  <div class="bento-grid">
    <section class="panel hero">
      <p class="eyebrow">Plataforma de noticias financeiras</p>
      <h1>Entenda mercado, economia e investimento com contexto de IA.</h1>
      <p class="copy">
        Curadoria de noticias, correlacao de conceitos e tutor para transformar manchete em aprendizado.
      </p>
      <div class="hero-actions">
        <router-link to="/" class="action primary">Explorar feed</router-link>
        <router-link to="/tutor" class="action">Abrir tutor</router-link>
      </div>
    </section>

    <router-link v-for="panel in panels" :key="panel.id" :to="panel.to" class="panel tile">
      <span class="icon">{{ panel.icon }}</span>
      <h3>{{ panel.title }}</h3>
      <p>{{ panel.subtitle }}</p>
    </router-link>
  </div>
</template>

<script setup>
const panels = [
  { id: 1, icon: '📰', title: 'Noticias em destaque', subtitle: 'Principais movimentos do dia', to: '/' },
  { id: 2, icon: '📈', title: 'Pulso de mercado', subtitle: 'Indices, moedas e sentimento', to: '/mercado' },
  { id: 3, icon: '🎓', title: 'Tutor orientado', subtitle: 'Explique conceitos e estrategias', to: '/tutor' }
]
</script>

<style scoped>
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
  padding: 0.5rem 0;
}

.panel {
  border: 1px solid var(--border);
  border-radius: 20px;
  background: linear-gradient(145deg, var(--surface), color-mix(in srgb, var(--surface-soft) 70%, transparent));
  padding: 1.2rem;
}

.hero {
  grid-column: span 12;
  padding: 2rem;
}

.hero h1 {
  font-size: clamp(1.4rem, 4vw, 2.3rem);
  line-height: 1.15;
  max-width: 18ch;
  margin-bottom: 0.75rem;
}

.copy {
  color: var(--text-soft);
  max-width: 52ch;
}

.eyebrow {
  color: var(--accent-2);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.hero-actions {
  margin-top: 1.1rem;
  display: flex;
  gap: 0.6rem;
}

.action {
  color: var(--text);
  border: 1px solid var(--border);
  background: var(--surface-soft);
  text-decoration: none;
  padding: 0.58rem 0.9rem;
  border-radius: 12px;
  font-size: 0.9rem;
}

.action.primary {
  border-color: color-mix(in srgb, var(--accent) 70%, var(--border));
  background: color-mix(in srgb, var(--accent) 20%, transparent);
}

.tile {
  grid-column: span 4;
  text-decoration: none;
  transition: 0.2s ease;
}

.tile:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
}

.icon {
  font-size: 1.3rem;
  display: block;
  margin-bottom: 0.8rem;
}

h3 {
  margin: 0 0 0.4rem;
  color: var(--text);
  font-size: 1.02rem;
}

p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .tile {
    grid-column: span 6;
  }
}

@media (max-width: 680px) {
  .tile {
    grid-column: span 12;
  }

  .hero {
    padding: 1.3rem;
  }
}
</style>
