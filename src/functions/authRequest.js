// utils/authRequest.js
import { getAuth } from "firebase/auth"
import axios from "axios"

/**
 * Universal authenticated request to Express backend.
 * @param {string} method - HTTP method: GET, POST, PUT, DELETE
 * @param {string} url - Full API URL (e.g. `${import.meta.env.VITE_API_LINK}/profile/...`)
 * @param {object} [data] - Payload for POST/PUT
 * @returns {Promise<any>} - Response data or error
 */
export async function authRequest(method, url, data = null) {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) {
        throw new Error("User is not authenticated")
    }

    const token = await user.getIdToken()

    const config = {
        method,
        url,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        ...(data && { data }),
    }

    try {
        const response = await axios(config)
        return response.data
    } catch (error) {
        console.error("Authenticated request failed:", error.response?.data || error.message)
        throw error
    }
}
