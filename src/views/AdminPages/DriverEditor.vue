<template>
  <div class="p-6">
    <!-- Căutare echipă -->
    <div class="max-w-md mx-auto mb-8">
      <input
          v-model="searchQuery"
          @input="filterTeams"
          type="text"
          placeholder="Caută echipă după nume..."
          class="w-full border rounded p-2 text-sm"
      />
    </div>

    <!-- Lista echipe -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
      <div
          v-for="team in filteredTeams"
          :key="team._id"
          class="bg-white shadow rounded-xl p-4 border relative"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">{{ team.edit.name }}</h2>
        </div>

        <!-- Câmpuri editabile -->
        <div class="space-y-2">
          <div
              v-for="(value, field) in team.edit"
              :key="field"
              class="flex justify-between items-center"
          >
            <label class="capitalize font-medium">{{ field }}:</label>
            <div class="flex items-center w-1/2">
              <input
                  v-model="team.edit[field]"
                  class="border rounded p-1 text-sm w-full"
                  :placeholder="field"
                  :type="numericFields.includes(field) ? 'number' : 'text'"
              />
              <!-- Buton ștergere câmp doar dacă nu e în editableFields -->
              <button
                  v-if="!editableFields.includes(field) && field !== '_id' && field !== '__v'"
                  @click="removeField(team, field)"
                  title="Șterge câmp"
                  type="button"
                  class="ml-2 text-red-600 hover:text-red-800 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Adaugă câmp nou -->
        <div class="flex items-center gap-2 mt-4">
          <input
              v-model="team.newFieldKey"
              class="border rounded p-1 text-sm w-1/3"
              placeholder="Nume câmp nou"
          />
          <input
              v-model="team.newFieldValue"
              class="border rounded p-1 text-sm w-1/3"
              placeholder="Valoare"
          />
          <button
              class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              @click="() => addNewField(team)"
              type="button"
          >
            + Adaugă
          </button>
        </div>

        <!-- Acțiuni -->
        <div class="flex justify-between mt-4">
          <button
              class="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              @click="updateTeam(team)"
          >
            Salvează
          </button>
          <button
              class="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              @click="deleteTeam(team._id)"
          >
            Șterge
          </button>
        </div>

        <!-- Mesaje status -->
        <div v-if="team.success" class="mt-2 text-green-600 text-sm">
          Actualizat cu succes!
        </div>
        <div v-if="team.error" class="mt-2 text-red-600 text-sm">
          Eroare la actualizare!
        </div>
      </div>
    </div>

    <!-- Formular adăugare echipă nouă -->
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Adaugă o echipă nouă</h2>
      <form
          @submit.prevent="addTeam"
          class="space-y-4 bg-white p-6 rounded-xl shadow border"
      >
        <!-- Câmpuri fixe -->
        <div v-for="field in editableFields" :key="field" v-if="field !== 'drivers'">
          <label class="block font-medium capitalize mb-1">{{ field }}:</label>
          <input
              v-model="newTeam[field]"
              :type="numericFields.includes(field) ? 'number' : 'text'"
              :placeholder="numericFields.includes(field) ? 'Introdu un număr' : field"
              class="w-full border rounded p-2 text-sm"
              :step="numericFields.includes(field) ? 'any' : undefined"
          />
        </div>

        <!-- Câmpuri pentru drivers (driver1 și driver2 IDs) -->
        <div class="mb-4">
          <label class="block font-medium mb-1">driver1 (ID):</label>
          <input
              v-model="newTeam.driver1"
              type="text"
              placeholder="ObjectId driver1"
              class="w-full border rounded p-2 text-sm"
          />
          <label class="block font-medium mt-2 mb-1">driver2 (ID):</label>
          <input
              v-model="newTeam.driver2"
              type="text"
              placeholder="ObjectId driver2"
              class="w-full border rounded p-2 text-sm"
          />
        </div>

        <!-- 2 câmpuri libere pentru key + value câmpuri noi -->
        <div class="flex gap-4">
          <input
              v-model="newFieldKey"
              class="border rounded p-2 text-sm w-1/3"
              placeholder="Nume câmp nou"
          />
          <input
              v-model="newFieldValue"
              class="border rounded p-2 text-sm w-1/3"
              placeholder="Valoare câmp nou"
          />
          <button
              type="button"
              class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              @click="addNewFieldToNewTeam"
          >
            + Adaugă câmp nou
          </button>
        </div>

        <!-- Afișare câmpuri noi adăugate -->
        <div
            v-if="Object.keys(newTeamExtraFields).length"
            class="mt-4 border rounded p-4 bg-gray-50"
        >
          <h3 class="font-semibold mb-2">Câmpuri noi adăugate:</h3>
          <div
              v-for="(value, key) in newTeamExtraFields"
              :key="key"
              class="flex justify-between items-center mb-1"
          >
            <span class="capitalize">{{ key }}:</span>
            <span>{{ value }}</span>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-4">
          <button
              type="submit"
              class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Adaugă Echipa
          </button>
          <button
              type="button"
              @click="resetForm"
              class="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400"
          >
            Resetează
          </button>
        </div>

        <!-- Mesaje formular -->
        <div
            v-if="successMessage"
            class="mt-4 bg-green-100 border border-green-400 text-green-700 p-2 rounded"
        >
          {{ successMessage }}
        </div>
        <div
            v-if="errorMessage"
            class="mt-4 bg-red-100 border border-red-400 text-red-700 p-2 rounded"
        >
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { authRequest } from "@/functions/authRequest";

