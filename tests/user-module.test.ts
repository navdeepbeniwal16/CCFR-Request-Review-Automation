import { describe, expect, test, beforeAll } from '@jest/globals';
import firebase from 'firebase/app'
import firestore from 'firebase';
import auth from 'firebase';
import * as userModule from '../lib/user';
import { Application, Institution, UserProfile } from '../lib/interfaces';
import { ApplicationStage, ApplicationStatus, InstitutionAccessType } from '../lib/utilities/AppEnums';

const firebaseConfig = {
    apiKey: "AIzaSyDw7VuWi3aB_SC3vAL7n4yh2o1TAMqLXEw",
    authDomain: "ccfr-portal.firebaseapp.com",
    databaseURL: "https://ccfr-portal-default-rtdb.firebaseio.com",
    projectId: "ccfr-portal",
    storageBucket: "ccfr-portal.appspot.com",
    messagingSenderId: "986450998335",
    appId: "1:986450998335:web:056d0380ce67be4784748a"
  };

let app: firebase.app.App;
let authorization: auth.auth.Auth;
let db: firestore.firestore.Firestore;

beforeAll(async  () => {
    app = firebase.initializeApp(firebaseConfig);
    authorization = auth.auth(app);
    db = firestore.firestore(app);

    const currentUserCredential = await userModule.loginUser('test-user-1@123.com', 'strongPass');

    // console.log('App is initalised? : ' + app.name);
    // console.log('Authorization is initalised? : ' + authorization);
    // console.log('User logged in? ' + currentUserCredential.user?.email);
    // console.log('Db is initalised? : ' + db.app);
});

describe('User Module Test Suite', () => {
    // test('test getUser() : ', async () => {
    //     const result = await userModule.getCurrentUser();
    //     console.log('Current User : ' + result?.email);
    //     expect(result)
    // });

    // test('test registerUser() : ', async () => {
    //     const result = await userModule.registerUser('test-user-1@123.com','strongPass');
    //     console.log('Registered User : ' + result);
    //     expect(result)
    // });

    // test('test updateUserProfile() : ', async () => {
    //     const userProfile:UserProfile = {
    //         displayName: 'Bob The Builder'
    //     };
    //     const result = await userModule.updateUserProfile(userProfile)
    //     console.log('Updated User ? : ' + result);
    //     expect(result)
    // });

    test('test deleteUser() : ', async () => {
        const result = await userModule.deleteUser()
        console.log('Updated Deleted ? : ' + result);
        expect(result)
    });
});
