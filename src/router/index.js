import { createRouter, createWebHistory } from "vue-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import Clasament from "../views/Clasament.vue"
import Home from "../views/Home.vue"
import Echipe from "../views/Echipe.vue"
import Clasamentpiloti from "../views/Clasamentpiloti.vue"
import Calificari from "../views/Calificari.vue"
import Curse from "../views/Curse.vue"
import Program from "../views/Program.vue"

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
      component: Echipe,
    },
    {
      path: "/program",
      name: "Program",
      component: Program,
      children: [
        {
          path: ":meeting_name",
          name: "Meeting",
          component: () => import("../views/meeting.vue"),
        },
      ],
    },
    {
      path: "/program/:an/:meeting_name",
      name: "Meeting",
      component: () => import("../views/meeting.vue"),
    },
    {
      path: "/clasament-echipe",
      name: "Clasament",
      component: Clasament,
    },
    {
      path: "/rezultate-calificari/:an?",
      name: "Calificari",
      component: Calificari,
    },
    {
      path: "/rezultate-curse/:an?",
      name: "Curse",
      component: Curse,
    },
    {
      path: "/clasament-piloti",
      name: "Clasamentpiloti",
      component: Clasamentpiloti,
      children: [
        {
          path: ":id",
          name: "Pilotdetails",
          component: () => import("../views/Pilotview.vue"),
        },
      ],
    },
    {
      path: "/clasament-piloti/:id",
      name: "Pilotdetails",
      component: () => import("../views/Pilotview.vue"),
    },
    {
      path: "/joc",
      name: "Joc",
      component: () => import("../views/Joculet.vue"),
    },
    {
      path: "/istorie",
      name: "Istorie",
      component: () => import("../views/Istorie.vue"),
    },
    {
      path: "/live",
      name: "Live",
      component: () => import("../views/Live.vue"),
    },
    {
      path: "/fun",
      name: "Fun",
      component: () => import("../views/fun.vue"),
    },
    {
      path: "/test",
      name: "Formtest",
      component: () => import("../views/Formtest.vue"),
      meta: {
        Admin: true,
      },
    },
    {
      path: "/updateteams",
      name: "updateTeams",
      component: () => import("../views/updateTeams.vue"),
      meta: {
        Admin: true,
      },
    },
    {
      path: "/admin",
      name: "AdminPage",
      component: () => import("../views/Admin.vue"),
      meta: {
        Admin: true,
      },
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/login.vue"),
    },
    {
      path: "/signup",
      name: "Signup",
      component: () => import("../views/signup.vue"),
      meta: {
        isAuth: true,
      },
    },
    {
      path: "/sources",
      name: "Surse",
      component: () => import("../views/Surse-pagina.vue"),
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("../views/profile/profile.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/change-password",
      name: "ResetPassword",
      component: () => import("../views/ResetPassword.vue"),
    },
    {
      path: "/forgot-password",
      name: "ForgotPassword",
      component: () => import("../views/ForgotPassword.vue"),
    },
    {
      path: "/updateprofile",
      name: "updateForm",
      component: () => import("../views/updateForm.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/:catchAll(.*)",
      component: () => import("../views/NotFound.vue"),
    },
  ],
})

function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.isAuth)) {
    if (await getCurrentUser()) {
      alert("Nu poti accesa aceasta pagina")
      next("/")
    } else {
      next()
    }
  } else {
    next()
  }
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next()
    } else {
      alert("Nu poti accesa aceasta pagina")
      next("/")
    }
  } else {
    next()
  }
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.Admin)) {
    const user = getAuth()
    if (
      (await getCurrentUser()) &&
      user.currentUser.uid === import.meta.env.VITE_ADMIN_UID
    ) {
      next()
    } else {
      alert("Nu ai drepturile necesare")
      next("/login")
    }
  } else {
    next()
  }
})

export default router
