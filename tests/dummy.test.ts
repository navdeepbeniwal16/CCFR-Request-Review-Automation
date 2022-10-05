import { describe, expect, test, beforeAll } from '@jest/globals';
import * as ApplicationModule from '../lib/application';
import firebase from 'firebase/app'
import firestore from 'firebase';
import auth from 'firebase';
import { Application, Institution } from '../lib/interfaces';
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

beforeAll(() => {
    app = firebase.initializeApp(firebaseConfig);
    authorization = auth.auth(app);
    db = firestore.firestore(app);

    console.log('App is initalised? : ' + app.name);
    console.log('Authorization is initalised? : ' + authorization.currentUser);
    console.log('Db is initalised? : ' + db.app);
});

describe('dummy test suite', () => {
    // test('test saveApplicationAsDraft', async () => {
    //     const testApplication = generateDummyApplication();
    //     const result = await saveApplicationAsDraft(testApplication, authorization, db);
    //     expect(result).toBe(true);
    // });

    // test('test saveAndSubmitApplication', async () => {
    //     const testApplication = generateDummyApplication();
    //     const result = await saveAndSubmitApplication(testApplication, authorization, db);
    //     expect(result).toBe(true);
    // });

    // test('test getApplicationById', async () => {
    //     const result = await getApplicationById('5', authorization, db);
    //     console.log('getApplicationById Result ' + result);
    //     expect(result);
    // });

    // test('test getApplicationByTitle', async () => {
    //     const result:Application = await getApplicationByTitle('test-title', authorization, db);
    //     // console.log('getApplicationById Result ' + result !== undefined ? result.email : 'Result is undefined');
    //     console.log('getApplicationById Result ');
    //     if(result === undefined) {
    //         console.log('Result is undefined');
    //     } else {
    //         console.log('Result is defined!!!');
    //         console.log(result.email);
    //     }
    //     expect(result);
    // });

    // test('test getAllSubmittedApplications', async () => {
    //     const result:Application[] = await getAllSubmittedApplications(authorization, db);
    //     console.log('Submitted applications : ' + result.length);
    //     expect(result);
    // });

    // test('test getSavedApplicationsByApplicant', async () => {
    //     const result:Application[] = await getSavedApplicationsByApplicant('test-email',authorization, db);
    //     console.log('Submitted applications : ' + result.length);
    //     expect(result);
    // });

    // test('test getSubmittedApplicationsByApplicant', async () => {
    //     const result:Application[] = await getSubmittedApplicationsByApplicant('test-email',authorization, db);
    //     console.log('Submitted applications : ' + result.length);
    //     expect(result);
    // });

    // test('test getApplicationsByStatus', async () => {
    //     const result:Application[] = await getApplicationsByStatus(ApplicationStatus.ACTIVE, authorization, db);
    //     console.log('Active applications : ' + result.length);
    //     expect(result);
    // });

    // test('test getApplicationsByStage', async () => {
    //     const result:Application[] = await ApplicationModule.getApplicationsByStage(ApplicationStage.Draft, authorization, db);
    //     console.log('Drafted applications : ' + result.length);
    //     expect(result);
    // });

    // test('test withdrawApplication', async () => {
    //     const result = await ApplicationModule.withdrawApplication('5', authorization, db);
    //     console.log('Drafted applications : ' + result);
    //     expect(result);
    // });

    // test('test updateApplicationStatus', async () => {
    //     const result = await ApplicationModule.updateApplicationStatus('5', ApplicationStatus.Rejected, authorization, db);
    //     console.log('Rejected application? : ' + result);
    //     expect(result);
    // });

    // test('test updateApplication', async () => {
    //     const testApplication = generateDummyApplication();
    //     testApplication.title = 'updated-title';
    //     const result = await ApplicationModule.updateApplication(testApplication, authorization, db);
    //     console.log('Updated application? : ' + result);
    //     expect(result);
    // });
});

// Utlity functions to be used while development
const generateDummyApplication = (): Application => {
    const application = <Application>{};
    application.id = '9';
    application.title = 'test-title';
    application.email = 'test-email';
    
    const institution = <Institution>{}
    institution.investigator = "inv one";
    institution.jobTitle = "researcher";
    institution.institution = "inst abc";
    institution.accessType = InstitutionAccessType.Data;
    institution.department = "depart1"
    application.institutionPrimary = institution;
    return application;
  }
