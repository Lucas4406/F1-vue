import {reactive} from "vue"
import axios from "axios"
const currUser = JSON.parse(localStorage.getItem("currentUser"))
let favD 
let favT
await getUserData(currUser)
const state = reactive({
    name: currUser,
    favDriver: favD,
    favTeam: favT
})

async function getUserData (user){
    const response = await axios(`https://f1-site-api.vercel.app/profile/${user}`)
    const data = response.data[0]
    favD = data.favDriver
    favT = data.favTeam
}


export default {
    state: state
}