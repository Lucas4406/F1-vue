<template>
  <div class="w-screen flex justify-center items-center min-h-screen flex-col">
    <div class="login-box">
      <h2>Thanks for signing up!</h2>
      <p class="message-text">
        Please check your email and click on the confirmation link to continue setting up your account. If you don't see the email in the primary folder check your Spam folder.
      </p>
    </div>
  </div>
</template>

<script setup>
import {useHead} from "@vueuse/head";

useHead({
  title: `GridFanHub | Email confirmation page`,
  meta: [
    {
      name: "description",
      content: `Login page for GridFanHub. Access your account`,
    },
    {
      name: "keywords",
      content: `gridfanhub, profile, account, login, sign in, f1, formula 1, motorsport`,
    },
    {
      name: "robots",
      content: "index, follow",
    }
  ],
  link: [
    {
      rel: "canonical",
      href: `https://gridfanhub.com/confirm`,
    },
  ],
})
</script>

<style scoped>
html {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
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
  color: #fff;
  text-align: center;
}

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #03e9f4;
  font-weight: 700;
}

.message-text {
  font-size: 16px;
  line-height: 1.5;
  color: #eee;
  margin: 0;
  user-select: none;
}
</style>
