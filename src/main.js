import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import { MotionPlugin } from '@vueuse/motion'
import store from "./store"
import './assets/main.css'
import './index.css'
import "./firebase/index.js"
const app = createApp(App)

app.provide("store", store)

app.use(router)
app.use(PrimeVue)
app.use(MotionPlugin)
app.mount('#app')



import ProgressSpinner from 'primevue/progressspinner'



app.component('ProgressSpinner', ProgressSpinner)



