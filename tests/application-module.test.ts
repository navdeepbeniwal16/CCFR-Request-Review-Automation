import { describe, expect, test, beforeAll } from '@jest/globals';
import * as ApplicationModule from '../lib/application';
import firebase from 'firebase/app';
import firestore from 'firebase';
import auth from 'firebase';
import {
    Application,
    BiospecimenForm,
    Clarification,
    Institution,
    ResourceRequest,
} from '../lib/interfaces';
import {
    ApplicationReviewStatus,
    ApplicationStage,
    ApplicationStatus,
    InstitutionAccessType,
} from '../lib/utilities/AppEnums';

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
// let db: FirebaseFirestore.Firestore;
let db: any;

beforeAll(async () => {
    app = firebase.initializeApp(firebaseConfig);
    authorization = auth.auth(app);
    db = firestore.firestore(app);

    const currentUserCredential =
        await authorization.signInWithEmailAndPassword(
            'bob@test.com',
            'password',
        );

    // console.log('App is initalised? : ' + app.name);
    // console.log('Authorization is initalised? : ' + authorization);
    // console.log('User logged in? ' + currentUserCredential.user?.email);
    // console.log('Db is initalised? : ' + db.app);
});

describe('application apis test suite', () => {
    // test('test saveApplicationAsDraft', async () => {
    //     const testApplication = generateDummyApplication();
    //     const result = await ApplicationModule.saveApplicationAsDraft(
    //         testApplication,
    //     );
    //     expect(result).toBe(true);
    // });
    // test('test saveAndSubmitApplication', async () => {
    //     const testApplication = generateDummyApplication();
    //     const result = await ApplicationModule.saveAndSubmitApplication(
    //         testApplication,
    //     );
    //     expect(result).toBe(true);
    // });
    // test('test getApplicationById', async () => {
    //     const result = await ApplicationModule.getApplicationById(
    //         'application-4',
    //     );
    //     console.log('getApplicationById Result ' + result.id);
    //     if (result.isEmpty()) {
    //         console.log('No Application found...!');
    //     }
    //     expect(result);
    // });
    // test('test getApplicationByTitle', async () => {
    //     const result: Application =
    //         await ApplicationModule.getApplicationByTitle('test-title');
    //     console.log('getApplicationById Result ');
    //     if (result.isEmpty()) {
    //         console.log('Result is empty');
    //     } else {
    //         console.log('Result is not empty!!!');
    //         console.log(result.email);
    //     }
    //     expect(result);
    // });
    // test('test getAllSubmittedApplications', async () => {
    //     let result =
    //         await ApplicationModule.getAllSubmittedApplications(db, 5);
    //     let applications = result.applications;
    //     let lastApplication = result.lastApplication;
    //     console.log('Submitted applications : ' + applications.length);

    //     while (lastApplication) {
    //         result = await ApplicationModule.getAllSubmittedApplications(db, 5, lastApplication);
    //         applications = result.applications;
    //         console.log('Submitted applications (subsequent call) : ' + applications.length);
    //         if (result.lastApplication) {
    //             lastApplication = result.lastApplication;
    //         } else {
    //             lastApplication = undefined;
    //         }
    //     }
    //     expect(applications);
    // });
    // test('test getSavedApplicationsByApplicant', async () => {
    //     const result: Application[] =
    //         await ApplicationModule.getSavedApplicationsByApplicant(
    //             'test-email',
    //         );
    //     console.log('Submitted applications : ' + result.length);
    //     expect(result);
    // });
    // test('test getSubmittedApplicationsByApplicant', async () => {
    //     const result: Application[] =
    //         await ApplicationModule.getSubmittedApplicationsByApplicant(
    //             'test-email',
    //         );
    //     console.log('Submitted applications : ' + result.length);
    //     expect(result);
    // });
    // test('test getApplicationsByStatus', async () => {
    //     const result: Application[] =
    //         await ApplicationModule.getApplicationsByStatus(
    //             ApplicationStatus.Rejected,
    //         );
    //     console.log('Rejected applications : ' + result.length);
    //     expect(result);
    // });
    // test('test getApplicationsByStage', async () => {
    //     const result: Application[] =
    //         await ApplicationModule.getApplicationsByStage(
    //             ApplicationStage.BWGReview,
    //         );
    //     console.log('Drafted applications : ' + result.length);
    //     expect(result);
    // });
    // test('test withdrawApplication', async () => {
    //     const result = await ApplicationModule.withdrawApplication('5');
    //     console.log('Drafted applications : ' + result);
    //     expect(result);
    // });
    // test('test updateApplicationStatus', async () => {
    //     const result = await ApplicationModule.updateApplicationStatus(
    //         '5',
    //         ApplicationStatus.Rejected,
    //     );
    //     console.log('Rejected application? : ' + result);
    //     expect(result);
    // });
    // test('test updateApplication', async () => {
    //     const testApplication = generateDummyApplication();
    //     testApplication.title = 'updated-title';
    //     const result = await ApplicationModule.updateApplication(
    //         testApplication,
    //     );
    //     console.log('Updated application? : ' + result);
    //     expect(result);
    // });
    // test('test getExistingCCFRSiteData', async () => {
    //     const result = await ApplicationModule.getExistingCCFRSiteData();
    //     console.log('Site Data Length ? : ' + result.length);
    //     expect(result);
    // });
    // test('test getExistingCCFRBiospecimens', async () => {
    //     const result = await ApplicationModule.getExistingCCFRBiospecimens();
    //     console.log('Biospecimens Data Length ? : ' + result.length);
    //     expect(result);
    // });
    // test('test getExistingCCFRData', async () => {
    //     const result = await ApplicationModule.getExistingCCFRData();
    //     console.log('CCFRData Length ? : ' + result.length);
    //     expect(result);
    // });
    // test('test programManagerReviewApplication', async () => {
    //     const result = await ApplicationModule.programManagerReviewApplication(
    //         '12',
    //         ApplicationReviewStatus.Approved,
    //     );
    //     console.log('Application Approved ? : ' + result);
    //     expect(result);
    // });
    // test('test addBiospecimenFormInformation', async () => {
    //     const biospecimenForm: BiospecimenForm = {};
    //     biospecimenForm.BWGStatusReview = 'Status review string';
    //     biospecimenForm.amountRequired = 3;
    //     biospecimenForm.clarifications = <Clarification>{};
    //     biospecimenForm.clarifications.additionalDispatchRequirement = 'Yes';
    //     biospecimenForm.clarifications.depletedDNASampleRequest =
    //         'Extract at CCFR Site(s)';
    //     const result = await ApplicationModule.addBiospecimenFormInformation(
    //         '12',
    //         biospecimenForm,
    //     );
    //     console.log('Biospeciment infor added ? : ' + result);
    //     expect(result);
    // });
    // TODO: Test steering committee memeber review
    // test('test completedApplicationNotifcation', async () => {
    //     const result = await ApplicationModule.completedApplciationNotification(db, 'bob@test.com');
    //     expect(result);
    // });
});

// Utlity functions to be used while development
const generateDummyApplication = (): Application => {
    const application = <Application>{};
    application.id = '12';
    application.title = 'test-title';
    application.email = 'test-email';

    const institution = <Institution>{};
    institution.investigator = 'inv one';
    institution.jobTitle = 'researcher';
    institution.institution = 'inst abc';
    institution.accessType = InstitutionAccessType.Data;
    institution.department = 'depart1';
    application.institutionPrimary = institution;

    application.biospecimenRequired = [];
    const specimen: ResourceRequest = {
        name: 'resource name',
        type: 'resource type',
        quantity: 3,
        numSamples: 2,
    };
    application.biospecimenRequired.push(specimen);

    return application;
};
