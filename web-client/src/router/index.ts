import { createRouter, createWebHistory } from 'vue-router'
import NewsFeed from '@/views/NewsFeed.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: NewsFeed,
    meta: { title: 'Finance News' }
  },
  {
    path: '/mercado',
    name: 'Mercado',
    component: () => import('@/views/MarketView.vue'),
    meta: { title: 'Mercado' }
  },
  {
    path: '/tutor',
    name: 'Tutor',
    component: () => import('@/views/TutorView.vue'),
    meta: { title: 'Tutor IA' }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Finance News`
  next()
})

export default router
