<template>
  <div class="mt-6 flex justify-center w-screen sm:mb-6 lg:mb-0" id="hero">
    <div
        class="bg-white sm:max-w-xl sm:w-xl lg:max-w-4xl lg:w-4xl p-6 rounded-lg w-[100%] shadow-lg border-t-4 border-red-600 program-hero"
    >
      <a
          @click="getItem(`#${circuitName.replace(/\s/g, '').toLowerCase()}`)"
          class="cursor-pointer"
          style="text-decoration: none; color: black"
      >
        <div class="flex justify-between items-start mb-4 pb-4 border-b">
          <div>
            <p class="text-md font-bold text-red-600">Round {{ round }}</p>
            <p class="text-3xl font-bold source">{{ Name }}</p>
          </div>
          <p class="text-xl font-semibold text-right text-red-600">{{ circuitName }}</p>
        </div>

        <div class="space-y-6">
          <div v-for="(day, index) in sessionsByDay" :key="day.dayName">
            <hr v-if="index > 0" class="my-4" />

            <h3 class="text-2xl font-bold mb-3 source">{{ day.dayName }} <span class="text-base font-normal text-gray-500 source">{{ formatDate(day.date) }}</span></h3>
            <div class="space-y-3 text-lg">
              <div v-for="session in day.sessions" :key="session.name" class="flex justify-between items-center">
                <p class="text-xl text-gray-800 source">{{ session.name }}</p>
                <p class=" text-xl font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-md racefansgrid">{{ session.time }}</p>
              </div>
            </div>
          </div>
        </div>

        <p class="text-md text-gray-500 italic mt-6 text-center source">
          * All times are shown in your local time zone.
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
    getItem: Function,
  },
  computed: {
    /**
     * NEW: A computed property to group sessions by day.
     * This processes the 'hero' prop and returns an array of day objects,
     * each containing a list of sessions for that day.
     * This makes the template much cleaner.
     */
    sessionsByDay() {
      const allSessions = [];
      const { FirstPractice, SecondPractice, ThirdPractice, Qualifying, SprintQualifying, Sprint } = this.hero;

      // Add all available sessions to a flat list
      if (FirstPractice?.date) allSessions.push({ name: "Practice 1", ...this.formatSession(FirstPractice, 60) });

      if (Sprint?.date) {
        // Sprint Weekend format
        if (SprintQualifying?.date) allSessions.push({ name: "Sprint Qualifying", ...this.formatSession(SprintQualifying, 44) });
        if (Sprint?.date) allSessions.push({ name: "Sprint Race", ...this.formatSession(Sprint, 60) });
      } else {
        // Regular Weekend format
        if (SecondPractice?.date) allSessions.push({ name: "Practice 2", ...this.formatSession(SecondPractice, 60) });
        if (ThirdPractice?.date) allSessions.push({ name: "Practice 3", ...this.formatSession(ThirdPractice, 60) });
      }

      if (Qualifying?.date) allSessions.push({ name: "Qualifying", ...this.formatSession(Qualifying, 60) });
      if (this.hero.date) allSessions.push({ name: "Race", date: this.hero.date, time: this.formatRaceTime() });

      // Group the flat list by date
      const grouped = allSessions.reduce((acc, session) => {
        if (!session.date) return acc;
        acc[session.date] = acc[session.date] || [];
        acc[session.date].push(session);
        return acc;
      }, {});

      // Format the grouped data into the final structure for the template
      return Object.keys(grouped).map(date => {
        const dayDate = new Date(date + "T00:00:00");
        return {
          date: date,
          dayName: dayDate.toLocaleDateString('en-US', { weekday: 'long' }),
          sessions: grouped[date]
        }
      }).sort((a,b) => new Date(a.date) - new Date(b.date)); // Ensure days are in chronological order
    }
  },
  methods: {
    // This method now returns an object with date and time for easier grouping
    formatSession(session, extraMinutes) {
      if (!session?.date || !session?.time) return null;
      const start = new Date(`${session.date}T${session.time}`);
      const end = new Date(start.getTime() + extraMinutes * 60000);
      return {
        date: session.date,
        time:
            start.toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
            " - " +
            end.toLocaleTimeString("ro-RO", { timeStyle: "short" }),
      };
    },
    // Specific formatter for the main race
    formatRaceTime() {
      return new Date(this.hero.date + 'T' + this.hero.time).toLocaleTimeString('ro-RO', { timeStyle: 'short' })
    },
    // This date formatter is cleaner and more readable
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString + "T00:00:00");
      return date.toLocaleDateString("en-GB", {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    },
  },
};
</script>

<style scoped>
</style>