<template>
  <a
      :href="stire.linkPost"
      target="_blank"
      rel="noopener noreferrer"
      class="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-300 overflow-hidden flex flex-col md:w-10/12 md:mx-auto md:min-h-[500px] lg:w-full lg:min-h-[460px] racefansgrid"
  >
    <div class="p-5 flex flex-col h-full">
      <h3 class="text-3xl lg:text-xl font-semibold text-gray-800 mb-2">{{ stire.titlu }}</h3>

      <p class="text-lg lg:text-base text-gray-500 mb-1">
        <strong>Author:</strong> {{ stire.autor || "Unknown" }}
      </p>
      <p class="text-lg lg:text-base text-gray-500 mb-1">
        <strong>Published:</strong> {{ formatDate(stire.dataPublicare) }}
      </p>

      <p class="text-lg lg:text-base text-gray-700 mt-2 line-clamp-4 flex-1">
        {{ stire.descriere }}
      </p>

      <div class="mt-4 flex justify-between items-center">
        <span class="text-base lg::text-sm text-gray-400">{{ stire.categorii?.[0] }}</span>
        <span class="text-lg lg::text-base text-blue-600 hover:underline read-more">Read more on RaceFans →</span>
      </div>

      <span class="text-lg lg::text-base text-gray-400 mt-4 block">Source: RaceFans.net</span>
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
