import { createRouter, createWebHistory } from "vue-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import Clasament from "../views/Clasament.vue"
import Home from "../views/Home.vue"
import Echipe from "../views/Echipe.vue"
import Clasamentpiloti from "../views/Clasamentpiloti.vue"
import Calificari from "../views/Calificari.vue"
import Curse from "../views/Curse.vue"
import Program from "../views/Program.vue"
import {authRequest} from "@/functions/authRequest";

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
      path: "/vote/:an/:meeting_name",
      name: "MeetingVote",
      component: () => import("../views/VotingPage/MeetingVote.vue"),
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
      path: "/admin/test",
      name: "TestPage",
      component: () => import("../views/AdminPages/TestPage.vue"),
      meta: {
        Admin: true,
      },
    },
    {
      path: "/admin/driver-editor",
      name: "DriverEditor",
      component: () => import("../views/AdminPages/DriverEditor.vue"),
      meta: {
        Admin: true,
      },
    },
    {
      path: "/admin/team-editor",
      name: "TeamEditor",
      component: () => import("../views/AdminPages/TeamEditor.vue"),
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
      path: "/info",
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
      path: "/privacy-policy",
      name: "PrivacyPolicyPage",
      component: () => import("../views/PrivacyPolicy.vue"),
    },
    {
      path: "/terms-of-service",
      name: "TOSPage",
      component: () => import("../views/TermsOfService.vue"),
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
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  // Redirect dacă e deja logat și accesează /signup
  if (to.meta.isAuth && isLoggedIn) {
    alert("Already logged in!");
    return next("/");
  }

  // Pagini protejate - doar useri logați
  if (to.meta.requiresAuth && !isLoggedIn) {
    alert("You have to log in to view this page!");
    return next("/login");
  }

  // Pagini doar pentru Admin
  if (to.meta.Admin) {
    if (!isLoggedIn) {
      alert("Log in to admin account first!");
      return next("/login");
    }

    try {
      await authRequest("GET", `${import.meta.env.VITE_API_LINK}/check-admin`);
      return next();
    } catch (err) {
      if (err.response?.status === 403) {
        alert("You are not the admin");
      } else if (err.response?.status === 401) {
        alert("Invalid or expired token. Please log in again.");
      } else {
        alert("Server error during admin check");
      }
      return next("/");
    }
  }

  next();
});

export default router
