<template>
  <div class="p-6">
    <!-- Bara de căutare -->
    <div class="max-w-md mx-auto mb-8">
      <input
          v-model="searchQuery"
          @input="filterPilots"
          type="text"
          placeholder="Caută după nume..."
          class="w-full border rounded p-2 text-sm"
      />
    </div>

    <!-- Lista de Piloți -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
      <div
          v-for="pilot in filteredPilots"
          :key="pilot._id"
          class="bg-white shadow rounded-xl p-4 border relative"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">
            {{ pilot.primulNume }} {{ pilot.alDoileaNume }}
          </h2>
          <span class="text-sm text-gray-500">#{{ pilot.numar }}</span>
        </div>

        <!-- Câmpuri editabile -->
        <div class="space-y-2">
          <div
              v-for="(value, field) in pilot.edit"
              :key="field"
              class="flex justify-between items-center"
          >
            <label class="capitalize font-medium">{{ field }}:</label>
            <div class="flex items-center w-1/2">
              <input
                  v-model="pilot.edit[field]"
                  class="border rounded p-1 text-sm w-full"
                  :placeholder="field"
              />
              <button
                  v-if="!editableFields.includes(field)"
                  @click="removeField(pilot, field)"
                  title="Șterge câmp"
                  type="button"
                  class="ml-2 text-red-600 hover:text-red-800 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Adăugare câmp nou -->
        <div class="flex items-center gap-2 mt-4">
          <input
              v-model="pilot.newFieldKey"
              class="border rounded p-1 text-sm w-1/3"
              placeholder="Nume câmp nou"
          />
          <input
              v-model="pilot.newFieldValue"
              class="border rounded p-1 text-sm w-1/3"
              placeholder="Valoare"
          />
          <button
              class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              @click="() => addNewField(pilot)"
              type="button"
          >
            + Adaugă
          </button>
        </div>

        <!-- Acțiuni -->
        <div class="flex justify-between mt-4">
          <button
              class="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              @click="updatePilot(pilot)"
          >
            Salvează
          </button>
          <button
              class="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              @click="deletePilot(pilot._id)"
          >
            Șterge
          </button>
        </div>

        <!-- Mesaje status -->
        <div v-if="pilot.success" class="mt-2 text-green-600 text-sm">
          Actualizat cu succes!
        </div>
        <div v-if="pilot.error" class="mt-2 text-red-600 text-sm">
          Eroare la actualizare!
        </div>
      </div>
    </div>

    <!-- Formular pentru Adăugare -->
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Adaugă un nou pilot</h2>
      <form
          @submit.prevent="addPilot"
          class="space-y-4 bg-white p-6 rounded-xl shadow border"
      >
        <!-- Câmpuri fixe -->
        <div v-for="field in editableFields" :key="field">
          <label class="block font-medium capitalize mb-1">{{ field }}:</label>
          <input
              v-model="newPilot[field]"
              :type="numericFields.includes(field) ? 'number' : 'text'"
              :placeholder="numericFields.includes(field) ? 'Introdu un număr' : field"
              class="w-full border rounded p-2 text-sm"
              :step="numericFields.includes(field) ? 'any' : undefined"
          />
        </div>

        <!-- 2 câmpuri libere pentru key + value -->
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
              @click="addNewFieldToNewPilot"
          >
            + Adaugă câmp nou
          </button>
        </div>

        <!-- Afișare câmpuri noi adăugate -->
        <div v-if="Object.keys(newPilotExtraFields).length" class="mt-4 border rounded p-4 bg-gray-50">
          <h3 class="font-semibold mb-2">Câmpuri noi adăugate:</h3>
          <div v-for="(value, key) in newPilotExtraFields" :key="key" class="flex justify-between items-center mb-1">
            <span class="capitalize">{{ key }}:</span>
            <span>{{ value }}</span>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-4">
          <button
              type="submit"
              class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Adaugă Pilot
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

const pilots = ref([]);
const filteredPilots = ref([]);
const newPilot = ref({});
const newPilotExtraFields = ref({}); // câmpuri noi adăugate din formular
const newFieldKey = ref("");
const newFieldValue = ref("");

const editableFields = [
  "pozitie",
  "puncte",
  "primulNume",
  "alDoileaNume",
  "echipa",
  "steag",
  "poza",
  "numar",
  "culoare",
  "driver_id",
];

const numericFields = ["pozitie", "puncte"];

const successMessage = ref("");
const errorMessage = ref("");

const searchQuery = ref("");

// Fetch piloți
const fetchPilots = async () => {
  try {
    const res = await authRequest("GET", `${import.meta.env.VITE_API_LINK}/drivers`);
    pilots.value = res.map((p) => ({
      ...p,
      edit: { ...p },
      newFieldKey: "",
      newFieldValue: "",
      success: false,
      error: false,
    }));
    filteredPilots.value = [...pilots.value];
  } catch (err) {
    console.error("Eroare la fetch piloți:", err);
  }
};

