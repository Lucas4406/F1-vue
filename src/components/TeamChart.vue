<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Bar } from "vue-chartjs";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
});

const chartData = computed(() => ({
  labels: props.teams.map((t) => t.teamData.displayTeamName),
  datasets: [
    {
      label: "Votes",
      data: props.teams.map((t) => t.count),
      backgroundColor: props.teams.map((t) => `#${t.teamData.teamColourCode}`),
      borderRadius: 5,
    },
  ],
}));

const textColor = computed(() =>
    document.documentElement.classList.contains("darkmode") ? "#fff" : "#000"
);

const chartOptions = {
  indexAxis: "y",
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `Votes: ${context.parsed.x}`;
        },
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        precision: 0, // Force integer display
        font: {
          size: 18, // sau orice mărime dorești
          weight: 'bold', // opțional, dacă vrei bold
        },
        color: textColor.value, // Setează culoarea textului în funcție de tema curentă
      }
    },
    y: {
      ticks: {
        font: {
          size: 16,
          weight: 'bold',
        },
        color: textColor.value, // Setează culoarea textului în funcție de tema curentă
      },
    },
  },
};
</script>
