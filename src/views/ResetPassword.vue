<template>
  <div class="flex justify-center items-center min-h-screen text-white ">
    <div class="w-full max-w-md p-8 border border-gray-700 rounded-xl shadow-lg bg-[#2c2c2c]">
      <!-- Confirmare email + login -->
      <div v-if="mode === 'verifyEmail' && verified" class="w-full">
        <h2 class="text-2xl font-bold mb-4 text-center">Email Verified</h2>
        <p class="text-center mb-4">You can now log in to complete your registration.</p>
        <form @submit.prevent="login" class="space-y-4">
          <div class="user-box">
            <input type="email" v-model="email" required />
            <label>Email</label>
          </div>
          <div class="user-box">
            <input type="password" v-model="pass" required />
            <label>Password</label>
          </div>
          <p v-if="errMsg" class="text-red-400 text-sm text-center min-h-[1.5rem]">{{ errMsg }}</p>
          <button type="submit" class="login-button">
            <span></span><span></span><span></span><span></span>
            Log in
          </button>
        </form>
      </div>

      <!-- Resetare parolă -->
      <div v-else-if="mode === 'resetPassword'" class="w-full">
        <h2 class="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form @submit.prevent="resetPassword" class="space-y-4">
          <div class="user-box">
            <input type="password" v-model="newPass" required />
            <label>New Password</label>
          </div>
          <div class="user-box">
            <input type="password" v-model="confirmPass" required />
            <label>Confirm Password</label>
          </div>
          <p v-if="errMsg" class="text-red-400 text-sm text-center min-h-[1.5rem]">{{ errMsg }}</p>
          <button type="submit" class="login-button">
            <span></span><span></span><span></span><span></span>
            Reset Password
          </button>
        </form>
      </div>

      <!-- Cod invalid -->
      <div v-else>
        <h2 class="text-2xl font-bold mb-4 text-center">Invalid or Expired Link</h2>
        <p class="text-center">The link you followed is invalid or has expired.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  applyActionCode,
  confirmPasswordReset,
  signInWithEmailAndPassword,
  signOut,
    getAuth
} from 'firebase/auth'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

const mode = ref(route.query.mode || '')
const oobCode = ref(route.query.oobCode || '')
const verified = ref(false)
const auth = getAuth()
const email = ref('')
const pass = ref('')
const newPass = ref('')
const confirmPass = ref('')
const errMsg = ref('')

onMounted(async () => {
  if (mode.value === 'verifyEmail' && oobCode.value) {
    try {
      await applyActionCode(auth, oobCode.value)
      verified.value = true
    } catch (error) {
      verified.value = false
    }
  }
})

async function login() {
  errMsg.value = ''
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, pass.value)
    const user = userCredential.user
    if (user.emailVerified) {
      router.push('/update-profile')
    } else {
      errMsg.value = 'Please verify your email before logging in.'
      await signOut(auth)
    }
  } catch (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        errMsg.value = 'Invalid email address.'
        break
      case 'auth/user-not-found':
        errMsg.value = 'No account found.'
        break
      case 'auth/wrong-password':
        errMsg.value = 'Incorrect password.'
        break
      default:
        errMsg.value = 'Email or password are incorrect.'
        break
    }
  }
}

async function resetPassword() {
  errMsg.value = ''
  if (newPass.value !== confirmPass.value) {
    errMsg.value = 'Passwords do not match.'
    return
  }

  try {
    await confirmPasswordReset(auth, oobCode.value, newPass.value)
    router.push('/login')
  } catch (error) {
    errMsg.value = 'Failed to reset password. Please try again.'
  }
}
</script>

<style scoped>
.user-box {
  position: relative;
  margin-bottom: 24px;
}

.user-box input {
  width: 100%;
  padding: 10px 10px 10px 5px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  color: white;
  outline: none;
}

.user-box label {
  position: absolute;
  top: 10px;
  left: 5px;
  color: #fff;
  transition: 0.5s;
  pointer-events: none;
}

.user-box input:focus ~ label,
.user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #03e9f4;
  font-size: 12px;
}

.login-button {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  letter-spacing: 4px;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  text-align: center;
}

.login-button:hover {
  background: #03e9f4;
  color: #fff;
  box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
}

.login-button span {
  position: absolute;
  display: block;
}

.login-button span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03e9f4);
  animation: btn-anim1 1s linear infinite;
}

.login-button span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: btn-anim2 1s linear infinite;
  animation-delay: 0.25s;
}

.login-button span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: btn-anim3 1s linear infinite;
  animation-delay: 0.5s;
}

.login-button span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: btn-anim4 1s linear infinite;
  animation-delay: 0.75s;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%, 100% {
    top: 100%;
  }
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%, 100% {
    right: 100%;
  }
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%, 100% {
    bottom: 100%;
  }
}
</style>
