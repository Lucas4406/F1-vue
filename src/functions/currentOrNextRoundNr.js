import axios from "axios"
async function currentOrNextRoundNr() {
    let link_api = `${import.meta.env.VITE_API_LINK}/weekend-status`
    const res = await axios.get(link_api)
    return Number(res.data.race.meetingNumber) - 1
}

export default currentOrNextRoundNr()