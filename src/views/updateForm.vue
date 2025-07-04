<template>
  <div class="w-full md:w-6/12 xl:max-w-full mx-auto h-screen mt-4">
    <div class="p-6 border border-gray-300 md:rounded-md calendar-schedule">

      <!-- Afișează poza de profil dacă există preview local sau URL -->
      <div v-if="previewPhoto || photo" class="flex justify-center mb-6">
        <img
            :src="previewPhoto || photo"
            alt="Profile photo"
            class="w-24 h-24 rounded-full object-cover border border-gray-400"
        />
      </div>

      <form class="font-xxl text-2xl" @submit.prevent="updateProfil">
        <label class="block mb-1">
          <span class="text-gray-700">First name</span>
          <input
              v-model="primul"
              name="firstName"
              type="text"
              class="block w-full mt-1 h-8 text-xl border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <p v-if="errors.primul" class="text-red-600 text-sm mt-1">{{ errors.primul }}</p>
        </label>

        <label class="block mb-1 mt-4">
          <span class="text-gray-700">Last name</span>
          <input
              v-model="doilea"
              name="lastName"
              type="text"
              class="block w-full mt-1 h-8 text-xl border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <p v-if="errors.doilea" class="text-red-600 text-sm mt-1">{{ errors.doilea }}</p>
        </label>

        <label class="block mb-1 mt-4">
          <span class="text-gray-700">Nickname</span>
          <input
              v-model="nick"
              name="nickname"
              type="text"
              class="block w-full mt-1 h-8 text-xl border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <p v-if="errors.nick" class="text-red-600 text-sm mt-1">{{ errors.nick }}</p>
        </label>


        <label class="block my-4">
          <span class="text-gray-700">Change your profile photo: (max 10MB)</span>
          <input
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="block w-full text-xl mt-4"
          />
          <p v-if="fileError" class="text-red-600 text-sm mt-1">{{ fileError }}</p>
        </label>

        <!-- Select țară din dropdown populat din API -->
        <label class="block mb-1 mt-6">
          <span class="text-gray-700">Country</span>
          <select
              v-model="tara"
              name="country"
              class="block w-full mt-1 h-8 text-xl border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="" disabled>Select your country</option>
            <option
                v-for="country in countries"
                :key="country.code"
                :value="country.code"
            >
              {{ country.name }} ({{ country.code }})
            </option>
          </select>
          <p v-if="errors.tara" class="text-red-600 text-sm mt-1">{{ errors.tara }}</p>
        </label>
        <div v-if="isSubmitting" class="text-center text-indigo-700 font-medium mb-4">
          Please wait, saving profile...
        </div>
        <div class="mb-6 flex justify-center items-center mt-6 gap-2">
          <button
              @click="goHome"
              class="h-10 w-[40%] text-xl px-5 text-indigo-100 bg-indigo-700 rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-indigo-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
              type="submit"
              :disabled="isSubmitting"
              class="h-10 w-[40%] text-xl px-5 text-indigo-100 bg-indigo-700 rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-indigo-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
        <input type="submit" hidden />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from 'vue-router'
import { getAuth, updateProfile } from "firebase/auth"
import { authRequest } from "@/functions/authRequest"

const primul = ref("")
const doilea = ref("")
const nick = ref("")
const photo = ref("")
const initialPhotoUrl = ref("") // ✅ nou
const tara = ref("")
const selectedFile = ref(null)
const fileError = ref("")
const previewPhoto = ref("")
const countries = ref([])
const oldPhotoPublicId = ref(null)
const isSubmitting = ref(false)

const errors = ref({})
const auth = getAuth()
const user = auth.currentUser

const router = useRouter()
const goHome = () => {
  if (confirm("Changes will be lost. Are you sure you want to cancel?")) {
    router.push('/profile')
  }
}
function validate() {
  errors.value = {}

  if (!primul.value.trim()) {
    errors.value.primul = "First name is required."
  }

  if (!doilea.value.trim()) {
    errors.value.doilea = "Last name is required."
  }

  if (!nick.value.trim()) {
    errors.value.nick = "Nickname is required."
  } else if (nick.value.trim().length < 3) {
    errors.value.nick = "Nickname must be at least 3 characters."
  }

  if (selectedFile.value) {
    if (!selectedFile.value.type.startsWith("image/")) {
      errors.value.photo = "Uploaded file must be an image."
    }
    if (selectedFile.value.size > 10 * 1024 * 1024) {
      errors.value.photo = "File size must be less than 10 MB."
    }
  }

  if (!tara.value) {
    errors.value.tara = "Please select a country."
  }

  return Object.keys(errors.value).length === 0
}

