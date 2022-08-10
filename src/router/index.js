import { createRouter, createWebHistory } from 'vue-router'
import Stiri from '../views/Stiri.vue'
import Clasament from "../views/Clasament.vue"
import Home from "../views/Home.vue"
import Echipe from '../views/Echipe.vue'
import Clasamentpiloti from '../views/Clasamentpiloti.vue'
import Istorie from '../views/Istorie.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Acasă",
      component: Home
    },
    {
      path: "/echipe",
      name: "Echipe",
      component: Echipe
    },
    {
      path: "/clasament-echipe",
      name: "Clasament",
      component: Clasament
    },
    {
      path: "/clasament-piloti",
      name: "Clasamentpiloti",
      component: Clasamentpiloti
    },
    {
      path: '/stiri',
      name: 'Stiri',
      component: Stiri
    },
    {
      path: '/istorie',
      name: 'Istorie',
      component: Istorie
    }
  ]
})

export default router
