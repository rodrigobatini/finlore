import { createRouter, createWebHistory } from 'vue-router'
import NewsFeed from '@/views/NewsFeed.vue'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Home' }
  },
  {
    path: '/noticias',
    name: 'Noticias',
    component: NewsFeed,
    meta: { title: 'Noticias' }
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
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('@/views/OnboardingView.vue'),
    meta: { title: 'Onboarding' }
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: 'Perfil' }
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
