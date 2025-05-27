<template>
  <transition name="fade">
    <button
        v-if="isVisible"
        class="scrollTopBtn"
        @click="scrollToTop"
        aria-label="Scroll to top"
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
    }
  },
  mounted() {
    window.addEventListener("scroll", this.checkScroll)
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.checkScroll)
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    checkScroll() {
      this.isVisible = window.scrollY > 300
    },
  },
}
</script>

<style scoped>
.scrollTopBtn {
  width: 60px;
  height: 60px;
  background-color: red;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 150ms ease-in-out;
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.scrollTopBtn:hover {
  transform: scale(1.1);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
