<template>
  <button class="darkmodeBtn" @click="darkModeToggle()">
    <img src="/night-mode.png" class="poza1" />
    <img src="/brightness.png" class="poza2" />
  </button>
</template>

<script>
export default {
  data() {
    return {
      darkMode: localStorage.getItem("darkMode"),
    }
  },
  mounted() {
    if (this.darkMode == "true") {
      document.documentElement.classList.add("darkmode")
    } else {
      document.documentElement.classList.remove("darkmode")
    }
  },
  methods: {
    darkModeToggle() {
      this.darkMode = !this.darkMode
      localStorage.setItem("darkMode", this.darkMode)
      if (this.darkMode) {
        document.documentElement.classList.add("darkmode")
      } else {
        document.documentElement.classList.remove("darkmode")
      }
    },
  },
}
</script>
<style scoped>
@import "../assets/dkmodebtn.css";
</style>
