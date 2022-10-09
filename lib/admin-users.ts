import { getAuth, UserRecord } from 'firebase-admin/auth';
import admin from 'firebase-admin/';
import { AdminApp } from "./AdminApp";

const app:admin.app.App = AdminApp.getInstance();

export const getUser = async (userEmail:string): Promise<any> => {
    let user = null;

    const result = await getAuth()
        .getUserByEmail(userEmail)
        .then((userRecord) => {
            if(userRecord) user = userRecord;
        })
        .catch((error) => {
            console.log('Error fetching user data:', error);
        });

    return user;
}

export const getUserRole = async (userEmail:string) => {
    const user:UserRecord = await getUser(userEmail);
    if(user && user.customClaims && user.customClaims.role) {
        return user.customClaims.role;
    }

    return null;
}

// query func to check if the user exists on the database or not
export const userExists = async (userEmail:string): Promise<Boolean> => {
    const user = await getUser(userEmail);
    if(user) return true;

    return false;
}

export const setUserRole = async (userEmail:string, userRole: string): Promise<any> => {
    let isUpdated = false;

    const user:UserRecord = await getUser(userEmail);
    if(user) {
        await getAuth().setCustomUserClaims(user.uid, { role: userRole });
        isUpdated = true;
    }

    console.log('Is user role updated? : ' + isUpdated);
    return isUpdated;
};

export const removeUserRole = async (userEmail:string): Promise<any> => {
    let isRemoved = false;
    
    const user:UserRecord = await getUser(userEmail);
    if(user) {
        await getAuth().setCustomUserClaims(user.uid, {}); // updating with an empty claim
        isRemoved = true;
    }

    console.log('Is user role removed? : ' + isRemoved);
    return isRemoved;
};

