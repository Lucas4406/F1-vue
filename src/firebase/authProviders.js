import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"

export async function loginWithGoogle() {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    return await signInWithPopup(auth, provider)
}

export async function loginWithGitHub() {
    const auth = getAuth()
    const provider = new GithubAuthProvider()
    return await signInWithPopup(auth, provider)
}