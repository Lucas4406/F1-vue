<template>
  <div class="p-6">
    <!-- Bara de căutare -->
    <div class="max-w-md mx-auto mb-8">
      <input
          v-model="searchQuery"
          @input="filterTeams"
          type="text"
          placeholder="Caută după nume echipă..."
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
        <h2 class="text-lg font-bold mb-4">{{ team.nume }}</h2>

        <!-- Câmpuri editabile -->
        <div class="space-y-2">
          <div
              v-for="(value, field) in team.edit"
              :key="field"
              v-if="field !== 'drivers'"
              class="flex justify-between items-center"
          >
            <label class="capitalize font-medium">{{ field }}:</label>
            <div class="flex items-center w-1/2">
              <input
                  v-model="team.edit[field]"
                  class="border rounded p-1 text-sm w-full"
                  :placeholder="field"
              />
              <button
                  v-if="!editableFields.includes(field)"
                  @click="removeField(team, field)"
                  class="ml-2 text-red-600 hover:text-red-800 font-bold"
                  type="button"
              >
                ×
              </button>
            </div>
          </div>

          <!-- Lista driver_id -->
          <div>
            <label class="font-medium">Drivers (IDs):</label>
            <ul class="list-disc pl-5 text-sm mb-2">
              <li v-for="(_id, idx) in team.edit.drivers || []" :key="idx">
                {{ _id }}
              </li>
            </ul>
            <input
                v-model="team.newDriverId"
                class="border rounded p-1 text-sm w-full"
                placeholder="Adaugă driver_id"
            />
            <button
                @click="() => addDriverId(team)"
                class="mt-1 text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                type="button"
            >
              + Adaugă driver_id
            </button>
          </div>
        </div>

        <!-- Acțiuni -->
        <div class="flex justify-between mt-4">
          <button
              class="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              @click="updateTeam(team)"
              type="button"
          >
            Salvează
          </button>
          <button
              class="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              @click="deleteTeam(team._id)"
              type="button"
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
        <div class="mt-4 border-t pt-4">
          <h3 class="font-semibold mb-2">Adaugă câmp suplimentar echipei</h3>
          <div class="flex gap-2 items-center">
            <input
                v-model="team.newDynamicFieldKey"
                placeholder="Nume câmp (fără spații)"
                class="border rounded p-1 text-sm w-1/3"
            />
            <input
                v-model="team.newDynamicFieldValue"
                placeholder="Valoare"
                class="border rounded p-1 text-sm w-1/3"
            />
            <button
                @click="() => addDynamicFieldToTeam(team)"
                type="button"
                class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
            >
              + Adaugă câmp
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Formular pentru adăugare echipă -->
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Adaugă o echipă nouă</h2>
      <form
          @submit.prevent="addTeam"
          class="bg-white p-6 rounded-xl shadow border space-y-4"
      >
        <!-- Câmpuri fixe -->
        <div v-for="field in editableFields" :key="field">
          <label class="block font-medium capitalize mb-1">{{ field }}:</label>
          <input
              v-model="newTeam[field]"
              :type="numericFields.includes(field) ? 'number' : 'text'"
              class="w-full border rounded p-2 text-sm"
          />
        </div>

        <!-- Câmpuri dinamice existente (nu fixe și nu drivers) -->
        <div
            v-for="(val, key) in newTeam.value"
            :key="key"
            v-if="!editableFields.includes(key) && key !== 'drivers'"
            class="flex items-center gap-2"
        >
          <label class="capitalize font-medium w-1/4">{{ key }}:</label>
          <input v-model="newTeam[key]" class="w-full border rounded p-2 text-sm" />
          <button
              type="button"
              @click="removeDynamicField(key)"
              class="text-red-600 font-bold hover:text-red-800"
          >
            ×
          </button>
        </div>

        <!-- Adăugare câmp nou -->
        <div class="mt-4">
          <h3 class="font-semibold mb-1">Adaugă câmp suplimentar</h3>
          <div class="flex items-center gap-2">
            <input
                v-model="newDynamicFieldKey"
                class="border rounded p-2 text-sm w-1/3"
                placeholder="Nume câmp nou (fără spații)"
            />
            <input
                v-model="newDynamicFieldValue"
                class="border rounded p-2 text-sm w-1/3"
                placeholder="Valoare"
            />
            <button
                type="button"
                @click="addDynamicField"
                class="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 text-sm"
            >
              + Adaugă
            </button>
          </div>
          <div v-if="dynamicFieldError" class="mt-1 text-red-600 text-sm">
            {{ dynamicFieldError }}
          </div>
        </div>

        <!-- Adăugare driver_id -->
        <div>
          <label class="block font-medium mb-1">Driver IDs:</label>
          <div class="flex gap-2 mb-2">
            <input
                v-model="newDriverId"
                class="border rounded p-2 text-sm w-full"
                placeholder="Adaugă driver_id"
            />
            <button
                type="button"
                class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                @click="addNewDriverId"
            >
              + Adaugă
            </button>
          </div>
          <ul class="list-disc pl-6 text-sm" v-if="newTeam.drivers.length">
            <li v-for="(id, idx) in newTeam.drivers" :key="idx">{{ id }}</li>
          </ul>
        </div>

        <div class="flex justify-end gap-4">
          <button
              type="submit"
              class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Adaugă Echipă
          </button>
          <button
              type="button"
              @click="resetForm"
              class="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
          >
            Resetează
          </button>
        </div>

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
const newTeam = ref({ drivers: [] });
const newDriverId = ref("");

