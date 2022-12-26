<template>
    <div class="form-wrapper">
        <form @submit.prevent="updateTeam">
            <div class="mb-6">
                <label for="Echipa" class="block mb-2 text-sm font-medium text-gray-900">Echipa</label>
                <input type="text" id="text" v-model="echipa.id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
            </div>
            <div class="mb-6">
                <label for="Driver 1" class="block mb-2 text-sm font-medium text-gray-900">Driver 1</label>
                <input type="text" id="text" v-model="echipa.driver1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
            </div>
            <div class="mb-6">
                <label for="Driver 2" class="block mb-2 text-sm font-medium text-gray-900 ">Driver 2</label>
                <input type="text" id="text" v-model="echipa.driver2" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
            </div>
            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer">Submit</button>
        </form>
    </div>
    <div class="flex flex-row gap-4 w-screen">
        <div class="flex flex-col">
            <div class="overflow-hidden bg-white shadow sm:rounded-lg border-black border" v-for="pilot in piloti" :key="pilot.id">
                <div class="border-t border-black">
                    <dl>
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Nume</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{pilot.primulNume + " " + pilot.alDoileaNume}}</dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">ID</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{pilot._id}}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
        <div class="flex flex-col">
            <div class="overflow-hidden bg-white shadow sm:rounded-lg border-black border" v-for="echipa in echipe" :key="echipa.id">
                <div class="border-t border-black">
                    <dl>
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Nume</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{echipa.name}}</dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">ID</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{echipa._id}}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import {makeRequest} from "../functions/makeRequest"
export default {
    name: "updateTeams",
    data() {
        return {
            echipa: {
                id: "",
                driver1: "",
                driver2: ""
            },
            piloti: [],
            echipe: []
        }
    },
    mounted() {
        document.title = "Updateteams"
        this.getDriverList()
        this.getTeams()
    },
    methods: {
        async updateTeam () {
            await axios({
                method: "POST",
                url: `https://f1-site-api.vercel.app/mongo/teams/change/${this.echipa.id}/${this.echipa.driver1}/${this.echipa.driver2}`
            })
            window.location.reload()
        },
        async getDriverList () {
            const data = await makeRequest("https://f1-site-api.vercel.app/mongo/piloti")
            this.piloti = data
        },
        async getTeams () {
            const data = await makeRequest("https://f1-site-api.vercel.app/mongo/teams/all")
            this.echipe = data
        }
    },
}

</script>

<style scoped>
    .form-wrapper{
        width: 100vw;
        height: 90vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
</style>