<template>
  <router-link
      :to="link"
      class="group block w-full max-w-2xl xl:max-w-4xl mx-auto xl:px-4 mt-4 py-6 md:py-8 rounded-xl bg-zinc-900 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
  >

  <div class="flex flex-col md:flex-row items-center gap-4 w-full overflow-hidden">
    <!-- Left: Circuit Image -->
    <div class="w-full md:w-1/3 aspect-[3/2] bg-zinc-800 rounded-lg overflow-hidden">
      <img
          :src="heroData.circuitSmallImage.url"
          :alt="`Poza circuit ${heroData.race.meetingCountryName}`"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 max-w-full"
      />
    </div>

    <!-- Right: Info -->
    <div class="w-full flex-1 space-y-3 text-center md:text-left flex flex-col justify-center overflow-hidden">
      <p class="text-red-500 text-base md:text-sm font-semibold uppercase tracking-wide">
        {{ heroData.meetingContext.status }}
      </p>
      <p class="text-3xl md:text-2xl font-bold">
        {{ heroData.race.meetingCountryName }}
      </p>
      <p class="text-gray-300 text-base md:text-sm">
        {{ heroData.inceput }} – {{ heroData.sfarsit }} {{ heroData.lunaCursaText }}
      </p>
    </div>

    <!-- Right: Sesiunea următoare -->
    <div
        v-if="nextSession"
        class="w-full flex-1 space-y-2 text-center md:text-left bg-zinc-800 rounded-lg p-4 flex flex-col justify-center overflow-hidden"
    >
      <p class="text-yellow-400 font-semibold uppercase text-sm">
        {{ sessionStatusText }}
      </p>
      <p class="text-xl md:text-lg font-bold">{{ nextSession.description }}</p>
      <p class="text-gray-300 text-base md:text-sm">
        {{ formatDate(nextSession.startTime, nextSession) }} - {{ formatTime(nextSession.startTime, nextSession) }}
      </p>
      <p
          v-if="nextSession.status === 'isNext'"
          class="text-red-500 font-mono text-lg mt-2"
      >
        {{ countdown }}
      </p>
    </div>
  </div>
  </router-link>
</template>


<script>
import {makeRequest} from "@/functions/makeRequest";

export default {
  props: ["heroData" , "link"],
  data() {
    return {
      nextSession: null,
      countdown: "",
      countdownInterval: null,
    };
  },
  computed: {
    sessionStatusText() {
      if (!this.nextSession) return "";
      if (this.nextSession.status === "isNext") return "Upcoming";
      if (this.nextSession.status === "isCurrent") return "Now";
      return "";
    },
  },
  async mounted() {
    this.findNextSession();
    if (this.nextSession && this.nextSession.status === "isNext") {
      const now = new Date();
      const start = this.getLocalStartTimeWithOffset(this.nextSession);
      const diff = start - now;
      const hours24 = 24 * 60 * 60 * 1000;
      if (diff > 0 && diff <= hours24) {
        this.startCountdown();
      }
    }
  },
  beforeUnmount() {
    clearInterval(this.countdownInterval);
  },
  methods: {
    findNextSession() {
      if (
          this.heroData &&
          this.heroData.meetingContext &&
          this.heroData.meetingContext.timetables
      ) {
        // cauta sesiunea cu status "isNext" sau "isCurrent"
        this.nextSession = this.heroData.meetingContext.timetables.find(
            (session) =>
                session.status === "isNext" || session.status === "isCurrent"
        );
      }
    },
    parseGmtOffset(offsetStr) {
      // ex: "+02:00" sau "-05:30"
      const sign = offsetStr.startsWith("-") ? -1 : 1;
      const [hours, minutes] = offsetStr.slice(1).split(":").map(Number);
      return sign * (hours * 60 + minutes);
    },

    getLocalStartTimeWithOffset(session) {
      // Extrage componentele datei din startTime (fara offset)
      const dt = session.startTime; // ex: "2025-06-01T15:00:00"
      const parts = dt.match(/\d+/g); // [2025,06,01,15,00,00]

      // Creem un timestamp UTC din componentele datei (fara offset)
      const utcTime = Date.UTC(
          parts[0],           // year
          parts[1] - 1,       // month (0-based)
          parts[2],           // day
          parts[3],           // hour
          parts[4],           // minute
          parts[5]            // second
      );

      // Obtinem offset-ul in minute
      const offsetMinutes = this.parseGmtOffset(session.gmtOffset);

      // Aplicam compensarea offset-ului: ora locala = UTC - offset
      const localTime = utcTime - offsetMinutes * 60 * 1000;

      return new Date(localTime);
    },

    startCountdown() {
      if (!this.nextSession) return;

      const now = new Date();
      const start = this.getLocalStartTimeWithOffset(this.nextSession);
      const diff = start - now;
      const hours24 = 24 * 60 * 60 * 1000;
      if (diff <= 0 || diff > hours24) {
        // Nu pornim countdown-ul daca sesiunea a inceput sau e la mai mult de 24h distanta
        this.countdown = "";
        return;
      }

      this.updateCountdown();
      this.countdownInterval = setInterval(() => {
        this.updateCountdown();
      }, 1000);
    },

    updateCountdown() {
      const now = new Date();
      const start = this.getLocalStartTimeWithOffset(this.nextSession);

      const diff = start - now;

      if (diff <= 0) {
        this.countdown = "Session started";
        clearInterval(this.countdownInterval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.countdown = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    },

    formatDate(dateString, session) {
      const localDate = this.getLocalStartTimeWithOffset(session);
      const options = { year: "numeric", month: "short", day: "numeric" };
      return localDate.toLocaleDateString(undefined, options);
    },

    formatTime(dateString, session) {
      const localDate = this.getLocalStartTimeWithOffset(session);
      const options = { hour: "2-digit", minute: "2-digit", hour12: false };
      return localDate.toLocaleTimeString(undefined, options);
    },

    pad(num) {
      return num.toString().padStart(2, "0");
    },
  },
};
</script>
