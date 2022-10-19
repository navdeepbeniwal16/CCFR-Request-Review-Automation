import {
    Application,
    SteeringCommitteeUIDs,
    ExistingCCFRData,
    ExistingCCFRBiospecimens,
    ExistingCCFRSiteData,
    Review,
    BiospecimenForm,
} from './interfaces';
import {
    ApplicationStage,
    ApplicationStatus,
    DBCollections,
    ApplicationReviewStatus,
    UserRole,
} from './utilities/AppEnums';
import * as userModule from './user';
import { printErrorTrace } from './utilities/errorHandler';

export const isApplicationEmpty = (application: Application) => {
    return Object.keys(application).length === 0;
};

export const saveApplicationAsDraft = async (
    db: FirebaseFirestore.Firestore,
    application: Application,
) => {
    let isSaved = false;

    try {
        if (isApplicationEmpty(application)) {
            throw new Error('Illegal Arguments : Application object is empty');
        }
    } catch (error) {
        //printErrorTrace(saveAndSubmitApplication, error, false);
        return isSaved;
    }

    application.stage = ApplicationStage.Draft;

    await db
        .collection(DBCollections.Applications)
        .doc(application.id)
        .set(application)
        .then(() => {
            console.log('Application document successfully written!');
            isSaved = true;
        })
        .catch(error => {
            printErrorTrace(saveApplicationAsDraft, error, false);
            return false;
        });

    return isSaved;
};

export const saveAndSubmitApplication = async (
    db: FirebaseFirestore.Firestore,
    application: Application,
) => {
    application.stage = ApplicationStage.PMReview;
    application.status = ApplicationStatus.Active;
    application.programManagerReview = <Review>{};
    const progMgr = await userModule.getUsersByRoleAsAdmin(
        UserRole.PROGRAM_MANAGER,
    );
    if (progMgr.length < 1) {
        throw new Error('Program manager not found');
    }
    const programManager = progMgr[0];
    application.programManagerReview.name = programManager.displayName!;
    application.programManagerReview.status = ApplicationReviewStatus.In_Review;

    await db
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

export const getApplicationById = async (
    db: FirebaseFirestore.Firestore,
    applicationId: string,
) => {
    let fetchedApplication: Application = <Application>{};

    const docRef = db.collection(DBCollections.Applications).doc(applicationId);
    await docRef
        .get()
        .then(doc => {
            if (doc.exists) {
                fetchedApplication = <Application>doc.data();
                fetchedApplication.id = applicationId;
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

export const getApplicationByTitle = async (
    db: FirebaseFirestore.Firestore,
    applicationTitle: string,
) => {
    let fetchedApplications: Application[] = [];

    const docRef = db
        .collection(DBCollections.Applications)
        .where('title', '==', applicationTitle);
    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const application = <Application>doc.data();
                application.id = doc.id;
                fetchedApplications.push(application);
            });
        })
        .catch(error => {
            printErrorTrace(getApplicationByTitle, error, false);
        });

    if (fetchedApplications.length > 0) {
        return fetchedApplications[0];
    } else {
        return <Application>{};
        // return;
    }
};

export const getAllSubmittedApplications = async (
    db: FirebaseFirestore.Firestore,
    limit: number,
    last?: FirebaseFirestore.QueryDocumentSnapshot
) => {
    let fetchedApplications: Application[] = [];

    let docRef;
    if (last) {
        docRef = db
            .collection(DBCollections.Applications)
            .where('stage', '!=', ApplicationStage.Draft)
            .startAfter(last)
            .limit(limit);

    } else {
        docRef = db
            .collection(DBCollections.Applications)
            .where('stage', '!=', ApplicationStage.Draft)
            .limit(limit);
    }

    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const application = <Application>doc.data();
                application.id = doc.id;
                fetchedApplications.push(application);
            });

            last = querySnapshot.docs[querySnapshot.docs.length - 1];
        })
        .catch(error => {
            printErrorTrace(getAllSubmittedApplications, error, false);
        });

    return {
        applications: fetchedApplications,
        lastApplication: last! ? last : undefined
    }
};

