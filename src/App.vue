
<template>
  <div id="nav" v-if="loaded">
    <Navbar />
  </div>
  <main id="main-content" v-if="loaded">
    <Suspense>
        <router-view />
    </Suspense>
  </main>
  <div id="footer" v-if="loaded">
    <Footertag />
  </div>
  <GreetingPageVue v-if="!loaded" />
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footertag from './components/Footer.vue'
import GreetingPageVue from './components/GreetingPage.vue'
/* import {checkStore} from "./functions/checkStore.js" */


export default {
  name: "App",
  inject: ["store"],
  components: {
    Navbar,
    Footertag,
    GreetingPageVue
  },
  data() {
    return {
      loaded: false
    }
  },
  created() {
    /* checkStore() */
    if(this.store.state == null){
      this.loaded = false
    }else{
      this.loaded = true
    }
  },
}
</script>


<style>
  @import "./components/css/navbar.css";
  @import "./assets/main.css";
</style>
