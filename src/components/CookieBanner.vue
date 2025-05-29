<template>
  <div
      v-if="show"
      class="fixed bottom-4 left-4 max-w-sm w-full p-4 bg-white shadow-lg rounded-md text-base border border-gray-300 z-50 calendar-schedule"
  >
    <button
        @click="close"
        class="absolute top-2 right-2 text-black text-xs calendar-schedule border-0 cursor-pointer"
        aria-label="Close"
    >
      ✕
    </button>
    <p class="text-gray-800 source">
      This website uses cookies to understand how you use our site and give you a better experience.
      By continuing to browse or by closing this banner, you consent to the use of cookies.
      If you wish to change your cookies options, you can manage this in your browser settings.
    </p>
  </div>
</template>

<script>
export default {
  name: "CookieBanner",
  data() {
    return {
      show: false,
    }
  },
  mounted() {
    const accepted = localStorage.getItem("cookieAccepted")
    if (!accepted) {
      this.show = true
    }
  },
  methods: {
    close() {
      localStorage.setItem("cookieAccepted", true)
      this.show = false
    },
  },
}
</script>

<style scoped>
/* Stiluri extra (opțional) dacă nu folosești Tailwind */
</style>