export const getSavedApplicationsByApplicant = async (
    db: FirebaseFirestore.Firestore,
    applicantEmail: string,
    limit: number,
    last?: FirebaseFirestore.QueryDocumentSnapshot
) => {
    let fetchedApplications: Application[] = [];

    let docRef;
    if (last) {
        docRef = db
            .collection(DBCollections.Applications)
            .where('email', '==', applicantEmail)
            .where('stage', '==', ApplicationStage.Draft)
            .startAfter(last)
            .limit(limit);
    } else {
        docRef = db
            .collection(DBCollections.Applications)
            .where('email', '==', applicantEmail)
            .where('stage', '==', ApplicationStage.Draft)
            .limit(limit);
    }
    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const application = <Application>doc.data();
                application.id = doc.id;
                fetchedApplications.push(application);
            });

            last = querySnapshot.docs[querySnapshot.docs.length - 1];
        })
        .catch(error => {
            printErrorTrace(getSavedApplicationsByApplicant, error, false);
        });

    return {
        applications: fetchedApplications,
        lastApplication: last! ? last : undefined
    }
};

export const getSubmittedApplicationsByApplicant = async (
    db: FirebaseFirestore.Firestore,
    applicantEmail: string,
    limit: number,
    last?: FirebaseFirestore.QueryDocumentSnapshot
) => {
    let fetchedApplications: Application[] = [];

    let docRef;
    if (last) {
        docRef = db
            .collection(DBCollections.Applications)
            .where('email', '==', applicantEmail)
            .where('stage', '==', ApplicationStage.Submitted)
            .startAfter(last)
            .limit(limit);
    } else {
        docRef = db
            .collection(DBCollections.Applications)
            .where('email', '==', applicantEmail)
            .where('stage', '==', ApplicationStage.Submitted)
            .limit(limit);
    }

    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const application = <Application>doc.data();
                application.id = doc.id;
                fetchedApplications.push(application);
            });

            last = querySnapshot.docs[querySnapshot.docs.length - 1];
        })
        .catch(error => {
            printErrorTrace(getSubmittedApplicationsByApplicant, error, false);
        });

    return {
        applications: fetchedApplications,
        lastApplication: last! ? last : undefined
    }
};

export const getApplicationsByStatus = async (
    db: FirebaseFirestore.Firestore,
    status: ApplicationStatus,
    limit: number,
    last?: FirebaseFirestore.QueryDocumentSnapshot
) => {
    let fetchedApplications: Application[] = [];

    let docRef;
    if (last) {
        docRef = db
            .collection(DBCollections.Applications)
            .where('status', '==', status)
            .startAfter(last)
            .limit(limit);
    } else {
        docRef = db
            .collection(DBCollections.Applications)
            .where('status', '==', status)
            .limit(limit);
    }

    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const application = <Application>doc.data();
                application.id = doc.id;
                fetchedApplications.push(application);
            });

            last = querySnapshot.docs[querySnapshot.docs.length - 1];
        })
        .catch(error => {
            printErrorTrace(getApplicationsByStatus, error, false);
        });

    return {
        applications: fetchedApplications,
        lastApplication: last! ? last : undefined
    }
};

export const getApplicationsByStage = async (
    db: FirebaseFirestore.Firestore,
    stage: ApplicationStage,
    limit: number,
    last?: FirebaseFirestore.QueryDocumentSnapshot
) => {
    let fetchedApplications: Application[] = [];

    let docRef;
    if (last) {
        docRef = db
            .collection(DBCollections.Applications)
            .where('stage', '==', stage)
            .startAfter(last)
            .limit(limit);
    } else {
        docRef = db
            .collection(DBCollections.Applications)
            .where('stage', '==', stage)
            .limit(limit);
    }

    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const application = <Application>doc.data();
                application.id = doc.id;
                fetchedApplications.push(application);
            });

            last = querySnapshot.docs[querySnapshot.docs.length - 1];
        })
        .catch(error => {
            printErrorTrace(getApplicationsByStage, error, false);
        });

    return {
        applications: fetchedApplications,
        lastApplication: last! ? last : undefined
    }
};

