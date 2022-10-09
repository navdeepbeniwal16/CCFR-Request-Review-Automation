import firebase from 'firebase/app'
import { UserProfile } from './interfaces';

export const registerUser = async (email: string, password: string) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in 
        return userCredential.user;
    })
    .catch((error) => {
        printErrorTrace(registerUser, error, false)
    });
}

export const getCurrentUser = () => {
    return firebase.auth().currentUser;
}

export const loginUser = async (email: string, password: string) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {
            printErrorTrace(loginUser, error, false);
        });
} 

export const logoutUser = (callback: { (): Promise<boolean>; (): any; }) => {
    firebase.auth().signOut().then(() => callback())
}

export const updateUserProfile = async (userProfile:UserProfile) => {
    const user = firebase.auth().currentUser;
    let isUpdated = false;

    if(user) {
        await user.updateProfile(userProfile).then(() => {
            isUpdated = true;
        }).catch((error) => {
            printErrorTrace(updateUserProfile, error, false);
        });
    }

    return isUpdated;
}

export const deleteUser = async () => {
    const user = firebase.auth().currentUser;
    let isDeleted = false;
    if(user) {
        await user.delete().then(() => {
            isDeleted = true;
        }).catch((error) => {
            printErrorTrace(deleteUser, error, false);
        });
    }

    return isDeleted;
}

const printErrorTrace = (func: any, error: any, includeStackTrace: boolean) => {
    console.log(`Error occured at ${func.name}`);
    console.log('Error code : ' + error.errorCode);
    console.log('Error message : ' + error.message);
    
    if(includeStackTrace) {
        console.log('Stack trace is ON');
        console.log(error);
    }
}