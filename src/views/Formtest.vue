<template>
  <div class="form-wrapper">
    <form @submit.prevent="createEchipa">
      <div class="mb-6">
        <label for="Echipa" class="block mb-2 text-sm font-medium text-gray-900"
          >Echipa</label
        >
        <input
          type="text"
          id="text"
          v-model="echipa.name"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div class="mb-6">
        <label
          for="Driver 1"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Driver 1</label
        >
        <input
          type="text"
          id="text"
          v-model="echipa.driver1"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div class="mb-6">
        <label
          for="Driver 2"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Driver 2</label
        >
        <input
          type="text"
          id="text"
          v-model="echipa.driver2"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer"
      >
        Submit
      </button>
    </form>
  </div>

  <div
    class="overflow-hidden bg-white shadow sm:rounded-lg"
    v-for="una in echipe"
    :key="una.id"
  >
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">
        {{ una.name }}
      </h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">Team Info</p>
    </div>
    <div class="border-t border-gray-200">
      <dl>
        <div
          class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm font-medium text-gray-500">First Driver</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            {{ una.driver1 }}
          </dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Second Driver</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            {{ una.driver2 }}
          </dd>
        </div>
        <div
          class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm font-medium text-gray-500">Email address</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            {{ una._id }}
          </dd>
        </div>
      </dl>
    </div>
    <button @click="deleteEchipa(una._id)">Delete</button>
  </div>
</template>

<script>
import axios from "axios"
import {useHead} from "@vueuse/head";
export default {
  name: "Test-form",
  data() {
    return {
      echipa: {
        name: "",
        driver1: "",
        driver2: "",
      },
      echipe: [],
    }
  },
  mounted() {
    useHead({
      meta: [
        { name: "robots", content: "noindex, nofollow" }
      ]
    })
    this.getEchipe()
  },
  methods: {
    createEchipa() {
      axios
        .post(`${import.meta.env.VITE_API_LINK}/mongo`, this.echipa)
        .then((response) => {
          this.getEchipe()
          this.echipa.name = ""
          this.echipa.driver1 = ""
          this.echipa.driver2 = ""
        })
        .catch((error) => console.log(error))
    },
    async getEchipe() {
      var link = `${import.meta.env.VITE_API_LINK}/mongo`
      const res = await axios(link)
      const data = res.data
      this.echipe = data
    },
    deleteEchipa(id) {
      axios
        .delete(`${import.meta.env.VITE_API_LINK}/mongo/delete/${id}`)
        .then((response) => this.getEchipe())
        .catch((error) => console.log(error))
    },
  },
}
</script>

<style>
.form-wrapper {
  width: 100vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
