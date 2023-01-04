import CryptoJS from "crypto-js"
// Decrypt the user id
export function decrypt(encryptedUserId) {
  const bytes = CryptoJS.AES.decrypt(
    encryptedUserId,
    import.meta.env.VITE_CRYPTO_KEY
  )
  const originalText = bytes.toString(CryptoJS.enc.Utf8)
  return decodeURIComponent(originalText)
}
