import { createRouter, createWebHistory } from 'vue-router'
import Stiri from '../views/Stiri.vue'
import Clasament from "../views/Clasament.vue"
import Home from "../views/Home.vue"
import Echipe from '../views/Echipe.vue'
import Clasamentpiloti from '../views/Clasamentpiloti.vue'
import Istorie from '../views/Istorie.vue'
import Joc from "../views/Joculet.vue"
import Calificari from "../views/Calificari.vue"
import Curse from "../views/Curse.vue"


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
      path: "/rezultate-calificari/:an?",
      name: "Calificari",
      component: Calificari
    },
    {
      path: "/rezultate-curse/:an?",
      name: "Curse",
      component: Curse
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
      path: '/joc',
      name: 'Joc',
      component: Joc
    },
    {
      path: '/istorie',
      name: 'Istorie',
      component: Istorie
    }
  ]
})

export default router
