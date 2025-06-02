import axios from "axios"

export function callOpenF1(url, optional){
    return axios(`https://api.openf1.org/v1${url}`,optional).then(res => res.data).catch(err => Promise.reject(err?.response?.data?.message ?? "Error"))
}