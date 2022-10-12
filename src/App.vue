
<template>
    <Navbar />
    <Footertag />
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footertag from './components/Footer.vue'


export default {
  name: "App",
  components: {
    Navbar,
    Footertag,
  }
}
</script>


<style>
  @import "./components/css/navbar.css";
  @import "./assets/main.css";
</style>
