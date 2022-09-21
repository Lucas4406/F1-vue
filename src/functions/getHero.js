import axios from "axios"
import getNext from "./getNext"

async function getHero () {
    var j= await getNext
    var link = "https://f1-site-api.vercel.app/up-next/" + j
    const response = await axios.get(link)
    const resData = response.data
    return resData 
}


export default getHero()