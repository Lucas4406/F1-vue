<template>
  <div class="container mx-auto p-4 font-sans">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-700">Teams Editor 🏎️</h1>

    <div class="mb-6 text-right">
      <button @click="openAddTeamModal" class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out">
        🚀 Add New Team
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <p class="text-xl text-blue-500">Loading teams... ⏳</p>
    </div>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-if="!isLoading && teams.length === 0 && !error" class="text-center py-10 text-gray-500">
      <p class="text-xl">No teams found. Try adding one! 🏁</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="team in teams" :key="team._id" class="bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        <div class="p-5">
          <div class="flex justify-between items-center mb-3">
            <h2 class="text-2xl font-bold text-indigo-600">{{ team.name }}</h2>
            <div v-if="team.logo" class="w-12 h-12">
              <img :src="team.logo" :alt="`${team.name} Logo`" class="object-contain w-full h-full rounded-full border border-gray-200">
            </div>
          </div>

          <div class="space-y-2 text-sm text-gray-600">
            <p v-if="team.pozitie !== undefined"><strong>Position:</strong> {{ team.pozitie }}</p>
            <p v-if="team.nrpuncte !== undefined"><strong>Points:</strong> {{ team.nrpuncte }}</p>
            <p v-if="team.culoareEchipa"><strong>Color:</strong> <span :style="{ backgroundColor: team.culoareEchipa }" class="inline-block w-4 h-4 rounded-full border border-gray-300 mr-1"></span> {{ team.culoareEchipa }}</p>
            <p v-if="team.drivers && team.drivers.driver1"><strong>Driver 1:</strong> {{ team.drivers.driver1.name || team.drivers.driver1 }}</p>
            <p v-if="team.drivers && team.drivers.driver2"><strong>Driver 2:</strong> {{ team.drivers.driver2.name || team.drivers.driver2 }}</p>

            <div v-for="(value, key) in getOtherFields(team)" :key="key" class="mt-1">
              <p><strong>{{ formatFieldKey(key) }}:</strong> {{ value }}</p>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3 flex justify-end space-x-3">
          <button @click="openEditTeamModal(team)" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150 ease-in-out">✏️ Edit</button>
          <button @click="confirmDeleteTeam(team._id)" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150 ease-in-out">🗑️ Delete</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center mt-8 z-50">
      <div class="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-semibold mb-6 text-gray-700">{{ isEditing ? 'Edit Team ✍️' : 'Add New Team ✨' }}</h3>

        <form @submit.prevent="isEditing ? handleUpdateTeam() : handleCreateTeam()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name <span class="text-red-500">*</span></label>
              <input type="text" v-model="editableTeam.name" id="name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="pozitie" class="block text-sm font-medium text-gray-700">Position</label>
              <input type="number" v-model.number="editableTeam.pozitie" id="pozitie" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="nrpuncte" class="block text-sm font-medium text-gray-700">Points</label>
              <input type="number" v-model.number="editableTeam.nrpuncte" id="nrpuncte" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="culoareEchipa" class="block text-sm font-medium text-gray-700">Team Color</label>
              <input type="text" v-model="editableTeam.culoareEchipa" id="culoareEchipa" placeholder="#FF0000 or red" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="logo" class="block text-sm font-medium text-gray-700">Logo URL</label>
              <input type="url" v-model="editableTeam.logo" id="logo" placeholder="https://example.com/logo.png" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="masinaPoza" class="block text-sm font-medium text-gray-700">Car Image URL</label>
              <input type="url" v-model="editableTeam.masinaPoza" id="masinaPoza" placeholder="https://example.com/car.png" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="driver1_id" class="block text-sm font-medium text-gray-700">Driver 1 ID</label>
              <input type="text" v-model="editableTeam.driver1_id" id="driver1_id" placeholder="ObjectID of driver 1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="driver2_id" class="block text-sm font-medium text-gray-700">Driver 2 ID</label>
              <input type="text" v-model="editableTeam.driver2_id" id="driver2_id" placeholder="ObjectID of driver 2" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="pilot_1" class="block text-sm font-medium text-gray-700">Pilot 1 (String Name)</label>
              <input type="text" v-model="editableTeam.pilot_1" id="pilot_1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="pilot_2" class="block text-sm font-medium text-gray-700">Pilot 2 (String Name)</label>
              <input type="text" v-model="editableTeam.pilot_2" id="pilot_2" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div class="md:col-span-2">
              <label for="link_echipa" class="block text-sm font-medium text-gray-700">Team Link URL</label>
              <input type="url" v-model="editableTeam.link_echipa" id="link_echipa" placeholder="https://example.com/team-page" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
          </div>

          <div v-if="isEditing" class="mb-6">
            <h4 class="text-lg font-medium text-gray-700 mb-2">Other Fields:</h4>
            <div v-for="(value, key) in currentCustomFields" :key="key" class="flex items-center space-x-2 mb-2 p-2 border rounded-md">
              <div class="flex-grow">
                <label :for="`custom-${key}`" class="block text-xs font-medium text-gray-500">{{ formatFieldKey(key) }}</label>
                <input type="text" :value="value" @input="updateCustomField(key, $event.target.value)" :id="`custom-${key}`" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <button @click.prevent="handleRemoveField(editableTeam._id, key)" type="button" class="text-red-500 hover:text-red-700 font-semibold text-sm p-2">Remove Field</button>
            </div>
            <p v-if="Object.keys(currentCustomFields).length === 0" class="text-sm text-gray-500">No other fields present.</p>
          </div>

          <div class="border-t pt-4 mt-4">
            <h4 class="text-lg font-medium text-gray-700 mb-3">Add Custom Field(s):</h4>
            <div v-for="(field, index) in newCustomFieldsBuffer" :key="index" class="flex items-center space-x-2 mb-3 p-3 bg-gray-50 rounded-md">
              <input type="text" v-model="field.key" placeholder="Field Name (e.g., sponsor)" class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <input type="text" v-model="field.value" placeholder="Field Value (e.g., AwesomeCorp)" class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <button @click.prevent="removeCustomFieldFromBuffer(index)" type="button" class="text-red-500 hover:text-red-700 font-semibold p-2">Remove</button>
            </div>
            <button @click.prevent="addCustomFieldToBuffer" type="button" class="mt-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out">
              + Add Field Row
            </button>
          </div>

          <div class="mt-8 flex justify-end space-x-3">
            <button @click="closeModal" type="button" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out">Cancel</button>
            <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out">
              {{ isEditing ? 'Save Changes' : 'Create Team' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
// import axios from 'axios'; // No longer needed if authRequest handles all
// Presuming authRequest is imported or globally available
import {authRequest} from '@/functions/authRequest'; // Adjust path as needed

const API_BASE_URL = `${import.meta.env.VITE_API_LINK}/teams`; // Adjust if your API is hosted elsewhere or has a different prefix

const teams = ref([]);
const isLoading = ref(false);
const error = ref(null);
const showModal = ref(false);
const isEditing = ref(false);

const initialEditableTeamState = () => ({
  _id: null,
  name: '',
  pozitie: null,
  nrpuncte: null,
  culoareEchipa: '',
  logo: '',
  masinaPoza: '',
  pilot_1: '',
  pilot_2: '',
  link_echipa: '',
  driver1_id: '',
  driver2_id: '',
});

const editableTeam = reactive(initialEditableTeamState());
const newCustomFieldsBuffer = ref([]);

// --- Field Management (remains the same) ---
const predefinedSchemaFields = [
  '_id', 'name', 'drivers', 'pozitie', 'nrpuncte', 'culoareEchipa',
  'logo', 'masinaPoza', 'pilot_1', 'pilot_2', 'link_echipa',
  'createdAt', 'updatedAt', '__v'
];

const getOtherFields = (team) => {
  const others = {};
  for (const key in team) {
    if (!predefinedSchemaFields.includes(key) && key !== 'driver1_id' && key !== 'driver2_id') {
      if (key === 'drivers' && typeof team[key] === 'object' && team[key] !== null) continue;
      others[key] = team[key];
    }
  }
  return others;
};

const currentCustomFields = computed(() => {
  const customs = {};
  for (const key in editableTeam) {
    if (!initialEditableTeamState().hasOwnProperty(key) && key !== '_id' && key !== 'driver1_id' && key !== 'driver2_id') {
      customs[key] = editableTeam[key];
    }
  }
  return customs;
});

const formatFieldKey = (key) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const addCustomFieldToBuffer = () => {
  newCustomFieldsBuffer.value.push({ key: '', value: '' });
};

const removeCustomFieldFromBuffer = (index) => {
  newCustomFieldsBuffer.value.splice(index, 1);
};

const updateCustomField = (key, value) => {
  editableTeam[key] = value;
};

// --- API Calls (modified to use authRequest) ---
const fetchTeams = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // For GET requests, body argument might be null or undefined depending on authRequest signature
    const responseData = await authRequest("GET", API_BASE_URL);
    teams.value = responseData;
  } catch (err) {
    console.error("Failed to fetch teams:", err);
    error.value = err.response?.data?.message || err.message || "Failed to fetch teams.";
  } finally {
    isLoading.value = false;
  }
};

