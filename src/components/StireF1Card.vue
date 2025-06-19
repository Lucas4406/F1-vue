<template>
  <a
      :href="`https://formula1.com/en/latest/article/${stire.slug}.${stire.id}`"
      target="_blank"
      rel="noopener noreferrer"
      class="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-300 overflow-hidden flex flex-col w-full min-h-[460px] racefansgrid"
  >
    <img :src="stire.thumbnail.image.new_path" :alt="stire.title" loading="lazy" class="w-full h-60 object-cover" />
    <div class="p-6 flex flex-col justify-between flex-1">
      <h3 class="text-xl font-semibold text-gray-800 mb-3 leading-snug">
        {{ stire.title }}
      </h3>
      <span class="text-sm text-gray-400 mt-auto">Source: Formula1.com</span>
    </div>
  </a>
</template>

<script setup>
defineProps({
  stire: Object,
})
</script>