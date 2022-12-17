import {reactive} from "vue"
import axios from "axios"
let currUser = JSON.parse(localStorage.getItem("currentUser"))
let favD 
let favT
let profilePic
let nick
let email
let notLogged
if(currUser != null){
    await getUserData(currUser.currentUser)
}else{
    notLogged = "No user"
}
async function getUserData (user){
    const response = await axios(`https://f1-site-api.vercel.app/profile/${user}`)
    if(response != null){
        const data = response.data[0]
        favD = data.favDriver
        favT = data.favTeam
        email = data.email
        nick = data.displayName
        profilePic = data.profilePhoto
    }else{
        notLogged = "No user"
    }
}

const state = reactive({
    name: currUser,
    favDriver: favD,
    favTeam: favT,
    profilePic: profilePic,
    nick: nick,
    email: email,
    notL: notLogged
})


export default {
    state: state
}