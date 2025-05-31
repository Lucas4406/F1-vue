<template>
  <div class="w-screen flex justify-center items-center min-h-screen flex-col">
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
    </div>
  </div>
</template>

<script setup>
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { ref } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

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

async function createDbUser(user) {
  if (!user) return
  const token = await user.getIdToken(/* forceRefresh */ true)
  try {
    await axios.post(
        `${import.meta.env.VITE_API_LINK}/profile`,
        {
          displayName: user.displayName,
          profileId: user.uid,
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    )
  } catch (error) {
    alert("Eroare la crearea profilului în baza de date: " + error.message)
  }
}
</script>

<style scoped>
/* păstrează stilurile tale deja existente */
</style>
