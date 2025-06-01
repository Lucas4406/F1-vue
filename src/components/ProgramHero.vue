<template>
  <div class="mt-6 flex justify-center w-screen sm:mb-6 lg:mb-0" id="hero">
    <div
        class="border-red-500 border-2 border-solid sm:max-w-xl sm:w-xl lg:max-w-4xl lg:w-4xl p-4 rounded-md w-[100%] animatie"
    >
      <a
          @click="getItem(`#${circuitName.replace(/\s/g, '').toLowerCase()}`)"
          style="text-decoration: none; color: black"
      >
        <div class="flex justify-between text-2xl mb-4 font-bold">
          <p>{{ round }}. {{ Name }}</p>
          <p>{{ circuitName }}</p>
        </div>
        <div class="text-2xl gap-2 flex flex-col">
          <div class="flex justify-between">
            <div class="flex justify-between w-[50%]">
              <p>FP1</p>
              <p>{{ formatDate(hero.FirstPractice.date) }}</p>
            </div>
            <p class="w-[50%] flex justify-end items-center">
              {{ formatSession(hero.FirstPractice, 60).timpul }}
            </p>
          </div>

          <div v-if="!hero.Sprint" class="flex justify-between">
            <div class="flex justify-between w-[50%]">
              <p>FP2</p>
              <p>{{ formatDate(hero.SecondPractice.date) }}</p>
            </div>
            <p class="w-[50%] flex justify-end items-center">
              {{ formatSession(hero.SecondPractice, 60).timpul }}
            </p>
          </div>

          <div v-if="hero.Sprint" class="flex justify-between">
            <div class="flex justify-between w-[50%]">
              <p>SprintQuali</p>
              <p>{{ formatDate(hero.SprintQualifying.date) }}</p>
            </div>
            <p class="w-[50%] flex justify-end items-center">
              {{ formatSession(hero.SprintQualifying, 44).timpul }}
            </p>
          </div>

          <div v-if="hero.Sprint" class="flex justify-between">
            <div class="flex justify-between w-[50%]">
              <p>Sprint</p>
              <p>{{ formatDate(hero.Sprint.date) }}</p>
            </div>
            <p class="w-[50%] flex justify-end items-center">
              {{ formatSession(hero.Sprint, 60).timpul }}
            </p>
          </div>

          <div v-if="!hero.Sprint" class="flex justify-between">
            <div class="flex justify-between w-[50%]">
              <p>FP3</p>
              <p>{{ formatDate(hero.ThirdPractice.date) }}</p>
            </div>
            <p class="w-[50%] flex justify-end items-center">
              {{ formatSession(hero.ThirdPractice, 60).timpul }}
            </p>
          </div>

          <div class="flex justify-between">
            <div class="flex justify-between w-[50%]">
              <p>Quali</p>
              <p>{{ formatDate(hero.Qualifying.date) }}</p>
            </div>
            <p class="w-[50%] flex justify-end items-center">
              {{ formatSession(hero.Qualifying, 60).timpul }}
            </p>
          </div>

          <div class="flex justify-between">
            <div class="flex justify-between w-[50%]">
              <p>Cursă</p>
              <p>{{ formatDate(hero.date) }}</p>
            </div>
            <p class="w-[50%] flex justify-end items-center">
              {{ new Date(hero.date + 'T' + hero.time).toLocaleTimeString('ro-RO', { timeStyle: 'short' }) }}
            </p>
          </div>
        </div>

        <p class="text-sm text-gray-600 italic mt-2">
          * All times shown are in your device's local time zone.
        </p>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeroRaceCard",
  props: {
    hero: Object,
    round: String,
    circuitName: String,
    Name: String,
    getItem: Function
  },
  methods: {
    formatSession(session, extraMinutes) {
      if (!session?.date || !session?.time) return null;
      const start = new Date(session.date + "T" + session.time);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + extraMinutes);
      return {
        timpul:
            start.toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
            " - " +
            end.toLocaleTimeString("ro-RO", { timeStyle: "short" }),
      };
    },
    formatDate(dateString) {
      if (!dateString) return "";
      return new Date(dateString)
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-");
    },
  },
};
</script>

<style scoped>
.animatie {
  transition: transform 300ms ease-in-out;
}
.animatie:hover {
  transform: scale(1.02);
}
</style>
