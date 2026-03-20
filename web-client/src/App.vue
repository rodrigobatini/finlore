<template>
  <div id="app" :class="{ dark: isDark }">
    <Header />
    <main class="main-content shell">
      <router-view />
    </main>
    <TutorOverlay />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Header from '@/components/Header.vue'
import TutorOverlay from '@/components/TutorOverlay.vue'
import { useDark } from '@/composables/useDark.js'
import { useAuthStore } from '@/stores/auth'

const { isDark } = useDark()
const authStore = useAuthStore()

onMounted(() => {
  authStore.initSession()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg: #070a13;
  --surface: #0f1628;
  --surface-soft: #121c33;
  --border: #263559;
  --text: #e7ecfb;
  --text-soft: #a7b4d9;
  --accent: #5f8dff;
  --accent-2: #63d2ff;
  --success: #2ed3a2;
  --danger: #ff6b8a;
}

:root.theme-light {
  --bg: #eef3ff;
  --surface: #ffffff;
  --surface-soft: #f8faff;
  --border: #d7e1ff;
  --text: #141c33;
  --text-soft: #5f6f9c;
  --accent: #2d60ff;
  --accent-2: #2ca5d9;
  --success: #0ea576;
  --danger: #e5486e;
}

#app {
  min-height: 100vh;
  background:
    radial-gradient(circle at 10% -20%, rgba(96, 141, 255, 0.2), transparent 45%),
    radial-gradient(circle at 90% 0%, rgba(99, 210, 255, 0.16), transparent 42%),
    var(--bg);
  color: var(--text);
  font-family: "Inter", "Segoe UI", sans-serif;
}

.main-content {
  padding: 2rem 0 4rem;
}

.shell {
  max-width: 1200px;
  margin: 0 auto;
  width: min(100%, 1200px);
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
