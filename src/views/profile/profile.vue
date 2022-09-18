<template>
<div class="w-screen flex justify-center items-center min-h-screen flex-col">
    <!-- Update-box -->
    <div class="login-box" v-if="updateProf">
        <h2>Adaugă un nume și o poză!</h2>
        <form @submit.prevent="schimba">
            <div class="user-box">
            <input type="email" name="" required="" v-model="nume">
            <label>Nume</label>
            </div>
            <div class="user-box">
            <input type="text" name="" required="" v-model="poza">
            <label>Poză (link)</label>
            </div>
            <p class="m-0 p-0 w-full text-center text-white">{{errMsg}}</p>
            <a href="#" @click="schimba">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Gata
            </a>
            <input type="submit" hidden />
        </form>
    </div>

    <!-- Profile-box -->
    <div class="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700" v-if="!updateProf">
      <div class="flex justify-end px-4 pt-4">
          <button id="dropdownButton" data-dropdown-toggle="dropdown" class="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
              <span class="sr-only">Open dropdown</span>
              <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
          </button>
          <!-- Dropdown menu -->
          <div id="dropdown" class="hidden z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
              <ul class="py-1" aria-labelledby="dropdownButton">
              <li>
                  <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
              </li>
              <li>
                  <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
              </li>
              <li>
                  <a href="#" class="block py-2 px-4 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
              </li>
              </ul>
          </div>
      </div>
      <div class="flex flex-col items-center pb-10">
          <img class="mb-3 w-24 h-24 rounded-full shadow-lg" :src="Photo" alt="image"/>
          <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{{Name}}</h5>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{Email}}</span>
          <div class="flex mt-4 space-x-3 md:mt-6">
              <button @click="logout" class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">Log out</button>
          </div>
      </div>
  </div>
</div>
</template>

<script setup>
    import { getAuth, updateProfile, signOut } from "firebase/auth"
    import {ref} from "vue"
    import { useRouter } from "vue-router"
    const nume = ref("")
    const poza = ref("")
    const updateProf = ref(false)
    const Name = ref("")
    const Photo = ref("")
    const Email = ref("")
    const router = useRouter()
    const auth = getAuth()
    const user = auth.currentUser
    if(user.displayName === null || user.photoURL === null){
        updateProf.value = true
    }else{
        updateProf.value = false
    }
    if(user != null){
        Name.value = user.displayName
        Photo.value = user.photoURL
        Email.value = user.email
    }
    function schimba () {
        const auth = getAuth()
        updateProfile(auth.currentUser, {
            displayName: nume.value, photoURL: poza.value
        }).then((data) => {
            router.push("/")
        })
        .catch((err) => {
            alert(err.message)
        })
    }
    function logout() {
        signOut(auth).then(() => {
            router.push("/")
        })
    }
</script>

<style scoped>
    html {
  height: 100%;
}
body {
  margin:0;
  padding:0;
  background: linear-gradient(#141e30, #243b55);
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,.5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0,0,0,.6);
  border-radius: 10px;
}

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}
.login-box .user-box label {
  position: absolute;
  top:0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: .5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #03e9f4;
  font-size: 12px;
}

.login-box form a {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  margin-top: 40px;
  letter-spacing: 4px
}

.login-box a:hover {
  background: #03e9f4;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #03e9f4,
              0 0 25px #03e9f4,
              0 0 50px #03e9f4,
              0 0 100px #03e9f4;
}

.login-box a span {
  position: absolute;
  display: block;
}

.login-box a span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03e9f4);
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%,100% {
    left: 100%;
  }
}

.login-box a span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: btn-anim2 1s linear infinite;
  animation-delay: .25s
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%,100% {
    top: 100%;
  }
}

.login-box a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: btn-anim3 1s linear infinite;
  animation-delay: .5s
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,100% {
    right: 100%;
  }
}

.login-box a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: btn-anim4 1s linear infinite;
  animation-delay: .75s
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,100% {
    bottom: 100%;
  }
}

</style>