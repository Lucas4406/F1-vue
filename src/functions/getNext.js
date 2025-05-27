import axios from "axios"
async function getNext() {
    let link_api = `${import.meta.env.VITE_API_LINK}/get-next`
    const res = await axios.get(link_api)
    return res.data
}

export default getNext()