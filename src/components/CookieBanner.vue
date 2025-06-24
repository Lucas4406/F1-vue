<template>
  <div
      v-if="show"
      class="fixed bottom-4 left-4 z-50"
  >
    <div class="relative max-w-sm w-full">
      <!-- Butonul de închidere, poziționat în afara colțului cardului -->
      <button
          @click="close"
          class="absolute -top-3 -right-3 bg-white border border-gray-300 rounded-full px-2 py-1 text-xs shadow hover:bg-gray-100 cursor-pointer"
          aria-label="Close"
      >
        ✕
      </button>
      <!-- Cardul -->
      <div class="p-4 bg-white shadow-lg rounded-md text-base border border-gray-300 calendar-schedule">
        <p class="text-gray-800 source text-xl lg:text-lg">
          This website uses photos from the official F1 website that may have cookies attached to them.
          If you wish to not be tracked, head over to www.formula1.com and decline all cookies.
          If you create an account using Google or Github they may use cookies.
        </p>
      </div>
    </div>
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
