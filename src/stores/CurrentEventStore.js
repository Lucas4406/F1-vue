import { defineStore } from 'pinia'
import axios from 'axios'

export const useCurrentEventStore = defineStore('data', {
    state: () => ({
        items: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchData() {
            this.loading = true
            this.error = null
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_CLOUDFLARE_PROXY_LINK}/v1/event-tracker`)
                this.items = data
            } catch (err) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        }
    }
})
