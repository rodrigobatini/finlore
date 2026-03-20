<template>
  <section class="profile">
    <h1>Seu perfil</h1>
    <p class="subtitle">Edite preferencias para personalizar feed e explicacoes do tutor.</p>

    <article class="card">
      <p><strong>Usuario:</strong> {{ authStore.user?.email || 'Nao autenticado' }}</p>
      <p><strong>Nivel:</strong> {{ userStore.preferences.level }}</p>
      <p><strong>Temas:</strong> {{ userStore.preferences.topics.join(', ') || 'Nenhum' }}</p>
      <p><strong>Fontes:</strong> {{ userStore.preferences.sources.join(', ') || 'Nenhuma' }}</p>
      <router-link to="/onboarding" class="link">Editar onboarding</router-link>
    </article>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const authStore = useAuthStore()
const userStore = useUserStore()

onMounted(async () => {
  if (authStore.user?.id) {
    await userStore.loadProfile(authStore.user.id)
  }
})
</script>

<style scoped>
.profile { display: grid; gap: 0.7rem; }
.subtitle { color: var(--text-soft); }
.card {
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 14px;
  padding: 1rem;
  display: grid;
  gap: 0.45rem;
}
p { color: var(--text-soft); }
strong { color: var(--text); }
.link {
  margin-top: 0.4rem;
  color: var(--accent-2);
  text-decoration: none;
}
</style>
