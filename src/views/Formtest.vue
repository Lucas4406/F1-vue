<template>
    <div class="form-wrapper">
        <form @submit.prevent="createEchipa">
            <div class="mb-6">
                <label for="Echipa" class="block mb-2 text-sm font-medium text-gray-900">Echipa</label>
                <input type="text" id="text" v-model="echipa.name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
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
    <div class="flex flex-col gap-4">
        <div class="border-solid border-black border-2" v-for="una in echipe" :key="una.id">
            <p>{{una.name}}</p>
            <p>{{una.driver1}}</p>
            <p>{{una.driver2}}</p>
            <p>{{una._id}}</p>
            <button @click="deleteEchipa(una._id)">Delete</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
export default {
    name: "Test-form",
    data() {
        return {
            echipa: {
                name: "",
                driver1: "",
                driver2: "",
            },
            echipe: []
        }
    },
    mounted() {
        this.getEchipe()
    },
    methods: {
        createEchipa() {
            axios.post("https://f1-site-api.vercel.app/mongo", this.echipa)
            .then(response => {
                this.getEchipe()
                this.echipa.name = ""
                this.echipa.driver1 = ""
                this.echipa.driver2 = ""
            })
            .catch(error => console.log(error))
        },
        async getEchipe() {
            var link = "https://f1-site-api.vercel.app/mongo"
            const res = await axios(link)
            const data = res.data
            this.echipe = data
        },
        deleteEchipa(id) {
            axios.delete(`https://f1-site-api.vercel.app/mongo/delete/${id}`)
            .then(response => this.getEchipe())
            .catch(error => console.log(error))
        }
    },
}
</script>

<style>
    .form-wrapper{
        width: 100vw;
        height: 80vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>