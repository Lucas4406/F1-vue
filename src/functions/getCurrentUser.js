import { getAuth } from "firebase/auth"
export function getUser () {
    const current  = getAuth()
    const id = current.currentUser.uid
    return id
}