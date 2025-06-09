<template>
  <div class="h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4">
    <div class="text-6xl font-bold text-red-500 mb-4">404</div>
    <h1 class="text-2xl md:text-3xl font-semibold mb-2">The page you're looking for can't be found</h1>
    <p class="text-gray-600 mb-6">It might have been moved, deleted, or never existed.</p>
    <button
        @click="goHome"
        class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-300"
    >
      Go back to homepage
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => {
  router.push('/')
}
</script>
