<template>
    <div class="bg-black bottom-0 left-0 right-0 text-red-500 mb-0 h-36 flex items-center justify-center flex-row gap-10 text-xl">
        <div>
            <div class="flex flex-row gap-4">
                <router-link to="/login" class="bg-red-500 text-black px-4 py-2" @click="bla" v-if="!isLoggedIn">Log In</router-link>
                <router-link to="/signup" class="bg-red-500 text-black px-4 py-2" @click="bla" v-if="!isLoggedIn">Sign Up</router-link>
            </div>
        </div>
        <div v-if="isLoggedIn">
            <div class="each flex rounded shadow w-max text-gray-600 bg-white">
            <div class="sec self-center p-2 pr-1"><img data="picture" class="w-10  border p-0.5 rounded-full aspect-square" :src="Poza" alt="profile-pic" v-if="profilePic"/></div>
            <div class="sec self-center p-2 w-64">
                <div class="flex">
                <div class="name text-sm">{{Name}}</div>
                </div>
                <div class="title text-xs text-gray-400 -mt-1">{{Email}}</div>
            </div>
            <div class="sec self-center p-2 w-2/8">
                <div class="buttons text-xs flex font-light">
                    <router-link to="/profile" class="btn p-2 mr-1 rounded shadow cursor-pointer hover:bg-gray-100">
                        <svg class="w-5 h-5" viewBox="0 0 32 32" enable-background="new 0 0 32 32" id="Stock_cut" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><desc/><g><circle cx="16" cy="16" fill="none" r="15" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><path d="M26,27L26,27   c0-5.523-4.477-10-10-10h0c-5.523,0-10,4.477-10,10v0" fill="none" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><circle cx="16" cy="11" fill="none" r="6" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/></g></svg>
                    </router-link>
                    <div class="btn p-2 mr-1 rounded shadow cursor-pointer hover:bg-gray-100" @click="logout">
                        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5">
                            <path d="M868 732h-70.3c-4.8 0-9.3 2.1-12.3 5.8-7 8.5-14.5 16.7-22.4 24.5a353.84 353.84 0 0 1-112.7 75.9A352.8 352.8 0 0 1 512.4 866c-47.9 0-94.3-9.4-137.9-27.8a353.84 353.84 0 0 1-112.7-75.9 353.28 353.28 0 0 1-76-112.5C167.3 606.2 158 559.9 158 512s9.4-94.2 27.8-137.8c17.8-42.1 43.4-80 76-112.5s70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 7.9 7.9 15.3 16.1 22.4 24.5 3 3.7 7.6 5.8 12.3 5.8H868c6.3 0 10.2-7 6.7-12.3C798 160.5 663.8 81.6 511.3 82 271.7 82.6 79.6 277.1 82 516.4 84.4 751.9 276.2 942 512.4 942c152.1 0 285.7-78.8 362.3-197.7 3.4-5.3-.4-12.3-6.7-12.3zm88.9-226.3L815 393.7c-5.3-4.2-13-.4-13 6.3v76H488c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 0 0 0-12.6z"/>
                        </svg>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue'
    import { getAuth, onAuthStateChanged, signOut } from "firebase/auth" 
    import { useRouter } from 'vue-router'
    import axios from 'axios'
    const isLoggedIn = ref(false)
    const profilePic = ref(false)
    const Name = ref("")
    const Email = ref("")
    const Poza = ref("")
    const userID = ref("")
    const router = useRouter()
    let auth;
    onMounted(() => {
        auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if(user){
            localStorage.setItem("User" , JSON.stringify(user.email))
            localStorage.setItem("Username" , JSON.stringify(user.displayName))
            Name.value = user.displayName
            Email.value = user.email
            userID.value = user.uid
            getCurrentDbUser(userID.value)
            if(user.photoURL != null){
                Poza.value = user.photoURL
                profilePic.value = true
            }else{
                profilePic.value = false
            }
            isLoggedIn.value = true
        }else{
            localStorage.setItem("User" , null)
            localStorage.setItem("Username" , null)
            isLoggedIn.value = false
        }
     })
    })
    function logout() {
        signOut(auth).then(() => {
            userID.value = ""
            router.push("/")
        })
    }
    function bla () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }


    async function getCurrentDbUser (idul) {
        const response = await axios.get(`https://f1-site-api.vercel.app/profile/${idul}`)
        const data = response.data
    }
</script>

<style scoped>
    .text-xxs {
    font-size:0.7em;
  }
</style>