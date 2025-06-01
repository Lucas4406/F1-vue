import { reactive } from "vue"

const state = reactive({
  user: "",
  heroBanner: [],
  isLoading: true,
})

export default {
  state,
}
