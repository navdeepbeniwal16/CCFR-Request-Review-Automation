import firebase from 'firebase';
import { Notification } from './interfaces';
import { DBCollections } from './utilities/AppEnums';
import { printErrorTrace } from './utilities/errorHandler';
import * as adminUserModule from './admin-users';
import { emailSender } from './emailService';

export const createNotificationForUser = async (
    receiverEmail: string,
    text: string,
    emailRequired: boolean,
) => {
    let isCreated = false;

    try {
        if (
            receiverEmail === undefined ||
            receiverEmail === null ||
            receiverEmail == '' ||
            text === undefined ||
            text === null ||
            text === ''
        ) {
            throw new Error(
                'Illegal Arguments: receiver email or text is undefined, null or empty',
            );
        }

        const isUserExisting = await adminUserModule.userExists(receiverEmail);
        if (!isUserExisting) {
            throw new Error('Illegal Arguments: username doesn not exist');
        }
    } catch (error) {
        printErrorTrace(createNotificationForUser, error, false);
        isCreated = false;
        return isCreated;
    }

    const notification: Notification = {
        receiverEmail: receiverEmail,
        createdDate: new Date(),
        text: text,
        isRead: false,
    };

    await firebase
        .firestore()
        .collection(DBCollections.Notification)
        .doc(notification.receiverEmail)
        .collection(DBCollections.Notifications)
        .doc()
        .set(notification)
        .then(() => {
            console.log('Notification created successfully!');
            isCreated = true;
        })
        .catch(error => {
            printErrorTrace(createNotificationForUser, error, false);
            isCreated = false;
        });

    if(emailRequired) {
        const response = await fetch('http://localhost:3000/api/emailService.ts', {
          });
        console.log('Email notification sent!')
    }

    return isCreated;
};

export const getAllNotificationsForUser = async (
    receiverEmail: string,
    unread?: boolean,
) => {
    const notifications: Notification[] = [];
    try {
        if (
            receiverEmail === undefined ||
            receiverEmail === null ||
            receiverEmail === ''
        ) {
            throw new Error(
                'Illegal Arguments: user email is either undefined, null or empty',
            );
        }

        const isExistingUser = await adminUserModule.userExists(receiverEmail);
        if (!isExistingUser) {
            throw new Error('Illegal Arguments: user doesn not exist');
        }

        let docRef;
        if (unread == undefined || unread === null) {
            docRef = firebase
                .firestore()
                .collection(DBCollections.Notification)
                .doc(receiverEmail)
                .collection(DBCollections.Notifications);
        } else {
            docRef = firebase
                .firestore()
                .collection(DBCollections.Notification)
                .doc(receiverEmail)
                .collection(DBCollections.Notifications)
                .where('isRead', '==', !unread);
        }

        await docRef
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    console.log(doc.id, ' => ', doc.data());
                    const notification = <Notification>doc.data();
                    notification.id = doc.id;
                    notifications.push(notification);
                });
            })
            .catch(error => {
                printErrorTrace(getAllNotificationsForUser, error, false);
            });
    } catch (error) {
        printErrorTrace(createNotificationForUser, error, false);
    }

    return notifications;
};

export const getNotificationForUser = async (
    userEmail: string,
    notificationId: string,
) => {
    try {
        if (userEmail === '' || notificationId === '')
            throw new Error(
                'Illegal Arguments : user email or notification id is empty',
            );

        const isUserExisting = await adminUserModule.userExists(userEmail);
        if (!isUserExisting) {
            throw new Error('Invalid Arguments : user does not exist');
        }
    } catch (error) {
        printErrorTrace(getNotificationForUser, error, false);
        return;
    }

    const docRef = firebase
        .firestore()
        .collection(DBCollections.Notification)
        .doc(userEmail)
        .collection(DBCollections.Notifications)
        .doc(notificationId);

    let fetchedNotification: Notification = <Notification>{};
    await docRef
        .get()
        .then(doc => {
            if (doc.exists) {
                console.log(doc.id, ' => ', doc.data());
                fetchedNotification = <Notification>doc.data();
                fetchedNotification.id = notificationId;
            } else {
                console.log('No notification found');
            }
        })
        .catch(error => {
            printErrorTrace(getNotificationForUser, error, false);
        });

    return fetchedNotification;
};

export const markNotificationReadForUser = async (
    receiverEmail: string,
    notificationId: string,
) => {
    let isMarked = false;
    try {
        if (
            receiverEmail === undefined ||
            receiverEmail === null ||
            receiverEmail === '' ||
            notificationId === undefined ||
            notificationId === null ||
            notificationId === ''
        ) {
            throw new Error(
                'Illegal Arguments : receiver email or notification id is either undefined, null or empty',
            );
        }

        const notification = await getNotificationForUser(
            receiverEmail,
            notificationId,
        );

        // checking if the notification object exists
        if (
            notification === undefined ||
            notification === null ||
            notification.id === undefined ||
            notification.id === null
        ) {
            throw new Error('Illegal Arguments : notification does not exist');
        }

        notification.isRead = true;
        await firebase
            .firestore()
            .collection(DBCollections.Notification)
            .doc(receiverEmail)
            .collection(DBCollections.Notifications)
            .doc(notificationId)
            .set(notification)
            .then(() => {
                console.log('Notification marked read successfully!');
                isMarked = true;
            })
            .catch(error => {
                printErrorTrace(createNotificationForUser, error, false);
            });
    } catch (error) {
        printErrorTrace(markNotificationReadForUser, error, false);
    }

    return isMarked;
};

export const deleteNotificationForUser = async (
    userEmail: string,
    notificationId: string,
) => {
    let isDeleted = false;
    try {
        if (
            userEmail === undefined ||
            userEmail === null ||
            userEmail === '' ||
            notificationId === undefined ||
            notificationId === null ||
            notificationId === ''
        ) {
            throw new Error(
                'Illegal Arguments : userEmail email or notification id is either undefined, null or empty',
            );
        }

        const notification = await getNotificationForUser(
            userEmail,
            notificationId,
        );
        if (
            notification === undefined ||
            notification === null ||
            notification.id === undefined ||
            notification === null
        ) {
            throw new Error('Illegal arguments : notification does not exist');
        }

        await firebase
            .firestore()
            .collection(DBCollections.Notification)
            .doc(userEmail)
            .collection(DBCollections.Notifications)
            .doc(notificationId)
            .delete()
            .then(() => {
                console.log('Notification deleted successfully!');
                isDeleted = true;
            })
            .catch(error => {
                printErrorTrace(createNotificationForUser, error, false);
            });
    } catch (error) {
        printErrorTrace(deleteNotificationForUser, error, false);
    }

    return isDeleted;
};
