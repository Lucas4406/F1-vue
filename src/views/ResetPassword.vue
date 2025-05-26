<template>
  <div class="w-screen flex justify-center items-center min-h-screen flex-col">
    <div class="login-box">
      <h2>Log in</h2>
      <form @submit.prevent="resetPassword">
        <div class="user-box">
          <input type="password" name="" required="" v-model="pass" />
          <label>Password</label>
        </div>
        <div class="user-box">
          <input type="password" name="" required="" v-model="passConfirm" />
          <label>Confirm password</label>
        </div>
        <p class="m-0 p-0 w-full text-center text-white">{{ errMsg }}</p>
        <button type="submit" class="login-button">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Submit
        </button>
        <input type="submit" hidden />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth'

const route = useRoute()
const router = useRouter()
const pass = ref('')
const passConfirm = ref('')
const errMsg = ref('')
const message = ref('')
const oobCode = route.query.oobCode || ''

const auth = getAuth()

onMounted(async () => {
  if (!oobCode) {
    errMsg.value = 'Invalid or missing reset code.'
    return
  }

  try {
    await verifyPasswordResetCode(auth, oobCode)
  } catch (err) {
    errMsg.value = 'This password reset link is invalid or has expired.'
  }
})

async function resetPassword() {
  errMsg.value = ''
  message.value = ''

  if (pass.value !== passConfirm.value) {
    errMsg.value = 'Passwords do not match.'
    return
  }

  try {
    await confirmPasswordReset(auth, oobCode, pass.value)
    message.value = 'Your password has been reset successfully! Redirecting...'
    setTimeout(() => router.push('/login'), 3000)
  } catch (error) {
    errMsg.value = error.message || 'Something went wrong.'
  }
}
</script>


<style scoped>
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
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
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
