import axios from "axios"
async function fetchStiri () {
    var j=0
    for(j=0;j<4;j++){
        var link = "https://f1-site-api.vercel.app/stiri-translate/" + j
        const response = await axios.get(link)
        const resData = response.data
        return resData
    }
}

export default fetchStiri()