import firebase from 'firebase/app'

export const registerUser = () => {

}

export const loginUser = async (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((ex) => ex);
}

export const logoutUser = (callback) => {
    firebase.auth().signOut().then(() => callback())
}