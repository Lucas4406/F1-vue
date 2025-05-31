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
        <label class="block mb-6">
          <span class="text-gray-700">First name</span>
          <input
              v-model="primul"
              name="firstName"
              type="text"
              class="block w-full mt-1 h-8 text-xl border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label class="block mb-6">
          <span class="text-gray-700">Last name</span>
          <input
              v-model="doilea"
              name="lastName"
              type="text"
              class="block w-full mt-1 h-8 text-xl border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label class="block mb-6">
          <span class="text-gray-700">Nickname</span>
          <input
              v-model="nick"
              name="nickname"
              type="text"
              class="block w-full mt-1 h-8 text-xl border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>

        <!-- Alegerea metodei pentru poza de profil -->
        <label class="block mb-4">
          <span class="text-gray-700">Choose profile photo input method</span>
          <div>
            <label class="mr-4">
              <input type="radio" value="url" v-model="photoInputMethod" /> Use URL
            </label>
            <label>
              <input type="radio" value="file" v-model="photoInputMethod" /> Upload file
            </label>
          </div>
        </label>

        <!-- Input URL -->
        <div v-if="photoInputMethod === 'url'">
          <label class="block mb-6">
            <span class="text-gray-700">Profile photo URL</span>
            <input
                v-model="photo"
                name="profilePhoto"
                type="text"
                class="block w-full mt-1 h-8 text-xl border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Link to image"
            />
          </label>
        </div>

        <!-- Input upload fișier -->
        <div v-if="photoInputMethod === 'file'">
          <label class="block mb-6">
            <span class="text-gray-700">Upload profile photo (max 10MB)</span>
            <input
                type="file"
                accept="image/*"
                @change="handleFileUpload"
                class="block w-full mt-1"
            />
          </label>
          <p v-if="fileError" class="text-red-600">{{ fileError }}</p>
        </div>

        <!-- Select țară din dropdown populat din API -->
        <label class="block mb-6">
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
        </label>

        <div class="mb-6 flex justify-center items-center">
          <button
              type="submit"
              class="h-10 w-[40%] text-xl px-5 text-indigo-100 bg-indigo-700 rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-indigo-800 cursor-pointer"
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
import { getAuth, updateProfile } from "firebase/auth"
import { authRequest } from "@/functions/authRequest"

const primul = ref("")
const doilea = ref("")
const nick = ref("")
const photo = ref("")
const tara = ref("")
const photoInputMethod = ref("url") // "url" sau "file"
const selectedFile = ref(null)
const fileError = ref("")
const previewPhoto = ref("") // pentru preview local
const countries = ref([])

const auth = getAuth()
const curentEnc = JSON.parse(localStorage.getItem("currentUser"))

// Funcție pentru a încărca lista de țări din API
async function loadCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all") // exemplu API public
    if (!response.ok) throw new Error("Failed to load countries")
    const data = await response.json()
    // Mapează datele la un format simplu { name, code }
    countries.value = data
        .map(c => ({
          name: c.name.common,
          code: c.cca2
        }))
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

  // preview local imediat
  previewPhoto.value = URL.createObjectURL(file)
}

async function updateProfil() {
  let profilePhotoUrl = photo.value
  let photoPublicId = null

  if (photoInputMethod.value === "file") {
    if (!selectedFile.value) {
      alert("Please select a valid image file under 10MB.")
      return
    }

    const formData = new FormData()
    formData.append("file", selectedFile.value)

    try {
      const uploadResp = await fetch(`${import.meta.env.VITE_API_LINK}/upload`, {
        method: "POST",
        body: formData,
      })
      if (!uploadResp.ok) throw new Error("Upload failed")

      const uploadData = await uploadResp.json()
      profilePhotoUrl = uploadData.url
      photoPublicId = uploadData.public_id
    } catch (err) {
      alert("Image upload failed: " + err.message)
      return
    }
  }

  // Actualizează datele în DB
  await authRequest("POST", `${import.meta.env.VITE_API_LINK}/profile/change/${curentEnc.currentUser}`, {
    firstName: primul.value,
    lastName: doilea.value,
    displayName: nick.value,
    profilePhoto: profilePhotoUrl,
    photoPublicId: photoPublicId,
    country: tara.value,
  })

  // Actualizează Firebase Auth
  const loggedIn = await getDbData(curentEnc.currentUser)
  updateProfile(auth.currentUser, {
    displayName: loggedIn.displayName,
    photoURL: loggedIn.profilePhoto,
  })
      .then(() => {
        window.location.replace("/profile")
      })
      .catch((err) => {
        alert(err.message)
      })
}

async function loadProfile() {
  if (auth.currentUser && auth.currentUser.displayName != null) {
    const response = await getDbData(curentEnc.currentUser)
    if (primul.value === "") primul.value = response.firstName
    if (doilea.value === "") doilea.value = response.lastName
    if (nick.value === "") nick.value = response.displayName
    if (photo.value === "") photo.value = response.profilePhoto
    if (tara.value === "") tara.value = response.country
  }
}

onMounted(() => {
  document.title = "Update profile information"
  loadCountries()
  loadProfile()
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
