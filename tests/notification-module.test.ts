import { describe, expect, test, beforeAll } from '@jest/globals';
import firebase from 'firebase/app';
import firestore from 'firebase';
import auth from 'firebase';
import * as userModule from '../lib/user';
import * as notificationModule from '../lib/notification';

const firebaseConfig = {
    apiKey: 'AIzaSyDw7VuWi3aB_SC3vAL7n4yh2o1TAMqLXEw',
    authDomain: 'ccfr-portal.firebaseapp.com',
    databaseURL: 'https://ccfr-portal-default-rtdb.firebaseio.com',
    projectId: 'ccfr-portal',
    storageBucket: 'ccfr-portal.appspot.com',
    messagingSenderId: '986450998335',
    appId: '1:986450998335:web:056d0380ce67be4784748a',
};

let app: firebase.app.App;
let authorization: auth.auth.Auth;
let db: firestore.firestore.Firestore;

beforeAll(async () => {
    app = firebase.initializeApp(firebaseConfig);
    authorization = auth.auth(app);
    db = firestore.firestore(app);

    const currentUserCredential = await userModule.loginUser(
        'bwg-test-user@123.com',
        'strongPass',
    );

    // console.log('App is initalised? : ' + app.name);
    // console.log('Authorization is initalised? : ' + authorization);
    // console.log('User logged in? ' + currentUserCredential.user?.email);
    // console.log('Db is initalised? : ' + db.app);
});

describe('Notification Module Test Suite', () => {
    test('test createNotificationForUser() : ', async () => {

        const result = await notificationModule.createNotificationForUser(
            'bob@test.com',
            'A third notification test',
            true,
            'ApplicationVerdicts'
        );
        console.log('Is Notification Created ? : ' + result);
        expect(result).toBeTruthy();
    });
    // test('test getAllNotificationsForUser() : ', async () => {
    //     const result = await notificationModule.getAllNotificationsForUser(
    //         'bob@test.com',
    //         true,
    //     );
    //     console.log('Number of notifications fetched ? : ' + result.length);
    //     result.forEach(notification => {
    //         console.log(notification.id);
    //     });
    //     expect(result);
    // });
    // test('test markNotificationReadForUser() : ', async () => {
    //     const result = await notificationModule.markNotificationReadForUser(
    //         'bob@test.com',
    //         'JO94HQiHmAY1nvEvD108',
    //     );
    //     console.log('Notification updated ? : ' + result);
    //     expect(result).toBeTruthy();
    // });
    // test('test deleteNotificationForUser() : ', async () => {
    //     const result = await notificationModule.deleteNotificationForUser(
    //         'bob@test.com',
    //         'JO94HQiHmAY1nvEvD108',
    //     );
    //     console.log('Notification deleted ? : ' + result);
    //     expect(result).toBeTruthy();
    // });
    // test('test getNotification() : ', async () => {
    //     const result = await notificationModule.getNotificationForUser(
    //         'bob@test.com',
    //         'JO94HQiHmAY1nvEvD108',
    //     );
    //     console.log('Fetched notification id ? : ' + result?.id);
    //     console.log('Fetched notification isRead status ? : ' + result?.isRead);
    //     expect(result);
    // });
});
