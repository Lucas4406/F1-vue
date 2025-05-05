import axios from "axios"
async function getNext() {
    let link_api = `${import.meta.env.VITE_API_LINK}/get-next`
    const res = await axios.get(link_api)
    const cursaActuala = res.data.nr_runda
    return cursaActuala
}

export default getNext()