async function loadCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
    if (!response.ok) throw new Error("Failed to load countries")
    const data = await response.json()
    countries.value = data
        .map(c => ({ name: c.name.common, code: c.cca2 }))
        .sort((a, b) => a.name.localeCompare(b.name))
  } catch (err) {
    console.error("Error loading countries:", err)
  }
}

async function getDbData(idul) {
  const resp = await authRequest("GET", `${import.meta.env.VITE_API_LINK}/profile/${idul}`)
  return resp.data
}

function handleFileUpload(event) {
  fileError.value = ""
  const file = event.target.files[0]
  if (!file) {
    previewPhoto.value = ""
    return
  }

  if (!file.type.startsWith("image/")) {
    fileError.value = "Please upload an image file."
    selectedFile.value = null
    previewPhoto.value = ""
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    fileError.value = "File size must be less than 10 MB."
    selectedFile.value = null
    previewPhoto.value = ""
    return
  }

  selectedFile.value = file
  previewPhoto.value = URL.createObjectURL(file)
}

async function getToken() {
  if (!user) throw new Error("User is not authenticated")
  return await user.getIdToken()
}

async function updateProfil() {
  if (!validate()) return

  isSubmitting.value = true
  let profilePhotoUrl = photo.value
  let photoPublicId = null

  try {
    if (selectedFile.value) {
      const formData = new FormData()
      formData.append("file", selectedFile.value)

      const token = await getToken()
      const uploadResp = await fetch(`${import.meta.env.VITE_API_LINK}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!uploadResp.ok) throw new Error("Upload failed")

      const uploadData = await uploadResp.json()
      profilePhotoUrl = uploadData.url
      photoPublicId = uploadData.public_id
    } else {
      photoPublicId = null
    }

    const changedPhoto = initialPhotoUrl.value !== profilePhotoUrl

    if (changedPhoto && oldPhotoPublicId.value) {
      try {
        await authRequest("POST", `${import.meta.env.VITE_API_LINK}/upload/delete`, {
          public_id: oldPhotoPublicId.value,
        })
      } catch (e) {
        console.warn("Error deleting old image:", e)
      }
      oldPhotoPublicId.value = null
    }

    const finalPhotoPublicId = changedPhoto ? photoPublicId : oldPhotoPublicId.value

    await authRequest("POST", `${import.meta.env.VITE_API_LINK}/profile/change/${user.uid}`, {
      firstName: primul.value,
      lastName: doilea.value,
      displayName: nick.value,
      profilePhoto: profilePhotoUrl,
      photoPublicId: finalPhotoPublicId,
      country: tara.value,
    })

    const loggedIn = await getDbData(user.uid)
    await updateProfile(user, {
      displayName: loggedIn.displayName,
      photoURL: loggedIn.profilePhoto,
    })

    window.location.replace("/profile")
  } catch (err) {
    alert(err.message)
  } finally {
    isSubmitting.value = false
  }
}




async function loadProfile() {
  if (user) {
    const response = await getDbData(user.uid)
    if (primul.value === "") primul.value = response.firstName
    if (doilea.value === "") doilea.value = response.lastName
    if (nick.value === "") nick.value = response.displayName
    if (photo.value === "") photo.value = response.profilePhoto
    if (tara.value === "") tara.value = response.country

    initialPhotoUrl.value = response.profilePhoto || "" // ✅ salvează valoarea inițială
    oldPhotoPublicId.value = response.photoPublicId || null
  }
}

onMounted(async () => {
  document.title = "GridFanHub | Update profile information"
  await loadCountries()
  await loadProfile()
})
</script>


<style scoped>
html.darkmode label > span {
  color: white;
}

html.darkmode input[type="text"],
html.darkmode input[type="file"],
html.darkmode input[type="radio"],
html.darkmode select {
  background-color: black;
  color: white;
  border-color: #555;
}

html.darkmode input[type="text"]::placeholder {
  color: #bbb;
}

html.darkmode input[type="text"]:focus,
html.darkmode input[type="file"]:focus,
html.darkmode select:focus {
  border-color: #aaa;
  outline-color: #aaa;
}
</style>
