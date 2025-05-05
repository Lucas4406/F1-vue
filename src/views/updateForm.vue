<template>
  <div class="w-full md:w-96 xl:max-w-full mx-auto h-screen mt-4">
    <div class="p-6 border border-gray-300 md:rounded-md">
      <form class="font-xxl text-2xl" @submit.prevent="updateProfil">
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
          <span class="text-gray-700">First name</span>
          <input
            v-model="primul"
            name="firstName"
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
        <label class="block mb-6">
          <span class="text-gray-700">Profile photo</span>
          <input
            v-model="photo"
            name="profilePhoto"
            type="text"
            class="block w-full mt-1 h-8 text-xl border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="link"
          />
        </label>
        <label class="block mb-6">
          <span class="text-gray-700">Country</span>
          <input
            v-model="tara"
            name="country"
            type="text"
            class="block w-full mt-1 h-8 text-xl border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder=""
          />
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
import axios from "axios"
const primul = ref("")
const doilea = ref("")
const nick = ref("")
const photo = ref("")
const tara = ref("")
async function getDbData(idul) {
  const resp = await axios.get(
    `${import.meta.env.VITE_API_LINK}/profile/${idul}`
  )
  const profile = resp.data[0]
  return profile
}
const auth = getAuth()
const curentEnc = JSON.parse(localStorage.getItem("currentUser"))
async function updateProfil() {
  await updateDb(curentEnc.currentUser)
  const loggedIn = await getDbData(curentEnc.currentUser)
  const currentPhoto = loggedIn.profilePhoto
  const currentNick = loggedIn.displayName
  updateProfile(auth.currentUser, {
    displayName: currentNick,
    photoURL: currentPhoto,
  })
    .then((data) => {
      window.location.replace("/profile")
    })
    .catch((err) => {
      alert(err.message)
    })
}
if (auth.currentUser.displayName != null) {
  const response = await getDbData(curentEnc.currentUser)
  if (primul.value == "") {
    primul.value = response.firstName
  }
  if (doilea.value == "") {
    doilea.value = response.lastName
  }
  if (nick.value == "") {
    nick.value = response.displayName
  }
  if (photo.value == "") {
    photo.value = response.profilePhoto
  }
  if (tara.value == "") {
    tara.value = response.country
  }
}
async function updateDb(idul) {
  await axios({
    method: "POST",
    url: `${import.meta.env.VITE_API_LINK}/profile/change/${idul}`,
    data: {
      firstName: primul.value,
      lastName: doilea.value,
      displayName: nick.value,
      profilePhoto: photo.value,
      country: tara.value,
    },
  })
}
onMounted(() => {
  document.title = "Schimba profilul"
})
</script>

<style></style>