const teams = ref([]);
const filteredTeams = ref([]);
const newTeam = ref({});
const newTeamExtraFields = ref({}); // câmpuri noi adăugate în formular
const newFieldKey = ref("");
const newFieldValue = ref("");

const editableFields = [
  "name",
  "drivers", // aici gestionăm driver1 și driver2 separat în form
  "pozitie",
  "nrpuncte",
  "culoareEchipa",
  "logo",
  "masinaPoza",
  "pilot_1",
  "pilot_2",
  "link_echipa",
];

const numericFields = ["pozitie", "nrpuncte"];

const successMessage = ref("");
const errorMessage = ref("");

const searchQuery = ref("");

// Fetch echipe
const fetchTeams = async () => {
  try {
    const res = await authRequest("GET", `${import.meta.env.VITE_API_BASE_URL}/teams`);
    teams.value = res.data.map((team) => ({
      ...team,
      edit: { ...team },
      newFieldKey: "",
      newFieldValue: "",
      success: false,
      error: false,
    }));
    filteredTeams.value = [...teams.value];
  } catch (e) {
    console.error("Eroare la încărcarea echipelor", e);
  }
};

onMounted(fetchTeams);

// Filtrare după nume
const filterTeams = () => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) {
    filteredTeams.value = [...teams.value];
    return;
  }
  filteredTeams.value = teams.value.filter((t) =>
      (t.edit.name || "").toLowerCase().includes(q)
  );
};

// Actualizare echipă
const updateTeam = async (team) => {
  try {
    const payload = { ...team.edit };
    // Drivers trimitem separat ca obiect în payload
    if (payload.drivers) delete payload.drivers;
    if (team.edit.driver1) payload.driver1 = team.edit.driver1;
    if (team.edit.driver2) payload.driver2 = team.edit.driver2;

    await authRequest("PUT", `${import.meta.env.VITE_API_BASE_URL}/teams/${team._id}/update`, payload);
    team.success = true;
    team.error = false;

    setTimeout(() => {
      team.success = false;
    }, 3000);
  } catch (e) {
    team.error = true;
    team.success = false;
    console.error("Eroare la actualizarea echipei:", e);
  }
};

// Ștergere echipă
const deleteTeam = async (id) => {
  if (!confirm("Ești sigur că vrei să ștergi această echipă?")) return;
  try {
    await authRequest("DELETE", `${import.meta.env.VITE_API_BASE_URL}/teams/${id}/delete`);
    teams.value = teams.value.filter((t) => t._id !== id);
    filterTeams();
  } catch (e) {
    alert("Eroare la ștergerea echipei");
  }
};

// Adaugă câmp nou în echipa curentă (editabilă)
const addNewField = (team) => {
  const key = team.newFieldKey.trim();
  const value = team.newFieldValue.trim();
  if (!key) {
    alert("Numele câmpului nou nu poate fi gol");
    return;
  }
  if (team.edit[key] !== undefined) {
    alert("Acest câmp există deja");
    return;
  }
  team.edit[key] = value;
  team.newFieldKey = "";
  team.newFieldValue = "";
};
const removeField = async (team, field) => {
  if (!confirm(`Ești sigur că vrei să ștergi câmpul "${field}"?`)) return;

  try {
    // Payload cu numele câmpului de șters
    const payload = { field };

    // Apelez endpoint-ul API de ștergere câmp
    await authRequest(
        "PUT",
        `${import.meta.env.VITE_API_BASE_URL}/teams/${team._id}/remove-field`,
        payload
    );

    // Șterg local câmpul din obiectul editabil
    delete team.edit[field];

    // Reset mesaje de stare (dacă ai nevoie)
    team.success = true;
    team.error = false;

    setTimeout(() => {
      team.success = false;
    }, 3000);

  } catch (error) {
    team.error = true;
    team.success = false;
    console.error("Eroare la ștergerea câmpului:", error);
  }
};

// Adaugă câmp nou în formularul de adăugare echipă
const addNewFieldToNewTeam = () => {
  const key = newFieldKey.value.trim();
  const value = newFieldValue.value.trim();
  if (!key) {
    alert("Numele câmpului nou nu poate fi gol");
    return;
  }
  if (newTeam.value[key] !== undefined || newTeamExtraFields.value[key] !== undefined) {
    alert("Acest câmp există deja");
    return;
  }
  newTeamExtraFields.value[key] = value;
  newFieldKey.value = "";
  newFieldValue.value = "";
};

// Adaugă echipă nouă
const addTeam = async () => {
  try {
    // Pregătim obiectul
    const payload = { ...newTeam.value, ...newTeamExtraFields.value };
    // Adăugăm driver1 și driver2 ca referințe
    if (newTeam.value.driver1) payload.driver1 = newTeam.value.driver1;
    if (newTeam.value.driver2) payload.driver2 = newTeam.value.driver2;

    // Curățăm câmpuri goale
    Object.keys(payload).forEach((k) => {
      if (payload[k] === "") delete payload[k];
    });

    await authRequest("POST", `${import.meta.env.VITE_API_BASE_URL}/teams/add`, payload);
    successMessage.value = "Echipa a fost adăugată cu succes!";
    errorMessage.value = "";
    // Resetare formular
    resetForm();
    fetchTeams();
  } catch (e) {
    errorMessage.value = "Eroare la adăugarea echipei.";
    successMessage.value = "";
    console.error(e);
  }
};

// Resetare formular nouă echipă
const resetForm = () => {
  newTeam.value = {};
  newTeamExtraFields.value = {};
  newFieldKey.value = "";
  newFieldValue.value = "";
};
</script>

<style scoped>
/* Poți ajusta stiluri dacă dorești */
</style>
