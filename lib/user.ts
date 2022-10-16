import axios from 'axios';
import { UserRecord } from 'firebase-admin/auth';
import firebase from 'firebase/app';
import { UserProfile } from './interfaces';
import { UserRole } from './utilities/AppEnums';
import { printErrorTrace } from './utilities/errorHandler';

const HOST = process.env.APP_HOST ? process.env.APP_HOST : 'http://localhost';
const PORT = process.env.APP_PORT ? process.env.APP_PORT : 3000;
const URL = HOST + ':' + PORT;

export const registerUser = async (email: string, password: string) => {
    return firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Signed in
            return userCredential.user;
        })
        .catch(error => {
            printErrorTrace(registerUser, error, false);
        });
};

export const getCurrentUser = () => {
    return firebase.auth().currentUser;
};

export const loginUser = async (email: string, password: string) => {
    return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(error => {
            printErrorTrace(loginUser, error, false);
        });
};
export const logoutUser = (callback: { (): Promise<boolean>; (): any }) => {
    firebase
        .auth()
        .signOut()
        .then(() => callback());
};

export const updateUserProfile = async (userProfile: UserProfile) => {
    const user = firebase.auth().currentUser;
    let isUpdated = false;

    if (user) {
        await user
            .updateProfile(userProfile)
            .then(() => {
                isUpdated = true;
            })
            .catch(error => {
                printErrorTrace(updateUserProfile, error, false);
            });
    }

    return isUpdated;
};

export const deleteUser = async () => {
    const user = firebase.auth().currentUser;
    let isDeleted = false;
    if (user) {
        await user
            .delete()
            .then(() => {
                isDeleted = true;
            })
            .catch(error => {
                printErrorTrace(deleteUser, error, false);
            });
    }

    return isDeleted;
};

export const getUserAsAdmin = async (email: string) => {
    let user: UserRecord;
    await axios.get(URL + '/api/admin/users/' + email).then(response => {
        if (response.data && response.data.user) {
            user = response.data.user;
        }
    }).catch(error => {
        printErrorTrace(getUserAsAdmin, error, false);
    })

    return user! ? user : undefined;
}

export const getAllUsersAsAdmin = async () => {
    let users: UserRecord[] = [];
    await axios.get(URL + '/api/admin/users').then(response => {
        if (response.data && response.data.users) {
            users = response.data.users;
        }
    }).catch(error => {
        printErrorTrace(getAllUsersAsAdmin, error, false);
    })

    return users;
}

export const getUsersByRoleAsAdmin = async (role: UserRole) => {
    let users: UserRecord[] = [];
    await axios.get(URL + '/api/admin/users' + '?role=' + role).then(response => {
        if (response.data && response.data.users) {
            users = response.data.users;
        }
    }).catch(error => {
        printErrorTrace(getUsersByRoleAsAdmin, error, false);
    })

    return users;
}

export const getUserRoleAsAdmin = async (email: string) => {
    let role: string;
    await axios.get(URL + '/api/admin/users/' + email + '/role').then(response => {
        if (response.data && response.data.role) {
            role = response.data.role;
        }
    }).catch(error => {
        printErrorTrace(getUserRoleAsAdmin, error, false);
    })

    return role! ? role : undefined;
}

export const setUserRoleAsAdmin = async (email: string, role: UserRole) => {
    let isUpdated = false;
    await axios.post(URL + '/api/admin/users/' + email + '/role', {
        role: role
    }).then(response => {
        if (response.data && response.data.success) {
            isUpdated = true;
        }
    }).catch(error => {
        printErrorTrace(setUserRoleAsAdmin, error, false);
    })

    return isUpdated;
}