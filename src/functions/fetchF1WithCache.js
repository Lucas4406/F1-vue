import axios from "axios";

export async function fetchF1WithCache(path, cacheDur = null){
    const base_url = import.meta.env.VITE_CLOUDFLARE_PROXY_LINK;
    const fetch_link = `${base_url}${path}`
    let response
    try{
        response = await axios.get(fetch_link, {
            headers: {
                "X-Cache-Duration": cacheDur
            }
        });
    }catch(e){
        console.error("CLoudflare profy error:", e);
        throw new Error("Can't fetch data from F1 API");
    }
    return response
}