export const withdrawApplication = async (
    db: FirebaseFirestore.Firestore,
    applicationId: string,
) => {
    let application: Application = await getApplicationById(db, applicationId);
    let isWithdrawn = false;
    if (!isApplicationEmpty(application)) {
        application.stage = ApplicationStage.Draft; // TODO: Check with Saood, it probably should be apart of the status rather than Stage
        // const data = application;
        await db
            .collection(DBCollections.Applications)
            .doc(application.id)
            .set(application)
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
    db: FirebaseFirestore.Firestore,
    applicationId: string,
    status: ApplicationStatus,
) => {
    let application = await getApplicationById(db, applicationId);
    let isStatusChanged = false;
    if (!isApplicationEmpty(application)) {
        application.status = status;
        // const applicationData = createApplicationData(application);
        await db
            .collection(DBCollections.Applications)
            .doc(application.id)
            .set(application)
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

export const updateApplication = async (
    db: FirebaseFirestore.Firestore,
    application: Application,
) => {
    let isStatusChanged = false;
    // application = <Application>application;
    if (!isApplicationEmpty(application) && application.id) {
        let foundApplication = await getApplicationById(db, application.id);

        if (!isApplicationEmpty(foundApplication)) {
            // const applicationData = createApplicationData(application);
            await db
                .collection(DBCollections.Applications)
                .doc(application.id)
                .set(application)
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

export const getAllSteeringCommitteeMembers = async (
    db: FirebaseFirestore.Firestore,
) => {
    let fetchedSCMembers: SteeringCommitteeUIDs[] = [];

    const docRef = db.collection('SteeringCommitteeUIDs');
    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                fetchedSCMembers.push(<SteeringCommitteeUIDs>doc.data());
            });
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });

    return fetchedSCMembers;
};

export const getExistingCCFRSiteData = async (
    db: FirebaseFirestore.Firestore,
) => {
    let fetchedSCMembers: ExistingCCFRSiteData[] = [];

    const docRef = db.collection(DBCollections.ExistingCCFRSiteData);
    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                fetchedSCMembers.push(<ExistingCCFRSiteData>doc.data());
            });
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });

    return fetchedSCMembers;
};

export const getExistingCCFRBiospecimens = async (
    db: FirebaseFirestore.Firestore,
) => {
    let fetchedSCMembers: ExistingCCFRBiospecimens[] = [];

    const docRef = db.collection(DBCollections.ExistingCCFRBiospecimens);
    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                fetchedSCMembers.push(<ExistingCCFRBiospecimens>doc.data());
            });
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });

    return fetchedSCMembers;
};

export const getExistingCCFRData = async (db: FirebaseFirestore.Firestore) => {
    let fetchedSCMembers: ExistingCCFRData[] = [];

    const docRef = db.collection(DBCollections.ExistingCCFRData);
    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                fetchedSCMembers.push(<ExistingCCFRData>doc.data());
            });
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });

    return fetchedSCMembers;
};

export const programManagerReviewApplication = async (
    db: FirebaseFirestore.Firestore,
    applicationId: string,
    status: ApplicationReviewStatus,
) => {
    let application = await getApplicationById(db, applicationId);
    let isStatusChanged = false;

    try {
        if (!isApplicationEmpty(application)) {
            if (status == ApplicationReviewStatus.Approved) {
                application.programManagerReview = <Review>{};
                application.programManagerReview.status =
                    ApplicationReviewStatus.Approved;
                if (application.biospecimenRequired) {
                    application.stage = ApplicationStage.BWGReview;
                    const bwgChairs = await userModule.getUsersByRoleAsAdmin(
                        UserRole.BGW_CHAIR,
                    );
                    if (bwgChairs.length < 1) {
                        throw new Error('Data Error: Bwg chair not found');
                    }
                    const bwgChair = bwgChairs[0];
                    if (
                        bwgChair.displayName === undefined ||
                        bwgChair.displayName === null ||
                        bwgChair.displayName === ''
                    ) {
                        throw new Error(
                            'Data Error: Bwg chair display name is either undefined, null or empty',
                        );
                    }

                    application.BWGChairReview = <Review>{};
                    application.BWGChairReview!.name = bwgChair.displayName!;
                    application.BWGChairReview.status =
                        ApplicationReviewStatus.In_Review;
                } else {
                    isStatusChanged =
                        await instantiateSteeringCommitteeReviewProcess(
                            db,
                            application,
                        );
                    return isStatusChanged;
                }
                await db
                    .collection(DBCollections.Applications)
                    .doc(application.id)
                    .set(application)
                    .then(() => {
                        console.log('Application approved successfully!');
                        isStatusChanged = true;
                    })
                    .catch(error => {
                        console.error(
                            'Error writing approving application: ',
                            error,
                        );
                        isStatusChanged = false;
                    });
            } else if (status == ApplicationReviewStatus.Rejected) {
                application.stage = ApplicationStage.PMReview; // @Saood - Is is required, isn't this already flagged when a user submit the application?
                application.programManagerReview!.status =
                    ApplicationReviewStatus.Rejected;
                await db
                    .collection(DBCollections.Applications)
                    .doc(application.id)
                    .set(application)
                    .then(() => {
                        console.log('Application rejected successfully!');
                        isStatusChanged = true;
                    })
                    .catch(error => {
                        printErrorTrace(
                            programManagerReviewApplication,
                            error,
                            false,
                        );
                        isStatusChanged = false;
                    });
            }
        }
    } catch (error) {
        printErrorTrace(programManagerReviewApplication, error, false);
    }

    return isStatusChanged;
};

