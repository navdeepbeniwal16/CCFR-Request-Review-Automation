import { init } from 'next-firebase-auth';

const initAuth = () => {
    init({
        authPageURL: '/login',
        appPageURL: '/',
        loginAPIEndpoint: '/api/login',
        logoutAPIEndpoint: '/api/logout',
        onLoginRequestError: err => {
            console.error(err);
        },
        onLogoutRequestError: err => {
            console.error(err);
        },
        firebaseAdminInitConfig: {
            credential: {
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY,
            },
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        },
        // Use application default credentials (takes precedence over firebaseAdminInitConfig if set)
        // useFirebaseAdminDefaultCredential: true,
        firebaseClientInitConfig: {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY, // required
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        },
        cookies: {
            name: 'CCFR_Portal',
            keys: [
                process.env.COOKIE_SECRET_CURRENT,
                process.env.COOKIE_SECRET_PREVIOUS,
            ],
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 24 * 1000, // two days
            overwrite: true,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NEXT_PUBLIC_COOKIE_SECURE, // set this to false in local (non-HTTPS) development
            signed: true,
        },
        onVerifyTokenError: err => {
            console.error(err);
        },
        onTokenRefreshError: err => {
            console.error(err);
        },
    });
};

export default initAuth;