const handleCreateTeam = async () => {
  if (!editableTeam.name) {
    alert("Team name is required.");
    return;
  }
  isLoading.value = true;
  error.value = null;

  const payload = { ...editableTeam };
  delete payload._id;

  if (payload.driver1_id || payload.driver2_id) {
    payload.drivers = [{
      driver1: payload.driver1_id || null,
      driver2: payload.driver2_id || null,
    }];
  } else {
    payload.drivers = [];
  }
  delete payload.driver1_id;
  delete payload.driver2_id;

  newCustomFieldsBuffer.value.forEach(field => {
    if (field.key && field.value !== undefined) {
      payload[field.key.trim()] = field.value;
    }
  });

  try {
    await authRequest("POST", `${API_BASE_URL}/add`, payload);
    await fetchTeams();
    closeModal();
  } catch (err) {
    console.error("Failed to create team:", err);
    error.value = err.response?.data?.message || err.message || "Failed to create team.";
    alert(`Error creating team: ${error.value}`);
  } finally {
    isLoading.value = false;
  }
};

const handleUpdateTeam = async () => {
  if (!editableTeam._id || !editableTeam.name) {
    alert("Team ID and name are required for update.");
    return;
  }
  isLoading.value = true;
  error.value = null;

  const payload = { ...editableTeam };

  if (payload.driver1_id) payload.driver1 = payload.driver1_id;
  if (payload.driver2_id) payload.driver2 = payload.driver2_id;

  delete payload.driver1_id;
  delete payload.driver2_id;
  delete payload.drivers;

  newCustomFieldsBuffer.value.forEach(field => {
    if (field.key && field.value !== undefined) {
      payload[field.key.trim()] = field.value;
    }
  });

  const teamId = payload._id;
  delete payload._id;

  try {
    await authRequest("PUT", `${API_BASE_URL}/${teamId}/update`, payload);
    await fetchTeams();
    closeModal();
  } catch (err) {
    console.error("Failed to update team:", err);
    error.value = err.response?.data?.message || err.message || "Failed to update team.";
    alert(`Error updating team: ${error.value}`);
  } finally {
    isLoading.value = false;
  }
};

