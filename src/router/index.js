import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import Stiri from '../views/Stiri.vue'
import Clasament from "../views/Clasament.vue"
import Home from "../views/Home.vue"
import Echipe from '../views/Echipe.vue'
import Clasamentpiloti from '../views/Clasamentpiloti.vue'
import Istorie from '../views/Istorie.vue'
import Joc from "../views/Joculet.vue"
import Calificari from "../views/Calificari.vue"
import Curse from "../views/Curse.vue"
import Live from "../views/Live.vue"
import Program from "../views/Program.vue"
import Formtest from "../views/Formtest.vue"
import Login from "../views/login.vue"
import Signup from "../views/signup.vue"
import Profile from "../views/profile/profile.vue"
import updateForm from "../views/updateForm.vue"
import Surse from "../views/Surse-pagina.vue"









const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Acasă",
      component: Home,
    },
    {
      path: "/echipe",
      name: "Echipe",
      component: Echipe
    },
    {
      path: "/program",
      name: "Program",
      component: Program
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
    },
    {
      path: "/live",
      name: "Live",
      component: Live
    },
    {
      path: "/test",
      name: "Formtest",
      component: Formtest,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup
    },
    {
      path: "/surse",
      name: "Surse",
      component: Surse
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/updateprofile",
      name: "updateForm",
      component: updateForm,
      meta: {
        requiresAuth: true
      }
    },
  ]
})


function getCurrentUser() {
    return new Promise((resolve, reject) => {
      const removeListener = onAuthStateChanged(
        getAuth(), (user) => {
          removeListener()
          resolve(user)
        },
        reject
      )
    })
}


router.beforeEach(async (to, from, next) => {
  if(to.matched.some((record) => record.meta.requiresAuth)){
    if(await getCurrentUser()){
      next()
    }else{
      alert("Nu ai drepturile necesare")
      next("/")
    }
  }else{
    next()
  }
})

export default router
