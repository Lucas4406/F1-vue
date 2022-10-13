import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import Home from "../views/Home.vue"



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
      component: () => import('@/views/Echipe.vue')
    },
    {
      path: "/program",
      name: "Program",
      component: () => import('@/views/Program.vue')
    },
    {
      path: "/clasament-echipe",
      name: "Clasament",
      component: () => import('@/views/Clasament.vue')
    },
    {
      path: "/rezultate-calificari/:an?",
      name: "Calificari",
      component: () => import('@/views/Calificari.vue')
    },
    {
      path: "/rezultate-curse/:an?",
      name: "Curse",
      component: () => import('@/views/Curse.vue')
    },
    {
      path: "/clasament-piloti",
      name: "Clasamentpiloti",
      component: () => import('@/views/Clasamentpiloti.vue')
    },
    {
      path: '/stiri',
      name: 'Stiri',
      component: () => import('@/views/Stiri.vue')
    },
    {
      path: '/joc',
      name: 'Joc',
      component: () => import('@/views/Joculet.vue')
    },
    {
      path: '/istorie',
      name: 'Istorie',
      component: () => import('@/views/Istorie.vue')
    },
    {
      path: "/live",
      name: "Live",
      component: () => import('@/views/Live.vue')
    },
    {
      path: "/test",
      name: "Formtest",
      component: () => import('@/views/Formtest.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "Login",
      component: () => import('@/views/Login.vue')
    },
    {
      path: "/signup",
      name: "Signup",
      component: () => import('@/views/signup.vue')
    },
    {
      path: "/surse",
      name: "Surse",
      component: () => import('@/views/Surse-pagina.vue')
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import('@/views/profile/profile.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/updateprofile",
      name: "updateForm",
      component: () => import('@/views/updateForm.vue'),
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
