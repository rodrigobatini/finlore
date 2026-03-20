<template>
  <div class="tutor-overlay">
    <button class="floating-btn" @click="isOpen = !isOpen">
      {{ isOpen ? '×' : 'IA' }}
    </button>
    <div class="tutor-dialog" v-show="isOpen">
      <h3>Tutor de conceitos</h3>
      <p class="lead">Pergunte em linguagem natural e receba uma explicacao guiada.</p>
      <div class="quick-questions">
        <button @click="applyQuestion('O que e duration em renda fixa?')">Duration</button>
        <button @click="applyQuestion('Como interpretar IPCA alto?')">IPCA</button>
        <button @click="applyQuestion('Qual diferenca entre lucro e fluxo de caixa?')">Balanco</button>
      </div>
      <input v-model="question" placeholder="Ex: por que juros altos derrubam growth?" @keyup.enter="ask" />
      <div class="chat" v-if="lastAnswer">
        <div class="message bot">{{ lastAnswer }}</div>
      </div>
      <div class="actions">
        <button @click="ask" class="primary">Gerar explicacao</button>
        <button @click="isOpen = false">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const question = ref('')
const lastAnswer = ref('')

const applyQuestion = (value) => {
  question.value = value
  ask()
}

const ask = () => {
  if (!question.value.trim()) return
  lastAnswer.value = 'Estou processando sua pergunta...'
  setTimeout(() => {
    lastAnswer.value = `Resumo objetivo: "${question.value}".\n\n1) Conceito central: relacao entre risco, fluxo de caixa e expectativa.\n2) Impacto pratico: pode alterar valuation, custo de capital e alocacao.\n3) Como estudar: compare o tema em dois cenarios macro diferentes.`
  }, 500)
}
</script>

<style scoped>
.tutor-overlay {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.floating-btn {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 0;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  font-size: 1rem;
}

.tutor-dialog {
  position: absolute;
  right: 0;
  bottom: 72px;
  width: min(90vw, 390px);
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
}

h3 {
  margin: 0 0 0.5rem;
  color: var(--text);
}

.lead {
  margin: 0 0 0.7rem;
  color: var(--text-soft);
  font-size: 0.86rem;
}

.quick-questions {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 0.8rem;
}

.quick-questions button {
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-soft);
  color: var(--text-soft);
  font-size: 0.75rem;
  padding: 0.35rem 0.7rem;
  width: auto;
}

input {
  width: 100%;
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-soft);
  color: var(--text);
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.chat {
  margin: 0.8rem 0;
  padding: 0.8rem;
  background: var(--surface-soft);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.message {
  color: var(--text-soft);
  font-size: 0.84rem;
  line-height: 1.5;
  white-space: pre-line;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

button {
  flex: 1;
  padding: 0.6rem;
  background: var(--surface-soft);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
}

button.primary {
  border-color: color-mix(in srgb, var(--accent) 65%, var(--border));
  background: color-mix(in srgb, var(--accent) 18%, transparent);
}
</style>
