<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { authRequest } from '@/functions/authRequest'
import {makeRequest} from "@/functions/makeRequest";


const prodLink = import.meta.env.VITE_API_LINK // înlocuiește cu linkul real
const dateApi = await makeRequest(`${prodLink}/get-next`)
const year = dateApi.meetingContext.season

const meetings = ref([])
const loading = ref(false)
const sessionToDelete = ref(null)

const fetchMeetings = async () => {
  loading.value = true
  try {
    const { data } = await axios.get(`${prodLink}/season-data/${year}`)
    meetings.value = data
  } catch (err) {
    console.error('❌ Error fetching meetings:', err)
  } finally {
    loading.value = false
  }
}

const requestDelete = (meetingId, sessionKey, sessionName) => {
  sessionToDelete.value = { meetingId, sessionKey, sessionName }
}

const confirmDelete = async () => {
  if (!sessionToDelete.value) return
  const { meetingId, sessionKey } = sessionToDelete.value
  try {
    await authRequest(
        'DELETE',
        `${prodLink}/season-data/${year}/${meetingId}/${sessionKey}/delete`
    )
    await fetchMeetings()
    setTimeout(() => {
      alert('Sesiunea a fost ștearsă cu succes.') // sau toast dacă folosești ceva gen vue-toastification
    }, 100)
  } catch (err) {
    alert('Eroare la ștergerea sesiunii')
    console.error(err)
  } finally {
    sessionToDelete.value = null
  }
}

const cancelDelete = () => {
  sessionToDelete.value = null
}

onMounted(fetchMeetings)
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Evenimente Sezon {{ year }}</h1>

    <div v-if="loading">Se încarcă...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="meeting in meetings"
          :key="meeting._id"
          class="bg-white rounded-xl shadow p-4 border"
      >
        <h2 class="text-xl font-semibold mb-2">{{ meeting.meetingName }}</h2>

        <ul v-if="meeting.sessions">
          <li
              v-for="(session, key) in meeting.sessions"
              :key="key"
              class="flex justify-between items-center border-b py-1"
          >
            <span>{{ key }}</span>
            <button
                class="text-sm text-red-600 hover:underline"
                @click="requestDelete(meeting.meetingId, session.sessionKey, key)"
            >
              Șterge
            </button>
          </li>
        </ul>
        <p v-else class="text-gray-500 italic">Fără sesiuni</p>
      </div>
    </div>

    <!-- MODAL DE CONFIRMARE -->
    <div
        v-if="sessionToDelete"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Confirmă ștergerea</h2>
        <p class="mb-4">
          Ești sigur că vrei să ștergi sesiunea
          <strong>{{ sessionToDelete.sessionName }}</strong>?
        </p>
        <div class="flex justify-end space-x-3">
          <button
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              @click="cancelDelete"
          >
            Anulează
          </button>
          <button
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              @click="confirmDelete"
          >
            Confirmă ștergerea
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
