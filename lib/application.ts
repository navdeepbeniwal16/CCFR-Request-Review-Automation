import { Application, SteeringCommitteeUIDs, ExistingCCFRData, ExistingCCFRBiospecimens, ExistingCCFRSiteData, Review, BiospecimenForm } from "./interfaces"
import { ApplicationStage, ApplicationStatus, DBCollections, ApplicationReviewStatus, UserRole } from "./utilities/AppEnums";
import { printErrorTrace } from './utilities/errorHandler';
import * as adminUserModule from '../lib/admin-users'


const initEmptyApplication = () => {
    let application: Application = {} as Application;
    application.isEmpty = (): Boolean => {
        return Object.keys(application).length === 1;
    };

    return application;
};

const createApplication = (
    data: FirebaseFirestore.DocumentData | Application | undefined,
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

export const saveApplicationAsDraft = async (db: FirebaseFirestore.Firestore, application: Application) => {
    application.stage = ApplicationStage.Draft;

    await db
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

export const saveAndSubmitApplication = async (db: FirebaseFirestore.Firestore, application: Application) => {
    application.stage = ApplicationStage.PMReview;
    application.status = ApplicationStatus.Active;
    application.programManagerReview = <Review>{};
    const progMgr = await adminUserModule.getUsersByRole(UserRole.PROGRAM_MANAGER);
    if (progMgr.length < 1) {
        throw new Error("Bwg chair not found");
    }
    const programManager = progMgr[0];
    application.programManagerReview!.name = programManager.displayName!; // replace with name form admin sdk api
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

export const getApplicationById = async (db: FirebaseFirestore.Firestore, applicationId: string) => {
    const docRef = db
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

export const getApplicationByTitle = async (db: FirebaseFirestore.Firestore, applicationTitle: string) => {
    let fetchedApplications: Application[] = [];

    const docRef = db
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

export const getAllSubmittedApplications = async (db: FirebaseFirestore.Firestore) => {
    let fetchedApplications: Application[] = [];

    const docRef = db
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
    db: FirebaseFirestore.Firestore, 
    applicantEmail: string,
) => {
    let fetchedApplications: Application[] = [];

    const docRef = db
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
    db: FirebaseFirestore.Firestore, 
    applicantEmail: string
) => {
    let fetchedApplications: Application[] = [];

    const docRef = db
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

export const getApplicationsByStatus = async (db: FirebaseFirestore.Firestore, status: ApplicationStatus) => {
    let fetchedApplications: Application[] = [];

    const docRef = db
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

export const getApplicationsByStage = async (db: FirebaseFirestore.Firestore, stage: ApplicationStage) => {
    let fetchedApplications: Application[] = [];

    const docRef = db
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

export const withdrawApplication = async (db: FirebaseFirestore.Firestore, applicationId: string) => {
    let application: Application = await getApplicationById(db, applicationId);
    let isWithdrawn = false;
    if (!application.isEmpty()) {
        application.stage = ApplicationStage.Draft; // TODO: Check with Saood, it probably should be apart of the status rather than Stage
        const data = createApplicationData(application);
        await db
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
    db: FirebaseFirestore.Firestore, 
    applicationId: string,
    status: ApplicationStatus,
) => {
    let application = await getApplicationById(db, applicationId);
    let isStatusChanged = false;
    if (!application.isEmpty()) {
        application.status = status;
        const applicationData = createApplicationData(application);
        await db
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

export const updateApplication = async (db: FirebaseFirestore.Firestore, application: Application) => {
    let isStatusChanged = false;
    application = createApplication(application);
    if (application.isEmpty() && application.id) {
        let foundApplication = await getApplicationById(db, application.id);

        if (!foundApplication.isEmpty()) {
            const applicationData = createApplicationData(application);
            await db
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
}

export const getAllSteeringCommitteeMembers = async (db: FirebaseFirestore.Firestore) => {
    let fetchedSCMembers: SteeringCommitteeUIDs[] = [];

    const docRef = db.collection("SteeringCommitteeUIDs");
    await docRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                fetchedSCMembers.push(<SteeringCommitteeUIDs>doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

    return fetchedSCMembers;
}

export const getExistingCCFRSiteData = async (db: FirebaseFirestore.Firestore) => {
    let fetchedSCMembers: ExistingCCFRSiteData[] = [];

    const docRef = db.collection("ExistingCCFRSiteData");
    await docRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                fetchedSCMembers.push(<ExistingCCFRSiteData>doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

    return fetchedSCMembers;
}

export const getExistingCCFRBiospecimens = async (db: FirebaseFirestore.Firestore) => {
    let fetchedSCMembers: ExistingCCFRBiospecimens[] = [];

    const docRef = db.collection("ExistingCCFRBiospecimens");
    await docRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                fetchedSCMembers.push(<ExistingCCFRBiospecimens>doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

    return fetchedSCMembers;
}

export const getExistingCCFRData = async (db: FirebaseFirestore.Firestore) => {
    let fetchedSCMembers: ExistingCCFRData[] = [];

    const docRef = db.collection("ExistingCCFRData");
    await docRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                fetchedSCMembers.push(<ExistingCCFRData>doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

    return fetchedSCMembers;
}

export const programManagerReviewApplication = async (db: FirebaseFirestore.Firestore, applicationId: string, status: ApplicationReviewStatus) => {
    let application = await getApplicationById(db, applicationId);
    let isStatusChanged = false;
    if (!application.isEmpty()) {
        if (status == ApplicationReviewStatus.Approved) {
            application.programManagerReview!.status = ApplicationReviewStatus.Approved;
            if (application.biospecimenRequired) {
                application.stage = ApplicationStage.BWGReview;
                const bwgChairs = await adminUserModule.getUsersByRole(UserRole.BGW_CHAIR);
                if (bwgChairs.length < 1) {
                    throw new Error("Bwg chair not found");
                }
                const bwgChair = bwgChairs[0];
                application.BWGChairReview = <Review>{};
                application.BWGChairReview!.name = bwgChair.displayName!;
                application.BWGChairReview.status = ApplicationReviewStatus.In_Review;
            }
            else {
                isStatusChanged = await instantiateSteeringCommitteeReviewProcess(db, application);
                return isStatusChanged;
            }
            await db.collection(DBCollections.Applications).doc(application.id).set(application)
                .then(() => {
                    console.log("Application approved successfully!");
                    isStatusChanged = true;
                })
                .catch((error) => {
                    console.error("Error writing approving application: ", error);
                    isStatusChanged = false;
                });
        }
        else if (status == ApplicationReviewStatus.Rejected) {
            application.stage = ApplicationStage.PMReview;
            application.programManagerReview!.status = ApplicationReviewStatus.Rejected;
            await db.collection(DBCollections.Applications).doc(application.id).set(application)
                .then(() => {
                    console.log("Application rejected successfully!");
                    isStatusChanged = true;
                })
                .catch((error) => {
                    console.error("Error writing rejecting application: ", error);
                    isStatusChanged = false;
                });
        }
    }

    return isStatusChanged;
}


export const addBiospecimenFormInformation = async (db: FirebaseFirestore.Firestore, applicationId: string, biospecimenForm: BiospecimenForm) => {
    let application = await getApplicationById(db, applicationId);
    let isStatusChanged = false;
    if (!application.isEmpty()) {
        application.biospecimenForm = biospecimenForm;
        isStatusChanged = await instantiateSteeringCommitteeReviewProcess(db, application);
    }
    return isStatusChanged;
}

export const instantiateSteeringCommitteeReviewProcess = async (db: FirebaseFirestore.Firestore, application: Application) => {
    application = createApplication(application);
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
    await db.collection(DBCollections.Applications).doc(application.id).set(application)
        .then(() => {
            console.log("Application updated successfully!");
            isStatusChanged = true;
        })
        .catch((error) => {
            console.error("Error writing updating application: ", error);
            isStatusChanged = false;
        });
    return isStatusChanged;
}


export const steeringCommitteeReviewApplication = async (db: FirebaseFirestore.Firestore, applicationId: string, status: ApplicationReviewStatus, steeringCommitteeMemberName: string) => {
    let application = await getApplicationById(db, applicationId);
    let isStatusChanged = false;
    if (!application.isEmpty()) {
        for (let i = 0; i < application.steeringCommitteeReview!.reviewers!.length; i++) {
            if (application.steeringCommitteeReview!.reviewers![i].name == steeringCommitteeMemberName) {
                application.steeringCommitteeReview!.reviewers![i].status = status;
            }
        }
        await db.collection(DBCollections.Applications).doc(application.id).set(application)
            .then(() => {
                console.log("Application reviewed successfully!");
                isStatusChanged = true;
            })
            .catch((error) => {
                console.error("Error writing reviewing application: ", error);
                isStatusChanged = false;
            });
    }
    return isStatusChanged;
}