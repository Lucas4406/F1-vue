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
      path: "/track-vizualizer",
      name: "Trackvizualizer",
      component: () => import("@/views/Trackvizualizer.vue"),
    },
    {
      path: "/teams",
      name: "Echipe",
      component: Echipe,
    },
    {
      path: "/schedule",
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
      path: "/schedule/:an/:meeting_name",
      name: "Meeting",
      component: () => import("../views/meeting.vue"),
    },
    {
      path: "/team-standings",
      name: "Clasament",
      component: Clasament,
    },
    {
      path: "/qualifying-results/:an?",
      name: "Calificari",
      component: Calificari,
    },
    {
      path: "/race-results/:an?",
      name: "Curse",
      component: Curse,
    },
    {
      path: "/drivers",
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
      path: "/drivers/:id",
      name: "Pilotdetails",
      component: () => import("../views/Pilotview.vue"),
    },
    {
      path: "/reaction-game",
      name: "Joc",
      component: () => import("../views/Joculet.vue"),
    },
    {
      path: "/f1-history",
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
      path: "/update-teams",
      name: "updateTeams",
      component: () => import("../views/updateTeams.vue"),
      meta: {
        Admin: true,
      },
    },
    {
      path: "/admin",
      name: "AdminPage",
      component: () => import("../views/AdminPages/AdminDashboard.vue"),
      meta: {
        Admin: true,
      },
    },
    {
      path: "/admin/season-events",
      name: "SeasonEvents",
      component: () => import("../views/AdminPages/SeasonEvents.vue"),
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
      path: "/auth-action",
      name: "Confirmed&ResetPage",
      component: () => import("../views/ResetPassword.vue"),
    },
    {
      path: "/forgot-password",
      name: "ForgotPassword",
      component: () => import("../views/ForgotPassword.vue"),
    },
    {
      path: "/confirm",
      name: "ConfirmPage",
      component: () => import("../views/ConfirmPage.vue"),
    },
    {
      path: "/update-profile",
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
      alert("Can't access this page")
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
      alert("Can't access this page")
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
      alert("Don't have the right role for this page")
      next("/login")
    }
  } else {
    next()
  }
})

export default router
