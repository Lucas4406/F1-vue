<template>
  <div class="w-screen flex justify-center items-center min-h-screen flex-col pt-4">
    <div class="login-box">
      <h2>Sign up</h2>
      <form @submit.prevent="register">
        <div class="user-box">
          <input type="email" required v-model="email" />
          <label>Email</label>
        </div>
        <div class="user-box">
          <input type="password" required v-model="pass" />
          <label>Password</label>
        </div>
        <div class="user-box">
          <input type="password" required v-model="passConfirm" />
          <label>Confirm password</label>
        </div>
        <h3 class="text-white additional">
          Already have an account?
          <span class="clear">
            <RouterLink to="/login" class="text-[#03e9f4]">Log in</RouterLink>
          </span>
        </h3>
        <button type="submit" class="login-button">
          <span></span><span></span><span></span><span></span>
          Sign up
        </button>
      </form>
      <div class="flex flex-col space-y-3 mt-6">
        <button
            @click.prevent="oauthLogin('google')"
            class="oauth-btn flex items-center justify-center bg-white text-black hover:bg-gray-100 border border-gray-300"
        >
          <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              class="w-5 h-5 mr-2"
          />
          Sign up with Google
        </button>

        <button
            @click.prevent="oauthLogin('github')"
            class="oauth-btn flex items-center justify-center bg-black text-white hover:bg-gray-800"
        >
          <svg class="w-5 h-5 mr-2" fill="white" viewBox="0 0 24 24">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 008.01 10.94c.59.11.8-.26.8-.58v-2.02c-3.26.71-3.95-1.57-3.95-1.57-.54-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.84 2.8 1.31 3.48 1 .11-.77.42-1.31.76-1.61-2.6-.3-5.34-1.3-5.34-5.77 0-1.28.47-2.33 1.23-3.15-.12-.3-.53-1.52.12-3.16 0 0 1-.32 3.3 1.2a11.46 11.46 0 016 0c2.28-1.52 3.28-1.2 3.28-1.2.65 1.64.24 2.86.12 3.16.77.82 1.23 1.87 1.23 3.15 0 4.49-2.75 5.46-5.37 5.75.43.37.81 1.1.81 2.23v3.3c0 .32.2.7.81.58A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"
            />
          </svg>
          Sign up with GitHub
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { loginWithGoogle, loginWithGitHub } from "@/firebase/authProviders"
import { ref } from "vue"
import { useRouter } from "vue-router"
import {authRequest} from "@/functions/authRequest";

const email = ref("")
const pass = ref("")
const passConfirm = ref("")
const router = useRouter()

document.title = "GridFanHub | Sign-up"


async function register() {
  if (pass.value !== passConfirm.value) {
    alert("Passwords don't match")
    return
  }
  const auth = getAuth()
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, pass.value)
    const user = userCredential.user

    // Trimite email de confirmare
    await sendEmailVerification(user)

    // Creează user în baza ta
    await createDbUser(user)

    // Redirecționează spre pagina de confirmare email
    router.push("/confirm")
  } catch (error) {
    alert(error.message)
  }
}
async function oauthLogin(provider) {
  try {
    let userCredential
    if (provider === "google") {
      userCredential = await loginWithGoogle()
    } else if (provider === "github") {
      userCredential = await loginWithGitHub()
    }
    const user = userCredential.user

    // Creează user în baza ta dacă e nou
    await createDbUser(user)

    router.push("/update-profile") // sau direct în dashboard, cum preferi
  } catch (err) {
    alert("Login failed: " + err.message)
  }
}

async function createDbUser(user) {
  if (!user) return
  try {
    await authRequest("POST",
        `${import.meta.env.VITE_API_LINK}/profile`,
        {
          displayName: user.displayName,
          profileId: user.uid,
          email: user.email,
        })
  } catch (error) {
    alert("Eroare la crearea profilului în baza de date: " + error.message)
  }
}
</script>

<style scoped>
.oauth-btn {
  padding: 10px 16px;
  font-weight: 600;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
}
html {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
}
.login-button{
  background: none;
  border: none;
  cursor: pointer;
}
.login-box {
  width: 80%;
  max-width: 600px;
  padding: 40px;
  background: rgba(0,0,0,0.5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0,0,0,0.6);
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
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #03e9f4;
  font-size: 12px;
}

.login-box form .login-button {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 40px;
  letter-spacing: 4px;
}

.login-box .login-button:hover {
  background: #03e9f4;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4,
  0 0 100px #03e9f4;
}

.login-box .login-button span {
  position: absolute;
  display: block;
}

.login-box .login-button span:nth-child(1) {
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
  50%,
  100% {
    left: 100%;
  }
}

.login-box .login-button span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: btn-anim2 1s linear infinite;
  animation-delay: 0.25s;
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }
}

.login-box .login-button span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: btn-anim3 1s linear infinite;
  animation-delay: 0.5s;
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,
  100% {
    right: 100%;
  }
}

.login-box .login-button span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: btn-anim4 1s linear infinite;
  animation-delay: 0.75s;
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }
}
</style>