// Filtrare după căutare
const filterPilots = () => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) {
    filteredPilots.value = [...pilots.value];
    return;
  }
  filteredPilots.value = pilots.value.filter((p) => {
    const fullName = (p.primulNume + " " + p.alDoileaNume).toLowerCase();
    return fullName.includes(q);
  });
};

// Actualizare pilot
const updatePilot = async (pilot) => {
  try {
    const payload = {};
    // conversie numeric fields + restul la string
    for (const field in pilot.edit) {
      if (numericFields.includes(field)) {
        payload[field] = Number(pilot.edit[field]);
      } else {
        payload[field] = pilot.edit[field];
      }
    }

    await authRequest("PUT", `${import.meta.env.VITE_API_LINK}/drivers/${pilot._id}/update`, payload);

    pilot.success = true;
    pilot.error = false;
    setTimeout(() => {
      pilot.success = false;
    }, 3000);
  } catch (err) {
    console.error("Eroare update:", err);
    pilot.success = false;
    pilot.error = true;
    setTimeout(() => {
      pilot.error = false;
    }, 3000);
  }
};

// Ștergere pilot
const deletePilot = async (id) => {
  if (!confirm("Ești sigur că vrei să ștergi acest pilot?")) return;
  try {
    await authRequest("DELETE", `${import.meta.env.VITE_API_LINK}/drivers/${id}/delete`);
    pilots.value = pilots.value.filter((p) => p._id !== id);
    filterPilots();
  } catch (err) {
    console.error("Eroare delete:", err);
    alert("Eroare la ștergere pilot.");
  }
};

// Resetare formular
const resetForm = () => {
  newPilot.value = {};
  newPilotExtraFields.value = {};
  newFieldKey.value = "";
  newFieldValue.value = "";
  successMessage.value = "";
  errorMessage.value = "";
};

// Adăugare pilot nou
const addPilot = async () => {
  try {
    const payload = {};

    // Adaugă câmpurile fixe
    for (const field of editableFields) {
      if (newPilot.value[field] !== undefined) {
        if (numericFields.includes(field)) {
          payload[field] = convertValue(newPilot.value[field]);
        } else {
          payload[field] = newPilot.value[field];
        }
      }
    }

    // Adaugă câmpurile noi din formular
    for (const [key, val] of Object.entries(newPilotExtraFields.value)) {
      payload[key] = convertValue(val);
    }

    await authRequest("POST", `${import.meta.env.VITE_API_LINK}/drivers/add`, payload);

    successMessage.value = "Pilot adăugat cu succes!";
    errorMessage.value = "";
    resetForm();
    await fetchPilots();
  } catch (err) {
    console.error("Eroare la adăugare pilot:", err);
    errorMessage.value = "Eroare la adăugare pilot.";
    successMessage.value = "";
  }
};

// Adaugă câmp nou la pilot existent (edit)
const addNewField = (pilot) => {
  if (!pilot.newFieldKey.trim()) return;
  pilot.edit = {
    ...pilot.edit,
    [pilot.newFieldKey.trim()]: pilot.newFieldValue.trim(),
  };
  pilot.newFieldKey = "";
  pilot.newFieldValue = "";
};

// Șterge câmp nou la pilot existent (edit)
const removeField = async (pilot, field) => {
  if (!confirm(`Ștergi câmpul "${field}"?`)) return;

  try {
    const payload = { removeField: field };

    await authRequest(
        "PUT",
        `${import.meta.env.VITE_API_LINK}/drivers/${pilot._id}/remove-field`,
        payload
    );

    delete pilot.edit[field];
  } catch (err) {
    console.error("Eroare la ștergerea câmpului din DB:", err);
    alert("Nu s-a putut șterge câmpul. Încearcă din nou.");
  }
};

// Adaugă câmp nou în formularul de pilot nou
const addNewFieldToNewPilot = () => {
  if (!newFieldKey.value.trim()) return;
  newPilotExtraFields.value = {
    ...newPilotExtraFields.value,
    [newFieldKey.value.trim()]: newFieldValue.value.trim(),
  };
  newFieldKey.value = "";
  newFieldValue.value = "";
};

// Convertim valoarea introdusă în număr dacă e cazul,
// dar respectăm și dacă user-ul vrea să o țină string, punând-o între ghilimele
const convertValue = (val) => {
  if (typeof val !== "string") return val;

  const trimmed = val.trim();
  console.log(trimmed)

  // 1. Dacă e între ghilimele → string fără ghilimele
  if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    console.log(trimmed.slice(1, -1))
    return trimmed.slice(1, -1);
  }

  // 2. Altfel, dacă e număr valid → number
  if (!isNaN(trimmed) && trimmed !== "") {
    return Number(trimmed);
  }

  // 3. Altfel → string
  return trimmed;
};


onMounted(fetchPilots);
</script>
