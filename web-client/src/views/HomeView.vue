<template>
  <section class="home">
    <BentoGrid />
  </section>
</template>

<script setup>
import BentoGrid from '@/components/BentoGrid.vue'
</script>

<style scoped>
.home {
  display: grid;
  gap: 1rem;
}
</style>
