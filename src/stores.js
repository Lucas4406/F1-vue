import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
    state: () => ({
        count: Number(localStorage.getItem('count')) || 0,
        user: "",
        heroBanner: [],
        isLoading: true,
    }),
    actions: {
        increment() {
            this.count++
            localStorage.setItem('count', this.count)
        },
        decrease() {
            this.count--
            localStorage.setItem('count', this.count)
        },
    },
})