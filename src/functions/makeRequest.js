import axios from "axios";

export function makeRequest(url, optional){
    return axios(url,optional).then(res => res.data).catch(err => Promise.reject(err?.response?.data?.message ?? "Error"))
}