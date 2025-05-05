import CryptoJS from "crypto-js"

// Encrypt the user id
export function encrypt(userId) {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(userId),
    import.meta.env.VITE_CRYPTO_KEY
  )
  return encodeURIComponent(ciphertext.toString(CryptoJS.format.OpenSSL))
}
