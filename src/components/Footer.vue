<template>
    <div class="bg-black bottom-0 left-0 right-0 text-red-500 mb-0 h-36 flex items-center justify-center flex-col gap-2 text-xl">
        <div class="flex flex-row gap-4">
            <router-link to="/login" class="text-red-500" @click="bla">Log In</router-link>
            <router-link to="/signup" class="text-red-500" @click="bla">Sign Up</router-link>
        </div>
        <div class="">
            <button @click="logout" v-if="isLoggedIn" class="bg-red-500 text-black hover:scale-105 transition-all duration-200 cursor-pointer h-10">Log out</button>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue'
    import { getAuth, onAuthStateChanged, signOut } from "firebase/auth" 
    import { useRouter } from 'vue-router'
    const isLoggedIn = ref(false)
    const router = useRouter()
    let auth;
    onMounted(() => {
        auth = getAuth()
        onAuthStateChanged(auth, (user) => {
        if(user){
            localStorage.setItem("User" , JSON.stringify(user.email))
          isLoggedIn.value = true
        }else{
            localStorage.setItem("User" , null)
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

<style>

</style>