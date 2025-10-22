import { defineStore } from 'pinia'
import {fetchF1WithCache} from "@/functions/fetchF1WithCache";

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
                const { data } = await fetchF1WithCache("/v1/event-tracker", 4*60)
                this.items = data
            } catch (err) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        }
    }
})
