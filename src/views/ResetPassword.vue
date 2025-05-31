<template>
  <div class="w-screen flex justify-center items-center min-h-screen flex-col bg-gray-900 text-white px-4">
    <div class="login-box max-w-md w-full text-center">
      <h2 class="text-2xl font-bold mb-4">Email Confirmation</h2>

      <!-- Confirmare email -->
      <div v-if="mode === 'verifyEmail' && verified" class="space-y-4">
        <p class="text-green-400">Thanks for signing up!</p>
        <p>Click on the button below to finish registration.</p>
        <router-link to="/update-profile" class="login-button inline-block">Continue</router-link>
      </div>

      <!-- Resetare parolă -->
      <form v-if="mode === 'resetPassword' && !resetDone" @submit.prevent="handlePasswordReset" class="space-y-4">
        <div class="user-box">
          <input type="password" v-model="password" required />
          <label>New Password</label>
        </div>
        <div class="user-box">
          <input type="password" v-model="confirmPassword" required />
          <label>Confirm Password</label>
        </div>
        <p v-if="error" class="text-red-400">{{ error }}</p>
        <p v-if="message" class="text-green-400">{{ message }}</p>
        <button class="login-button" type="submit">Reset Password</button>
      </form>
      <div v-if="resetDone" class="space-y-4">
        <p class="text-green-400">Password successfully reset. You can now log in.</p>
        <router-link to="/login" class="login-button inline-block">Login</router-link>
      </div>

      <!-- Cod invalid -->
      <p v-if="invalidCode" class="text-red-400">
        The code is invalid or expired. Please <router-link to="/signup" class="underline">sign up again</router-link>.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAuth, applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth'

const route = useRoute()
const auth = getAuth()

const mode = ref('')
const oobCode = ref('')
const verified = ref(false)
const invalidCode = ref(false)
const resetDone = ref(false)

const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const message = ref('')

onMounted(async () => {
  mode.value = route.query.mode
  oobCode.value = route.query.oobCode

  if (!mode.value || !oobCode.value) {
    invalidCode.value = true
    return
  }

  if (mode.value === 'verifyEmail') {
    try {
      await applyActionCode(auth, oobCode.value)
      verified.value = true
    } catch (e) {
      invalidCode.value = true
    }
  }

  if (mode.value === 'resetPassword') {
    try {
      await verifyPasswordResetCode(auth, oobCode.value)
    } catch (e) {
      invalidCode.value = true
    }
  }
})

async function handlePasswordReset() {
  error.value = ''
  message.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }

  try {
    await confirmPasswordReset(auth, oobCode.value, password.value)
    resetDone.value = true
  } catch (e) {
    error.value = 'Failed to reset password.'
  }
}
</script>

<style scoped>
/* Same style as in your login/reset */
.login-box {
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  padding: 40px;
  border-radius: 10px;
}

.login-box h2 {
  color: #fff;
}

.user-box {
  position: relative;
}

.user-box input {
  width: 100%;
  padding: 10px 0;
  color: #fff;
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  margin-bottom: 30px;
}

.user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  color: #fff;
  transition: 0.5s;
  pointer-events: none;
}

.user-box input:focus ~ label,
.user-box input:valid ~ label {
  top: -20px;
  font-size: 12px;
  color: #03e9f4;
}

.login-button {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  border: none;
  background: none;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.5s;
  letter-spacing: 2px;
}

.login-button:hover {
  background: #03e9f4;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4;
}
</style>
