import { Application } from './interfaces';
import firebase from 'firebase';
import {
    ApplicationStage,
    ApplicationStatus,
    DBCollections,
} from './utilities/AppEnums';
import { printErrorTrace } from './utilities/errorHandler';

const initEmptyApplication = () => {
    let application: Application = {} as Application;
    application.isEmpty = (): Boolean => {
        return Object.keys(application).length === 1;
    };

    return application;
};

const createApplication = (
    data: firebase.firestore.DocumentData | Application | undefined,
) => {
    const application: Application = <Application>data;
    application.isEmpty = (): Boolean => {
        return Object.keys(application).length === 1;
    };

    return application;
};

const createApplicationData = (application: Application) => {
    const data: any = {};
    for (const [k, v] of Object.entries(application)) {
        if (k == 'isEmpty') continue;
        data[k] = v;
    }
    return data;
};

export const saveApplicationAsDraft = async (application: Application) => {
    application.stage = ApplicationStage.Draft;

    await firebase
        .firestore()
        .collection(DBCollections.Applications)
        .doc(application.id)
        .set(application)
        .then(() => {
            console.log('Application document successfully written!');
        })
        .catch(error => {
            printErrorTrace(saveApplicationAsDraft, error, false);
            return false;
        });

    return true;
};

export const saveAndSubmitApplication = async (application: Application) => {
    application.stage = ApplicationStage.Submitted;
    application.status = ApplicationStatus.Active;
    await firebase
        .firestore()
        .collection(DBCollections.Applications)
        .doc(application.id)
        .set(application)
        .then(() => {
            console.log('Application document successfully written!');
        })
        .catch(error => {
            printErrorTrace(saveAndSubmitApplication, error, false);
            return false;
        });

    return true;
};

export const getApplicationById = async (applicationId: string) => {
    const docRef = firebase
        .firestore()
        .collection(DBCollections.Applications)
        .doc(applicationId);
    let fetchedApplication: Application = initEmptyApplication();
    await docRef
        .get()
        .then(doc => {
            if (doc.exists) {
                console.log(doc.id, ' => ', doc.data());
                fetchedApplication = createApplication(doc.data());
                return fetchedApplication;
            } else {
                console.log('No application found');
            }
        })
        .catch(error => {
            printErrorTrace(getApplicationById, error, false);
        });

    return fetchedApplication;
};

export const getApplicationByTitle = async (applicationTitle: string) => {
    let fetchedApplications: Application[] = [];

    const docRef = firebase
        .firestore()
        .collection(DBCollections.Applications)
        .where('title', '==', applicationTitle);
    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.id, ' => ', doc.data());
                const application = createApplication(doc.data());
                fetchedApplications.push(application);
            });
        })
        .catch(error => {
            printErrorTrace(getApplicationByTitle, error, false);
        });

    if (fetchedApplications.length > 0) {
        return fetchedApplications[0];
    } else {
        return initEmptyApplication();
    }
};

export const getAllSubmittedApplications = async () => {
    let fetchedApplications: Application[] = [];

    const docRef = firebase
        .firestore()
        .collection(DBCollections.Applications)
        .where('stage', '==', ApplicationStage.Submitted);
    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.id, ' => ', doc.data());
                const application = createApplication(doc.data());
                fetchedApplications.push(application);
            });
        })
        .catch(error => {
            printErrorTrace(getAllSubmittedApplications, error, false);
        });

    return fetchedApplications;
};

export const getSavedApplicationsByApplicant = async (
    applicantEmail: string,
) => {
    let fetchedApplications: Application[] = [];

    const docRef = firebase
        .firestore()
        .collection(DBCollections.Applications)
        .where('email', '==', applicantEmail)
        .where('stage', '==', ApplicationStage.Draft);
    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.id, ' => ', doc.data());
                const application = createApplication(doc.data());
                fetchedApplications.push(application);
            });
        })
        .catch(error => {
            printErrorTrace(getSavedApplicationsByApplicant, error, false);
        });

    return fetchedApplications;
};

export const getSubmittedApplicationsByApplicant = async (
    applicantEmail: string,
) => {
    let fetchedApplications: Application[] = [];

    const docRef = firebase
        .firestore()
        .collection(DBCollections.Applications)
        .where('email', '==', applicantEmail)
        .where('stage', '==', ApplicationStage.Submitted);
    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.id, ' => ', doc.data());
                const application = createApplication(doc.data());
                fetchedApplications.push(application);
            });
        })
        .catch(error => {
            printErrorTrace(getSubmittedApplicationsByApplicant, error, false);
        });

    return fetchedApplications;
};

export const getApplicationsByStatus = async (status: ApplicationStatus) => {
    let fetchedApplications: Application[] = [];

    const docRef = firebase
        .firestore()
        .collection(DBCollections.Applications)
        .where('status', '==', status);
    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.id, ' => ', doc.data());
                const application = createApplication(doc.data());
                fetchedApplications.push(application);
            });
        })
        .catch(error => {
            printErrorTrace(getApplicationsByStatus, error, false);
        });

    return fetchedApplications;
};

export const getApplicationsByStage = async (stage: ApplicationStage) => {
    let fetchedApplications: Application[] = [];

    const docRef = firebase
        .firestore()
        .collection(DBCollections.Applications)
        .where('stage', '==', stage);
    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.id, ' => ', doc.data());
                const application = createApplication(doc.data());
                fetchedApplications.push(application);
            });
        })
        .catch(error => {
            printErrorTrace(getApplicationsByStage, error, false);
        });

    return fetchedApplications;
};

// TODO:
export const withdrawApplication = async (applicationId: string) => {
    let application: Application = await getApplicationById(applicationId);
    let isWithdrawn = false;
    if (!application.isEmpty()) {
        application.stage = ApplicationStage.Draft; // TODO: Check with Saood, it probably should be apart of the status rather than Stage
        const data = createApplicationData(application);
        await firebase
            .firestore()
            .collection(DBCollections.Applications)
            .doc(application.id)
            .set(data)
            .then(() => {
                console.log('Application withdrawn successfully!');
                isWithdrawn = true;
            })
            .catch(error => {
                printErrorTrace(withdrawApplication, error, false);
                isWithdrawn = false;
            });
    }

    return isWithdrawn;
};

export const updateApplicationStatus = async (
    applicationId: string,
    status: ApplicationStatus,
) => {
    let application = await getApplicationById(applicationId);
    let isStatusChanged = false;
    if (!application.isEmpty()) {
        application.status = status;
        const applicationData = createApplicationData(application);
        await firebase
            .firestore()
            .collection(DBCollections.Applications)
            .doc(application.id)
            .set(applicationData)
            .then(() => {
                console.log('Application withdrawn successfully!');
                isStatusChanged = true;
            })
            .catch(error => {
                printErrorTrace(updateApplicationStatus, error, false);
                isStatusChanged = false;
            });
    }

    return isStatusChanged;
};

export const updateApplication = async (application: Application) => {
    let isStatusChanged = false;
    application = createApplication(application);
    if (application.isEmpty() && application.id) {
        let foundApplication = await getApplicationById(application.id);

        if (!foundApplication.isEmpty()) {
            const applicationData = createApplicationData(application);
            await firebase
                .firestore()
                .collection(DBCollections.Applications)
                .doc(application.id)
                .set(applicationData)
                .then(() => {
                    console.log('Application updated successfully!');
                    isStatusChanged = true;
                })
                .catch(error => {
                    printErrorTrace(updateApplication, error, false);
                    isStatusChanged = false;
                });
        }
    }

    return isStatusChanged;
};
