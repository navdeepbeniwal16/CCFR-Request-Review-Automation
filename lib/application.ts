import { Application } from "./interfaces"
import firebase from "firebase";
import { ApplicationStage, ApplicationStatus, DBCollections } from "./utilities/AppEnums";

const initEmptyApplication = () => {
    let application:Application = {} as Application;
    application.isEmpty = (): Boolean => {
        return Object.keys(application).length === 1;
    }

    return application;
}

const createApplication = (data:firebase.firestore.DocumentData | Application | undefined) => {
    const application:Application = <Application> data;
    application.isEmpty = (): Boolean => {
        return Object.keys(application).length === 1;
    }

    return application;
}

const createApplicationData = (application: Application) => {
    const data:any = {};
    for (const [k, v] of Object.entries(application)) {
        if(k == 'isEmpty') continue;
        data[k] = v;
      }
    return data;
}

export const saveApplicationAsDraft = async (application: Application, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
    application.stage = ApplicationStage.Draft;  
    await db.collection(DBCollections.Applications).doc(application.id).set(application)
    .then(() => {
        console.log("Application document successfully written!");
    })
    .catch((error) => {
        console.log("Error writing application document: ", error.message);
        return false;
    });

    return true;
}

export const saveAndSubmitApplication = async (application: Application, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
    application.stage = ApplicationStage.Submitted;
    application.status = ApplicationStatus.Active;
    await db.collection(DBCollections.Applications).doc(application.id).set(application)
    .then(() => {
        console.log("Application document successfully written!");
    })
    .catch((error) => {
        console.log("Error writing application document: ", error.message);
        return false;
    });

    return true;
}

export const getApplicationById = async (applicationId: string, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  const docRef = db.collection(DBCollections.Applications).doc(applicationId);
  let fetchedApplication:Application = initEmptyApplication();
  await docRef.get().then((doc) => {
      if (doc.exists) {
        fetchedApplication = createApplication(doc.data())
          console.log("Application data with id (" + applicationId + ":", fetchedApplication); // TODO: TBR after testing..
          return fetchedApplication;
      } else {
        console.log("No application found");
      }
  }).catch((error) => {
      console.log("Error getting document:", error.message);
  });

  return fetchedApplication;
}

export const getApplicationByTitle = async (applicationTitle: string, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let fetchedApplications:Application[] = [];
  
  const docRef = db.collection(DBCollections.Applications).where("title", "==", applicationTitle);
  await docRef.get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          const application = createApplication(doc.data());
          fetchedApplications.push(application);
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error.message);
  });
  
  if(fetchedApplications.length > 0) {
    return fetchedApplications[0];
  } else {
    return initEmptyApplication();
  }
}

export const getAllSubmittedApplications = async (auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let fetchedApplications:Application[] = [];

  const docRef = db.collection(DBCollections.Applications).where("stage", "==", ApplicationStage.Submitted);
  await docRef.get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          const application = createApplication(doc.data());
          fetchedApplications.push(application);
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error.message);
  });

  return fetchedApplications;
}

export const getSavedApplicationsByApplicant = async (applicantEmail: string, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let fetchedApplications:Application[] = [];

  const docRef = db.collection(DBCollections.Applications).where("email", "==", applicantEmail).where("stage", "==", ApplicationStage.Draft);
  await docRef.get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          const application = createApplication(doc.data());
          fetchedApplications.push(application);
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error.message);
  });

  return fetchedApplications;
}

export const getSubmittedApplicationsByApplicant = async (applicantEmail: string, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let fetchedApplications:Application[] = [];

const docRef = db.collection(DBCollections.Applications).where("email", "==", applicantEmail).where("stage", "==", ApplicationStage.Submitted);
  await docRef.get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          const application = createApplication(doc.data());
          fetchedApplications.push(application);
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error.message);
  });

  return fetchedApplications;
}

export const getApplicationsByStatus = async (status: ApplicationStatus, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let fetchedApplications:Application[] = [];

  const docRef = db.collection(DBCollections.Applications).where("status", "==", status);
  await docRef.get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          const application = createApplication(doc.data());
          fetchedApplications.push(application);
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error.message);
  });

  return fetchedApplications;
}

export const getApplicationsByStage = async (stage: ApplicationStage, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let fetchedApplications:Application[] = [];

  const docRef = db.collection(DBCollections.Applications).where("stage", "==", stage);
  await docRef.get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          const application = createApplication(doc.data());
          fetchedApplications.push(application);
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error.message);
  });

  return fetchedApplications;
}

// TODO:
export const withdrawApplication = async (applicationId: string, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let application:Application = await getApplicationById(applicationId, auth, db);
  let isWithdrawn = false;
  if(!application.isEmpty()) {
    application.stage = ApplicationStage.Draft;  // TODO: Check with Saood, it probably should be apart of the status rather than Stage
    const data = createApplicationData(application);
    await db.collection(DBCollections.Applications).doc(application.id).set(data)
    .then(() => {
        console.log("Application withdrawn successfully!");
        isWithdrawn = true;
    })
    .catch((error) => {
        console.error("Error writing withdrawing application: ", error.message);
        isWithdrawn = false;
    });
  }
  
  return isWithdrawn;
}

export const updateApplicationStatus = async (applicationId: string, status:ApplicationStatus, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let application = await getApplicationById(applicationId, auth, db);
  let isStatusChanged = false;
  if(!application.isEmpty()) {
    application.status = status;
    const applicationData = createApplicationData(application);
    await db.collection(DBCollections.Applications).doc(application.id).set(applicationData)
    .then(() => {
        console.log("Application withdrawn successfully!");
        isStatusChanged = true;
    })
    .catch((error) => {
        console.error("Error writing withdrawing application: ", error.message);
        isStatusChanged = false;
    });
  }
  
  return isStatusChanged;
}

export const updateApplication = async (application: Application, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let isStatusChanged = false;
  application = createApplication(application);
  if(application.isEmpty() && application.id) {
    let foundApplication = await getApplicationById(application.id, auth, db);
  
    if(!foundApplication.isEmpty()) {
      const applicationData = createApplicationData(application);
      await db.collection(DBCollections.Applications).doc(application.id).set(applicationData)
      .then(() => {
          console.log("Application updated successfully!");
          isStatusChanged = true;
      })
      .catch((error) => {
          console.error("Error updating applications: ", error.message);
          isStatusChanged = false;
      });
    }
  }
  
  return isStatusChanged;
}

  