const handleRemoveField = async (teamId, fieldName) => {
  if (!teamId || !fieldName) {
    alert("Team ID and field name are required to remove a field.");
    return;
  }
  if (!confirm(`Are you sure you want to remove the field '${fieldName}'? This action is permanent.`)) {
    return;
  }
  isLoading.value = true;
  error.value = null;
  try {
    await authRequest("PUT", `${API_BASE_URL}/${teamId}/remove-field`, { field: fieldName });
    delete editableTeam[fieldName];
    await fetchTeams();
    alert(`Field '${fieldName}' removed successfully.`);
  } catch (err) {
    console.error("Failed to remove field:", err);
    error.value = err.response?.data?.message || err.message || "Failed to remove field.";
    alert(`Error removing field: ${error.value}`);
  } finally {
    isLoading.value = false;
  }
};

const confirmDeleteTeam = (teamId) => {
  if (confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
    deleteTeam(teamId);
  }
};

const deleteTeam = async (teamId) => {
  isLoading.value = true;
  error.value = null;
  try {
    // For DELETE requests, body argument might be null or undefined
    await authRequest("DELETE", `${API_BASE_URL}/${teamId}/delete`);
    await fetchTeams();
  } catch (err) {
    console.error("Failed to delete team:", err);
    error.value = err.response?.data?.message || err.message || "Failed to delete team.";
    alert(`Error deleting team: ${error.value}`);
  } finally {
    isLoading.value = false;
  }
};

// --- Modal Management (remains the same) ---
const openAddTeamModal = () => {
  isEditing.value = false;
  Object.assign(editableTeam, initialEditableTeamState());
  newCustomFieldsBuffer.value = [];
  showModal.value = true;
};

const openEditTeamModal = (team) => {
  isEditing.value = true;
  Object.assign(editableTeam, initialEditableTeamState());
  for (const key in team) {
    if (initialEditableTeamState().hasOwnProperty(key) || !predefinedSchemaFields.includes(key)) {
      if (key !== 'drivers') {
        editableTeam[key] = team[key];
      }
    }
  }
  editableTeam._id = team._id;

  if (team.drivers) {
    if (typeof team.drivers === 'object' && team.drivers !== null && !Array.isArray(team.drivers)) {
      editableTeam.driver1_id = team.drivers.driver1?._id || team.drivers.driver1 || '';
      editableTeam.driver2_id = team.drivers.driver2?._id || team.drivers.driver2 || '';

    } else if (Array.isArray(team.drivers) && team.drivers.length > 0) {
      editableTeam.driver1_id = team.drivers[0]?.driver1?._id || team.drivers[0]?.driver1 || '';
      editableTeam.driver2_id = team.drivers[0]?.driver2?._id || team.drivers[0]?.driver2 || '';
    }
  } else {
    editableTeam.driver1_id = '';
    editableTeam.driver2_id = '';
  }

  newCustomFieldsBuffer.value = [];
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  Object.assign(editableTeam, initialEditableTeamState());
  newCustomFieldsBuffer.value = [];
  error.value = null;
};

// --- Lifecycle Hook (remains the same) ---
onMounted(() => {
  fetchTeams();
});

</script>

<style scoped>
/* Custom scrollbar for modal if content overflows */
.max-h-\[90vh\]::-webkit-scrollbar {
  width: 8px;
}
.max-h-\[90vh\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.max-h-\[90vh\]::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}
.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Ensure labels have some bottom margin or inputs have top margin for spacing */
label {
  margin-bottom: 0.25rem; /* Or use Tailwind mb-1 on labels */
}
</style>