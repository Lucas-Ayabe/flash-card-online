import { createRouter, createWebHistory } from 'vue-router'
import PlayView from '@/views/PlayView.vue'
import DecksView from '@/views/DecksView.vue'
import DeckView from '@/views/DeckView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/decks'
    },
    {
      path: '/decks',
      name: 'decks',
      component: DecksView
    },
    {
      path: '/decks/:id',
      name: 'deck',
      component: DeckView,
      props: true
    },
    {
      path: '/decks/:id/play',
      name: 'play',
      component: PlayView,
      props: true
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