const editableFields = [
  "name",
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

const searchQuery = ref("");
const successMessage = ref("");
const errorMessage = ref("");

const newDynamicFieldKey = ref("");
const newDynamicFieldValue = ref("");
const dynamicFieldError = ref("");

const fetchTeams = async () => {
  try {
    const res = await authRequest("GET", `${import.meta.env.VITE_API_LINK}/teams`);
    teams.value = res.map((t) => ({
      ...t,
      edit: { ...t },
      newDriverId: "",
      newDynamicFieldKey: "",      // Cheia noului câmp
      newDynamicFieldValue: "",    // Valoarea noului câmp
      success: false,
      error: false,
    }));
    filteredTeams.value = [...teams.value];
  } catch (err) {
    console.error("Eroare fetch echipe:", err);
  }
};

const filterTeams = () => {
  const q = searchQuery.value.toLowerCase().trim();
  filteredTeams.value = q
      ? teams.value
          .filter((t) => (t.nume || "").toLowerCase().includes(q))
          .map((t) => ({
            ...t,
            newDynamicFieldKey: t.newDynamicFieldKey ?? "",
            newDynamicFieldValue: t.newDynamicFieldValue ?? "",
            newDriverId: t.newDriverId ?? "",
          }))
      : teams.value.map((t) => ({
        ...t,
        newDynamicFieldKey: t.newDynamicFieldKey ?? "",
        newDynamicFieldValue: t.newDynamicFieldValue ?? "",
        newDriverId: t.newDriverId ?? "",
      }));
};

const updateTeam = async (team) => {
  try {
    const payload = { ...team.edit };
    await authRequest(
        "PUT",
        `${import.meta.env.VITE_API_LINK}/teams/${team._id}/update`,
        payload
    );
    team.success = true;
    team.error = false;
    setTimeout(() => (team.success = false), 3000);
  } catch (err) {
    console.error("Eroare update echipă:", err);
    team.success = false;
    team.error = true;
    setTimeout(() => (team.error = false), 3000);
  }
};

const deleteTeam = async (id) => {
  if (!confirm("Ștergi această echipă?")) return;
  try {
    await authRequest("DELETE", `${import.meta.env.VITE_API_LINK}/teams/${id}/delete`);
    teams.value = teams.value.filter((t) => t._id !== id);
    filterTeams();
  } catch (err) {
    console.error("Eroare la ștergere echipă:", err);
  }
};

const addTeam = async () => {
  try {
    await authRequest("POST", `${import.meta.env.VITE_API_LINK}/teams/add`, newTeam.value);
    successMessage.value = "Echipă adăugată cu succes!";
    errorMessage.value = "";
    resetForm();
    await fetchTeams();
  } catch (err) {
    console.error("Eroare la adăugare echipă:", err);
    successMessage.value = "";
    errorMessage.value = "Eroare la adăugare.";
  }
};

const resetForm = () => {
  newTeam.value = { drivers: [] };
  newDriverId.value = "";
  newDynamicFieldKey.value = "";
  newDynamicFieldValue.value = "";
  dynamicFieldError.value = "";
};

const addNewDriverId = () => {
  if (newDriverId.value.trim()) {
    if (!newTeam.value.drivers) newTeam.value.drivers = [];
    newTeam.value.drivers.push(newDriverId.value.trim());
    newDriverId.value = "";
  }
};
const addDynamicFieldToTeam = (team) => {
  const key = team.newDynamicFieldKey.trim();
  const value = team.newDynamicFieldValue.trim();

  if (!key) {
    alert("Numele câmpului nu poate fi gol.");
    return;
  }
  if (/\s/.test(key)) {
    alert("Numele câmpului nu poate conține spații.");
    return;
  }
  if (editableFields.includes(key)) {
    alert(`Câmpul "${key}" este deja un câmp fix.`);
    return;
  }
  if (team.edit.hasOwnProperty(key)) {
    alert(`Câmpul "${key}" există deja în această echipă.`);
    return;
  }

  // Adaugă câmpul nou (poți încerca conversia la number dacă vrei)
  team.edit[key] = numericFields.includes(key) ? Number(value) : value;

  // Resetează inputurile
  team.newDynamicFieldKey = "";
  team.newDynamicFieldValue = "";
};
const addDriverId = (team) => {
  if (!team.edit.drivers) team.edit.drivers = [];
  if (team.newDriverId.trim()) {
    team.edit.drivers.push(team.newDriverId.trim());
    team.newDriverId = "";
  }
};

const addDynamicField = () => {
  dynamicFieldError.value = "";
  const key = newDynamicFieldKey.value.trim();

  if (!key) {
    dynamicFieldError.value = "Numele câmpului nu poate fi gol.";
    return;
  }
  if (/\s/.test(key)) {
    dynamicFieldError.value = "Numele câmpului nu poate conține spații.";
    return;
  }
  if (editableFields.includes(key)) {
    dynamicFieldError.value = `Câmpul "${key}" este deja un câmp fix.`;
    return;
  }
  if (newTeam.value.hasOwnProperty(key)) {
    dynamicFieldError.value = `Câmpul "${key}" există deja.`;
    return;
  }

  const value = newDynamicFieldValue.value.trim();
  newTeam.value[key] = numericFields.includes(key) ? Number(value) : value;
  newDynamicFieldKey.value = "";
  newDynamicFieldValue.value = "";
};

const removeDynamicField = async (key) => {
  if (!confirm(`Ștergi câmpul "${key}"?`)) return;
  delete newTeam.value[key];
};

const removeField = async (team, field) => {
  if (!confirm(`Ștergi câmpul "${field}" din echipa ${team.nume}?`)) return;

  try {
    await authRequest(
        "PUT",
        `${import.meta.env.VITE_API_LINK}/teams/${team._id}/remove-field`,
        { field }
    );
    // Șterge local din obiectul editat
    delete team.edit[field];
  } catch (err) {
    alert("Eroare la ștergerea câmpului");
    console.error(err);
  }
};

onMounted(fetchTeams);
</script>
