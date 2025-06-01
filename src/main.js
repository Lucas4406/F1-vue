import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import PrimeVue from "primevue/config"
import { MotionPlugin } from "@vueuse/motion"
import { createPinia } from 'pinia'
import { createHead } from "@vueuse/head"
import store from "./store"
import "./assets/main.css"
import "./index.css"
import "./firebase/index.js"
import { createVuetify } from "vuetify"
import { VLazy } from "vuetify/components/VLazy"
import { VImg } from "vuetify/components/VImg"
import ProgressSpinner from "primevue/progressspinner"

const vuetify = createVuetify({
  components: {
    VLazy,
    VImg,
  },
})

const app = createApp(App)

const pinia = createPinia()
const head = createHead()

app.use(pinia)
app.use(head)
app.provide("store", store) // dacă ai nevoie

app.use(router)
app.use(PrimeVue)
app.use(MotionPlugin)
app.use(vuetify)

app.component("ProgressSpinner", ProgressSpinner)  // Înregistrează componenta înainte de mount

app.mount("#app")
