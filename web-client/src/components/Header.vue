<template>
  <header class="header">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <span class="logo-dot"></span>
        <span>Finlore</span>
      </router-link>

      <nav class="nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/noticias" class="nav-link">Noticias</router-link>
        <router-link to="/mercado" class="nav-link">Mercado</router-link>
        <router-link to="/tutor" class="nav-link">Tutor IA</router-link>
      </nav>

      <div class="actions">
        <button v-if="!authStore.user" class="btn btn-accent" @click="authStore.signInWithGoogle()">
          Entrar com Google
        </button>
        <details v-else class="user-menu">
          <summary class="btn">{{ userLabel }}</summary>
          <div class="menu-popover">
            <router-link to="/onboarding" class="menu-link">Preferencias</router-link>
            <router-link to="/perfil" class="menu-link">Perfil</router-link>
            <button class="menu-link danger" @click="authStore.signOut()">Sair</button>
          </div>
        </details>
        <button @click="toggleTheme" :class="['btn', { dark: isDark }]">
          {{ isDark ? 'Modo claro' : 'Modo escuro' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useDark } from '@/composables/useDark.js'
import { useAuthStore } from '@/stores/auth'

const { isDark, toggleTheme } = useDark()
const authStore = useAuthStore()
const userLabel = computed(
  () => authStore.user?.user_metadata?.full_name || authStore.user?.email?.split('@')?.[0] || 'Conta'
)
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(12px);
  background: color-mix(in srgb, var(--bg) 78%, transparent);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  gap: 0.75rem;
}

.logo {
  color: var(--text);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 14px color-mix(in srgb, var(--accent) 50%, transparent);
}

.nav {
  display: flex;
  gap: 0.4rem;
  padding: 0.3rem;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--surface) 60%, transparent);
  border-radius: 999px;
}

.nav-link {
  color: var(--text-soft);
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  transition: 0.18s ease;
}

.nav-link.router-link-exact-active {
  color: var(--text);
  background: color-mix(in srgb, var(--accent) 18%, transparent);
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-size: 0.86rem;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  transition: 0.2s ease;
}

.btn:hover {
  border-color: color-mix(in srgb, var(--accent) 65%, var(--border));
  transform: translateY(-1px);
}

.btn-accent {
  border-color: color-mix(in srgb, var(--accent) 65%, var(--border));
  background: color-mix(in srgb, var(--accent) 20%, transparent);
}

.user-menu {
  position: relative;
}

.user-menu summary {
  list-style: none;
}

.user-menu summary::-webkit-details-marker {
  display: none;
}

.menu-popover {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 170px;
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 12px;
  padding: 0.35rem;
  display: grid;
  gap: 0.2rem;
  z-index: 50;
}

.menu-link {
  text-decoration: none;
  color: var(--text);
  border: 0;
  background: transparent;
  text-align: left;
  font-size: 0.85rem;
  padding: 0.55rem 0.65rem;
  border-radius: 8px;
  cursor: pointer;
}

.menu-link:hover {
  background: var(--surface-soft);
}

.menu-link.danger {
  color: var(--danger);
}

.dark {
  opacity: 0.95;
}

@media (max-width: 800px) {
  .nav {
    display: none;
  }
}
</style>
