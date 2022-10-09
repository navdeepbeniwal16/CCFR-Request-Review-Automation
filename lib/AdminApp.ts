import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

const serviceAccount = require('../ccfr-portal-firebase-adminsdk-pvt-key.json');

export class AdminApp {
    private static appInstance: admin.app.App;
    private constructor() {}

    public static initialize(): admin.app.App {
        if (!getApps().length) {
            AdminApp.appInstance = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: 'https://ccfr-portal-default-rtdb.firebaseio.com',
            });
        }

        return AdminApp.appInstance;
    }
}
