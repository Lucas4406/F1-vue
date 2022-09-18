<template>
    <div class="bg-black bottom-0 left-0 right-0 text-red-500 mb-0 h-36 flex items-center justify-around flex-row gap-10 text-xl">
        <div>
            <div class="flex flex-row gap-4">
                <router-link to="/login" class="text-red-500" @click="bla">Log In</router-link>
                <router-link to="/signup" class="text-red-500" @click="bla">Sign Up</router-link>
            </div>
            <div class="flex flex-row gap-4 text-lg">
                <button @click="logout" v-if="isLoggedIn" class="bg-red-500 text-black hover:scale-105 transition-all duration-200 cursor-pointer h-10">Log out</button>
                <router-link to="/profile" v-if="isLoggedIn" class="bg-red-500 text-black hover:scale-105 transition-all duration-200 cursor-pointer flex justify-center items-center px-2 h-10" @click="bla">Profil</router-link>
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
                <div class="btn p-2 mr-1 rounded shadow cursor-pointer hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div class="btn p-2 mr-1 rounded shadow cursor-pointer hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
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
    const isLoggedIn = ref(false)
    const profilePic = ref(false)
    const Name = ref("")
    const Email = ref("")
    const Poza = ref("")
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
            router.push("/")
        })
    }
    function bla () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
</script>

<style scoped>
    .text-xxs {
    font-size:0.7em;
  }
</style>