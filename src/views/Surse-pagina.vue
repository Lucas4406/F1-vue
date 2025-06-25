<template>
  <div
      class="flex flex-col items-center justify-center min-h-screen w-full px-4 py-8 text-center text-gray-800 surse-text"
      v-once
  >
    <p class="text-5xl font-bold mb-8">Sources used:</p>

    <div class="flex flex-col gap-3 mb-8">
      <a
          class="text-xl lg:text-lg underline hover:text-blue-600 transition"
          href="https://www.formula1.com"
          target="_blank"
          rel="noopener noreferrer"
      >
        Formula 1 website
      </a>
      <a
          class="text-xl lg:text-lg underline hover:text-blue-600 transition"
          href="https://www.RaceFans.net"
          target="_blank"
          rel="noopener noreferrer"
      >
        RaceFans website
      </a>
      <a
          class="text-xl lg:text-lg underline hover:text-blue-600 transition"
          href="https://github.com/jolpica/jolpica-f1/blob/main/docs/README.md"
          target="_blank"
          rel="noopener noreferrer"
      >
        Jolpica F1 API
      </a>
      <a
          class="text-xl lg:text-lg underline hover:text-blue-600 transition"
          href="https://openf1.org/"
          target="_blank"
          rel="noopener noreferrer"
      >
        OpenF1 data API
      </a>
    </div>

    <p class="text-lg lg:text-base max-w-3xl leading-relaxed mb-4 px-2">
      <strong>Disclaimer:</strong> GridFanHub is unofficial and is not associated in any way with Formula One companies, any specific Formula 1 team, or any Formula 1 driver. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V. All assets used, including logos, images, and other copyrighted materials, are owned by the respective teams, drivers, and other entities. GridFanHub is an independent entity and does not claim to have any official relationship or partnership with Formula One companies, any specific Formula 1 team, or any Formula 1 driver. Any references to Formula One, F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX, or related marks are made solely for editorial purposes and do not imply any endorsement, sponsorship, or affiliation.
    </p>

    <p class="text-lg lg:text-base text-gray-600 source">Contact email: f1.vue.web@gmail.com</p>
  </div>
</template>

<script setup>
  import { useHead } from "@vueuse/head"
  useHead({
    title: "GridFanHub | Information page",
    meta: [
      {
        name: "description",
        content:
            "More information about this website",
      },
    ],
    link: [
      {
        rel: "canonical",
        href: "https://gridfanhub.com/info",
      },
    ],
  })
</script>
