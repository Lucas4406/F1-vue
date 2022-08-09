
<template>
  <Navbar />
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
  name: "App",
  data () {
    return {
      titluu: true,
      titlu: "Hehe Front-end Dev",
      count: 0
    }
  },
  methods: {
    handleEvent(){
      this.titluu = !this.titluu
    }
  },
  components: {
    Navbar
  }
}
</script>


<style>
  @import "./assets/navbar.css";
  @import "./assets/main.css";
</style>
