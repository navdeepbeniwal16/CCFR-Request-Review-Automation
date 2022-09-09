import firebase from 'firebase/app'

export const registerUser = () => {

}

export const loginUser = async (email: string, password: string) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((ex) => ex);
}

export const logoutUser = (callback: { (): Promise<boolean>; (): any; }) => {
    firebase.auth().signOut().then(() => callback())
}