import { createRouter, createWebHistory } from 'vue-router'
import Stiri from '../views/Stiri.vue'
import Home from "../views/Home.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: '/stiri',
      name: 'Stiri',
      component: Stiri
    },
  ]
})

export default router
