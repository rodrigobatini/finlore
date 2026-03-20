<template>
  <section class="market">
    <header>
      <h1>Pulso de mercado</h1>
      <p>Panorama rapido para leitura de contexto macro e risco.</p>
    </header>

    <div class="grid">
      <article class="card" v-for="item in cards" :key="item.name">
        <p class="label">{{ item.name }}</p>
        <p class="value">{{ item.value }}</p>
        <p :class="['delta', item.positive ? 'up' : 'down']">{{ item.delta }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const cards = [
  { name: 'Ibovespa', value: '129.420', delta: '+0,84% hoje', positive: true },
  { name: 'S&P 500', value: '5.224', delta: '-0,21% hoje', positive: false },
  { name: 'USD/BRL', value: '4,92', delta: '-0,34% hoje', positive: true },
  { name: 'DI Jan/31', value: '10,68%', delta: '+0,12 pp', positive: false }
]
</script>

<style scoped>
.market {
  display: grid;
  gap: 1rem;
}

h1 {
  color: var(--text);
  margin-bottom: 0.25rem;
}

p {
  color: var(--text-soft);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.9rem;
}

.card {
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1rem;
  background: var(--surface);
}

.label {
  font-size: 0.8rem;
}

.value {
  color: var(--text);
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0.2rem 0;
}

.delta.up {
  color: var(--success);
}

.delta.down {
  color: var(--danger);
}
</style>
