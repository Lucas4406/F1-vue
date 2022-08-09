import { createRouter, createWebHistory } from 'vue-router'
import Stiri from '../views/Stiri.vue'
import Clasament from "../views/Clasament.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/clasament-echipe",
      name: "Clasament",
      component: Clasament
    },
    {
      path: '/stiri',
      name: 'Stiri',
      component: Stiri
    },
  ]
})

export default router
