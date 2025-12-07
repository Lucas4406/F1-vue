<template>
  <div
      class=" bg-yellow-400 text-black p-4 rounded-xl shadow-lg mb-6 mx-4 animate-pulse-slow border border-yellow-500"
  >
    <div class="flex items-start flex-col gap-3">
        <h2 class="font-bold text-xl lg:text-lg">We're moving to a new domain!</h2>
        <p class="text-lg lg:text-md mt-1">
          GridFanHub is now transitioning to
          <a
              href="https://beta.gridfanhub.com"
              target="_blank"
              class="underline font-semibold"
          >
            beta.gridfanhub.com
          </a>.
          A complete redesign is in progress — expect improvements, new features, and a faster experience.
        </p>

        <p class="text-lg lg:text-md mt-1 font-medium">
          The new version is still a work in progress, but you can already explore it!
        </p>
      </div>
  </div>
</template>

<script setup>
// No logic required — static announcement component
</script>

<style scoped>
/* Soft pulse animation to draw attention without being annoying */
@keyframes pulse-slow {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
  100% {
    opacity: 1;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite;
}
</style>
