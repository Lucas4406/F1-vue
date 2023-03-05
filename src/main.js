import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import PrimeVue from "primevue/config"
import { MotionPlugin } from "@vueuse/motion"
import store from "./store"
import "./assets/main.css"
import "./index.css"
import "./firebase/index.js"
import { createVuetify } from "vuetify"
import { VLazy } from "vuetify/components/VLazy"
import { VImg } from "vuetify/components/VImg"

const vuetify = createVuetify({
  components: {
    VLazy,
    VImg,
  },
})
const app = createApp(App)

app.provide("store", store)

app.use(router)
app.use(PrimeVue)
app.use(MotionPlugin)
app.use(vuetify)
app.mount("#app")

import ProgressSpinner from "primevue/progressspinner"

app.component("ProgressSpinner", ProgressSpinner)
