import axios from "axios"
async function getNext() {
    var link = "https://ergast.com/api/f1/2023/results.json?limit=1000"
    const response = await axios.get(link)
    const resData = response.data.MRData.RaceTable.Races.length
    return resData
}

export default getNext()