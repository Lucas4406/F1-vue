<template>
  <a
      :href="stire.linkPost"
      target="_blank"
      rel="noopener noreferrer"
      class="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 flex flex-col w-full min-h-[460px] racefansgrid"
  >
    <div class="p-5 flex flex-col h-full">
      <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{{ stire.titlu }}</h3>

      <p class="text-sm sm:text-base text-gray-500 mb-1">
        <strong>Author:</strong> {{ stire.autor || "Unknown" }}
      </p>
      <p class="text-sm sm:text-base text-gray-500 mb-1">
        <strong>Published:</strong> {{ formatDate(stire.dataPublicare) }}
      </p>

      <p class="text-sm sm:text-base text-gray-700 mt-2 line-clamp-4 flex-1">
        {{ stire.descriere }}
      </p>

      <div class="mt-4 flex justify-between items-center">
        <span class="text-xs sm:text-sm text-gray-400">{{ stire.categorii?.[0] }}</span>
        <span class="text-sm sm:text-base text-blue-600 hover:underline read-more">Read more →</span>
      </div>

      <span class="text-sm sm:text-base text-gray-400 mt-4 block">Source: RaceFans.net</span>
    </div>
  </a>
</template>

<script setup>
defineProps({
  stire: Object,
})

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("ro-RO", options)
}
</script>
