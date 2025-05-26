<template>
  <div class="w-screen flex justify-center items-center min-h-screen flex-col">
    <div class="login-box">
      <h2>Sign up</h2>
      <form @submit.prevent="register">
        <div class="user-box">
          <input type="email" name="" required="" v-model="email" />
          <label>Email</label>
        </div>
        <div class="user-box">
          <input type="password" name="" required="" v-model="pass" />
          <label>Password</label>
        </div>
        <div class="user-box">
          <input type="password" name="" required="" v-model="passConfirm" />
          <label>Confirm password</label>
        </div>
        <h3 class="text-white additional">
          Already have an account?
          <span class="clear"
            ><RouterLink to="/login" class="text-[#03e9f4]"
              >Log in</RouterLink
            ></span
          >
        </h3>
        <button type="submit" class="login-button">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Sign up
        </button>
        <input type="submit" hidden />
      </form>
    </div>
  </div>
</template>

<script setup>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { ref } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
const pass = ref("")
const email = ref("")
const passConfirm = ref("")
const router = useRouter()
async function register() {
  const auth = getAuth()
  if (pass.value === passConfirm.value) {
    try {
      const data = await createUserWithEmailAndPassword(auth, email.value, pass.value)
      await createDbUser()
      router.push("/updateprofile")
    } catch (error) {
      alert(error.message)
    }
  } else {
    alert("Passwords don't match")
  }
}

async function createDbUser() {
  const auth = getAuth()
  const current = auth.currentUser
  if (!current) return

  const token = await current.getIdToken(/* forceRefresh */ true)

  try {
    await axios.post(
        `${import.meta.env.VITE_API_LINK}/profile`,
        {
          displayName: current.displayName,
          profileId: current.uid,
          email: current.email,
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
