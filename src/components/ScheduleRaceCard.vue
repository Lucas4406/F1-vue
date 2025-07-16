<template>
  <div class="race-card-container">
    <div class="timeline-dot" :class="{ 'is-current-dot': isCurrent }"></div>

    <router-link
        :to="to"
        class="race-card block border-2 border-solid rounded-lg p-5 w-full text-black transition-transform duration-300 hover:scale-[1.02]"
        :class="{ 'border-red-500 shadow-lg': isCurrent }"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">{{ race.round }}. {{ race.raceName }}</h2>
        <span class="text-lg font-semibold text-gray-600">{{ circuitName }}</span>
      </div>

      <div class="session-grid">
        <div v-for="(day, date) in groupedSessions" :key="date" class="day-group">
          <h3 class="text-md font-bold text-gray-800 border-b-2 border-gray-200 pb-1 mb-2">
            {{ formatDate(date) }}
          </h3>
          <ul>
            <li v-for="session in day" :key="session.name" class="flex justify-between items-center py-1">
              <span class="flex items-center gap-2 text-gray-700">
                <i :class="getIconForSession(session.name)"></i>
                {{ session.name }}
              </span>
              <span class="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded-md text-sm">
                {{ session.time }}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <p class="text-gray-600 text-sm pt-4 text-right">View full details & results →</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "RaceCard",
  props: {
    race: {
      type: Object,
      required: true,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // This computed property transforms the flat race data into a structured object grouped by day.
    // This is MUCH cleaner than a dozen v-if statements in the template.
    groupedSessions() {
      const sessions = {};
      const addSession = (name, sessionData, duration) => {
        if (!sessionData || !sessionData.date || !sessionData.time) return;

        const date = sessionData.date;
        if (!sessions[date]) {
          sessions[date] = [];
        }

        sessions[date].push({
          name: name,
          time: this.formatSessionTime(sessionData, duration),
        });
      };

      // Map old session names to new ones and define their durations
      addSession("Practice 1", this.race.FirstPractice, 60);
      if (this.race.Sprint) {
        addSession("Sprint Quali", this.race.SprintQualifying, 44);
        addSession("Sprint", this.race.Sprint, 60);
      } else {
        addSession("Practice 2", this.race.SecondPractice, 60);
        addSession("Practice 3", this.race.ThirdPractice, 60);
      }
      addSession("Qualifying", this.race.Qualifying, 60);
      addSession("Race", { date: this.race.date, time: this.race.time }, 120);

      return sessions;
    },
    circuitName() {
      return this.race.Circuit.circuitId.charAt(0).toUpperCase() + this.race.Circuit.circuitId.slice(1).replace(/_/g, " ");
    },
    to() {
      return {
        name: 'Meeting',
        params: {
          an: this.race.season,
          meeting_name: this.race.raceName.replace(/\s+/g, '-').toLowerCase()
        }
      }
    }
  },
  methods: {
    formatSessionTime(session, extraMinutes) {
      const startDateTime = new Date(`${session.date}T${session.time}`);
      if (session.name === "Race") { // Race only has a start time in API
        return startDateTime.toLocaleTimeString("ro-RO", { timeStyle: "short" });
      }

      const endDateTime = new Date(startDateTime.getTime() + extraMinutes * 60000);

      const startTime = startDateTime.toLocaleTimeString("ro-RO", { timeStyle: "short" });
      const endTime = endDateTime.toLocaleTimeString("ro-RO", { timeStyle: "short" });

      return `${startTime} - ${endTime}`;
    },
    formatDate(dateString) {
      const date = new Date(`${dateString}T12:00:00Z`); // Use midday to avoid timezone shifts
      return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    },
    getIconForSession(sessionName) {
      // For this to work, you need to add an icon library like Font Awesome
      // to your project's index.html
      if (sessionName.includes('Practice')) return 'fas fa-stopwatch';
      if (sessionName.includes('Quali')) return 'fas fa-flag-checkered';
      if (sessionName.includes('Sprint')) return 'fas fa-bolt';
      if (sessionName.includes('Race')) return 'fas fa-trophy';
      return 'fas fa-calendar-alt';
    }
  },
};
</script>

<style scoped>
/* Scoped styles for the timeline effect */
.race-card-container {
  position: relative;
  padding-left: 40px; /* Space for the timeline line and dot */
  margin-bottom: 2rem;
}

.timeline-dot {
  position: absolute;
  left: -9px; /* (2px line width + 16px dot width) / 2 */
  top: 1.5rem; /* Align with the card title */
  width: 20px;
  height: 20px;
  background-color: white;
  border: 3px solid #9ca3af; /* gray-400 */
  border-radius: 50%;
  z-index: 10;
}

.timeline-dot.is-current-dot {
  border-color: #ef4444; /* red-500 */
  transform: scale(1.2);
}

.race-card {
  border-color: #d1d5db; /* gray-300 */
}

.race-card.border-red-500 {
  border-color: #ef4444;
}

/* On large screens, arrange session days into a grid */
@media (min-width: 768px) {
  .session-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
}
</style>