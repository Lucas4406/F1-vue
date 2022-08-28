import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import PrimeVue from 'primevue/config'

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.mount('#app')


import ProgressSpinner from 'primevue/progressspinner'

app.component('ProgressSpinner', ProgressSpinner)
