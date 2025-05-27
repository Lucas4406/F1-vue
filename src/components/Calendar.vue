<template>
  <div class="calendar max-w-3xl mx-auto p-4 border-black border-2 border-solid rounded-md mb-4">
    <div class="flex justify-between items-center mb-4">
      <button
          @click="prevMonth"
          class="px-4 py-2 bg-black text-white rounded hover:bg-red-900 transition"
      >
        Previous month
      </button>
      <h2 class="text-xl font-bold">{{ monthYear }}</h2>
      <button
          @click="nextMonth"
          class="px-4 py-2 bg-black text-white rounded hover:bg-red-900 transition"
      >
        Next month
      </button>
    </div>

    <div class="grid grid-cols-7 text-center font-semibold mb-2">
      <div v-for="(day, index) in daysOfWeek" :key="index" class="p-3 min-w-[70px]">
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-2 text-sm">
      <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
          'border rounded p-3 min-h-[110px] flex flex-col min-w-[70px]',
          { 'text-gray-400': !day.currentMonth },
          { 'bg-red-100': hasRaces(day.date) }
        ]"
      >
        <div class="font-bold mb-2">{{ day.date.getDate() }}</div>

        <div v-if="hasRaces(day.date)" class="flex flex-col gap-2 overflow-auto max-h-[80px]">
          <div
              v-for="(race, i) in getRacesForDay(day.date)"
              :key="i"
              class="bg-red-200 rounded px-2 py-1 cursor-pointer hover:bg-red-300 text-xs truncate"
              :title="race.raceName + ' - ' + formatTime(race.date, race.time)"
          >
            {{ race.raceName }} <br />
            <small>{{ formatTime(race.date, race.time) }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Calendar",
  props: {
    races: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentDate: new Date(),
      daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    };
  },
  computed: {
    monthYear() {
      return this.currentDate.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
      });
    },
    calendarDays() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();

      // Prima zi a lunii
      const firstDayOfMonth = new Date(year, month, 1);

      // Ziua săptămânii (luni=0, duminică=6)
      let startDay = firstDayOfMonth.getDay() - 1;
      if (startDay < 0) startDay = 6;

      // Data de start (prima zi afișată în calendar)
      const startDate = new Date(year, month, 1 - startDay);

      // 42 de zile (6 săptămâni)
      const days = [];

      for (let i = 0; i < 42; i++) {
        const dayDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate() + i
        );
        days.push({
          date: dayDate,
          currentMonth: dayDate.getMonth() === month,
        });
      }
      return days;
    },
  },
  methods: {
    prevMonth() {
      this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth() - 1,
          1
      );
    },
    nextMonth() {
      this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth() + 1,
          1
      );
    },
    hasRaces(date) {
      return this.races.some((race) => this.isSameDay(date, race.date));
    },
    getRacesForDay(date) {
      return this.races.filter((race) => this.isSameDay(date, race.date));
    },
    isSameDay(date1, date2) {
      // date2 vine din API ca string, convertim la Date
      const d2 = new Date(date2);
      return (
          date1.getDate() === d2.getDate() &&
          date1.getMonth() === d2.getMonth() &&
          date1.getFullYear() === d2.getFullYear()
      );
    },
    formatTime(dateStr, timeStr) {
      if (!dateStr || !timeStr) return "";
      const date = new Date(dateStr + "T" + timeStr);
      return date.toLocaleTimeString("ro-RO", { timeStyle: "short" });
    },
  },
};
</script>

<style scoped>
/* Poți adăuga stiluri suplimentare aici */
</style>
