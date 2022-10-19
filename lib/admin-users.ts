import { Auth, UserRecord } from 'firebase-admin/auth';
import { getFirebaseAdmin } from 'next-firebase-auth'
import { printErrorTrace } from './utilities/errorHandler';
import { UserRole } from './utilities/AppEnums';
import initAuth from './initAuth';

initAuth();
let adminAuth: Auth = getFirebaseAdmin().auth();

export const getUser = async (email: string): Promise<any> => {
    let user = null;

    const result = await adminAuth
        .getUserByEmail(email)
        .then(userRecord => {
            if (userRecord) user = userRecord;
        })
        .catch(error => {
            printErrorTrace(getUser, error, false);
        });

    return user;
};

export const getAllUsers = async (nextPageToken?: string) => {
    const users: UserRecord[] = [];

    await adminAuth
        .listUsers(1000, nextPageToken) // 1000 is the maximum number of users that can be fetched from firebase in single request
        .then(async listUsersResult => {
            listUsersResult.users.forEach(userRecord => {
                users.push(userRecord);
            });
            if (listUsersResult.pageToken) {
                const usersFromRecurseiveReq = await getAllUsers(
                    listUsersResult.pageToken,
                );
                users.push(...usersFromRecurseiveReq);
            }
        })
        .catch(error => {
            printErrorTrace(getAllUsers, error, false);
        });

    return users;
};

export const getUsersByRole = async (role: UserRole) => {
    const users: UserRecord[] = [];
    const allUsers: UserRecord[] = await getAllUsers();
    allUsers.forEach(user => {
        if (
            user.customClaims &&
            user.customClaims.role &&
            user.customClaims.role === role
        ) {
            users.push(user);
        }
    });

    return users;
};

export const deleteUser = async (email: string) => {
    const user = await getUser(email);
    let isDeleted = false;
    if (user !== undefined && user !== null) {
        await adminAuth
            .deleteUser(user.uid)
            .then(() => {
                console.log('Successfully deleted user');
                isDeleted = true;
            })
            .catch(error => {
                printErrorTrace(deleteUser, error, false);
            });
    }

    return isDeleted;
};

export const getUserRole = async (email: string) => {
    const user: UserRecord = await getUser(email);
    if (user && user.customClaims && user.customClaims.role) {
        return user.customClaims.role;
    }

    return null;
};

export const setUserRole = async (
    email: string,
    role: string,
): Promise<any> => {
    let isUpdated = false;

    const user: UserRecord = await getUser(email);
    if (user) {
        await adminAuth.setCustomUserClaims(user.uid, { role: role });
        isUpdated = true;
    }

    console.log('Is user role updated? : ' + isUpdated);
    return isUpdated;
};

export const removeUserRole = async (email: string): Promise<any> => {
    let isRemoved = false;

    const user: UserRecord = await getUser(email);
    if (user) {
        await adminAuth.setCustomUserClaims(user.uid, {}); // updating with an empty claim
        isRemoved = true;
    }

    console.log('Is user role removed? : ' + isRemoved);
    return isRemoved;
};

// query func to check if the user exists on the database or not
export const userExists = async (email: string): Promise<Boolean> => {
    const user = await getUser(email);
    if (user) return true;

    return false;
};