export const addBiospecimenFormInformation = async (
    db: FirebaseFirestore.Firestore,
    applicationId: string,
    biospecimenForm: BiospecimenForm,
) => {
    let application = await getApplicationById(db, applicationId);
    let isStatusChanged = false;
    if (!isApplicationEmpty(application)) {
        application.BWGChairReview!.status = ApplicationReviewStatus.Approved;
        application.biospecimenForm = biospecimenForm;
        isStatusChanged = await instantiateSteeringCommitteeReviewProcess(
            db,
            application,
        );
    }
    return isStatusChanged;
};

export const instantiateSteeringCommitteeReviewProcess = async (
    db: FirebaseFirestore.Firestore,
    application: Application,
) => {
    // application = <Application>application;
    application.stage = ApplicationStage.SCReview;
    let isStatusChanged = false;
    let scReviewers = await getAllSteeringCommitteeMembers(db);
    application.steeringCommitteeReview = {};
    application.steeringCommitteeReview.reviewStartDate = new Date();
    application.steeringCommitteeReview.numberOfReviewersAccepted = 0;
    application.steeringCommitteeReview.reviewers = [];
    application.steeringCommitteeReview.totalReviewers = scReviewers.length;
    for (let i = 0; i < scReviewers.length; i++) {
        let scReviewerObj = <Review>{};
        scReviewerObj.name = scReviewers[i].name;
        scReviewerObj.status = ApplicationReviewStatus.In_Review;
        application.steeringCommitteeReview.reviewers.push(scReviewerObj);
    }
    await db
        .collection(DBCollections.Applications)
        .doc(application.id)
        .set(application)
        .then(() => {
            console.log('Application updated successfully!');
            isStatusChanged = true;
        })
        .catch(error => {
            printErrorTrace(
                instantiateSteeringCommitteeReviewProcess,
                error,
                false,
            );
            isStatusChanged = false;
        });
    return isStatusChanged;
};

export const steeringCommitteeReviewApplication = async (
    db: FirebaseFirestore.Firestore,
    applicationId: string,
    status: ApplicationReviewStatus,
    steeringCommitteeMemberName: string,
) => {
    let application = await getApplicationById(db, applicationId);
    let isStatusChanged = false;
    if (!isApplicationEmpty(application)) {
        for (
            let i = 0;
            i < application.steeringCommitteeReview!.reviewers!.length;
            i++
        ) {
            if (
                application.steeringCommitteeReview!.reviewers![i].name ==
                steeringCommitteeMemberName
            ) {
                application.steeringCommitteeReview!.reviewers![i].status =
                    status;
            }
        }
        await db
            .collection(DBCollections.Applications)
            .doc(application.id)
            .set(application)
            .then(() => {
                console.log('Application reviewed successfully!');
                isStatusChanged = true;
            })
            .catch(error => {
                console.error('Error writing reviewing application: ', error);
                isStatusChanged = false;
            });
    }
    return isStatusChanged;
};


export const completedApplciationNotification = async (
    db: FirebaseFirestore.Firestore
) => {
    let fetchedApplications: Application[] = [];

    let docRef;
    docRef = db
        .collection(DBCollections.Applications)
        .where('stage', '==', ApplicationStage.SCReview)


    await docRef
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const application = <Application>doc.data();
                application.id = doc.id;
                fetchedApplications.push(application);
            });
        })
        .catch(error => {
            printErrorTrace(getAllSubmittedApplications, error, false);
        });
    let listOfReviewedApplciations = fetchedApplications.map(element => {
        if (element!.steeringCommitteeReview!.reviewStartDate! <= new Date(Date.now() - 1209600000)) // The number 1209600000 is the number of milliseconds in 2 weeks. It is used to check reviews started over 2 weeks ago
            return element.id;
    });
    return listOfReviewedApplciations;
};


