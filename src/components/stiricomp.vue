<template>
  <div v-if="show">
    <div class="stiri">
      <div class="titlu">
        <div>
          <img src="/checker.webp" class="titlu-poza" />
        </div>
        <div class="titlu-text">Știri de ultimă oră</div>
        <div>
          <img src="/checker.webp" class="titlu-poza" />
        </div>
      </div>
    </div>
    <div class="content-grid">
      <a
        :href="stire.link"
        v-for="stire in news"
        v-bind:key="stire.id"
        class="ltag"
        target="_blank"
        v-motion-slide-right
      >
        <div class="stire">
          <div class="content-row">
            <div class="content-text">
              <p class="text" id="stiretext">{{ stire.titlu }}</p>
            </div>
            <div class="content-photo">
              <v-img
                :src="stire.poza"
                class="photo"
                id="stirephoto"
                :alt="stire.titlu"
              />
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
  <div class="loading" v-if="!show">
    <ProgressSpinner />
  </div>
</template>

<script>
import axios from "axios"
import { isItemInSessionStorage } from "../functions/checkSessionS.js"
export default {
  name: "Stiri",
  data() {
    return {
      news: [],
      show: false,
      raspuns: [],
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      let now = new Date()
      let sessionData = JSON.parse(sessionStorage.getItem("news"))
      if (
        isItemInSessionStorage("news") == 0 ||
        sessionData.exp < now.toISOString()
      ) {
        var link = `${import.meta.env.VITE_API_LINK}/mongo/stiri/6`
        const response = await axios.get(link)
        const resData = response.data
        this.news = resData
        if (this.news !== undefined) {
          this.show = true
        }
        let expiration = new Date()
        expiration.setMinutes(expiration.getMinutes() + 30)
        const storeItem = {
          exp: expiration,
          data: resData,
        }
        if(storeItem.data){
          sessionStorage.setItem("news", JSON.stringify(storeItem))
        }
      } else {
        const data = JSON.parse(sessionStorage.getItem("news"))
        this.news = data.data
        if (this.news !== undefined) {
          this.show = true
        }
      }
    },
  },
}
</script>
