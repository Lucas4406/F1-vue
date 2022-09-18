
<template>
  <keep-alive>
    <Navbar />
  </keep-alive>
  <keep-alive>
    <Footer />
  </keep-alive>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

export default {
  name: "App",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      loaded: false
    }
  },
  mounted() {
    this.loaded = true
  },
}
</script>


<style>
  @import "./components/css/navbar.css";
  @import "./assets/main.css";
</style>
