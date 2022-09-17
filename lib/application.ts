import { Application } from "./interfaces"
import firebase from "firebase";
import { ApplicationStage, ApplicationStatus, DBCollections } from "./utilities/AppEnums";

export const saveApplicationAsDraft = async (application: Application, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
    application.stage = ApplicationStage.Draft;  
    await db.collection(DBCollections.Applications).doc(application.id).set(application)
    .then(() => {
        console.log("Application document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing application document: ", error);
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
        console.error("Error writing application document: ", error);
        return false;
    });

    return true;
}

export const getApplicationById = async (applicationId: string, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  const docRef = db.collection(DBCollections.Applications).doc(applicationId);
  let fetchedApplication:Application = {} as Application;
  await docRef.get().then((doc) => {
      if (doc.exists) {
          fetchedApplication = <Application>doc.data();
          console.log("Application data with id (" + applicationId + ":", fetchedApplication);
          return fetchedApplication;
      } else {
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });

  return fetchedApplication;
}

export const getApplicationByTitle = async (applicationTitle: string, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let fetchedApplications:Application[] = [];
  
  const docRef = db.collection(DBCollections.Applications).where("title", "==", applicationTitle);
  await docRef.get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          fetchedApplications.push(<Application>doc.data());
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
  
  return <Application>fetchedApplications[0];
}

export const getAllSubmittedApplications = async (auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let fetchedApplications:Application[] = [];

  const docRef = db.collection("applications").where("stage", "==", "Submitted");
  await docRef.get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          fetchedApplications.push(<Application>doc.data());
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });

  return fetchedApplications;
}

export const getSavedApplicationsByApplicant = async (applicantEmail: string, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let fetchedApplications:Application[] = [];

  const docRef = db.collection("applications").where("email", "==", applicantEmail).where("stage", "==", "Draft");
  await docRef.get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          fetchedApplications.push(<Application>doc.data());
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });

  return fetchedApplications;
}

export const getSubmittedApplicationsByApplicant = async (applicantEmail: string, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let fetchedApplications:Application[] = [];

  const docRef = db.collection("applications").where("email", "==", applicantEmail).where("stage", "==", "Submitted");
  await docRef.get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          fetchedApplications.push(<Application>doc.data());
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });

  return fetchedApplications;
}

export const getApplicationsByStatus = async (status: ApplicationStatus, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let fetchedApplications:Application[] = [];

  const docRef = db.collection("applications").where("status", "==", status);
  await docRef.get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          fetchedApplications.push(<Application>doc.data());
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });

  return fetchedApplications;
}

export const getApplicationsByStage = async (stage: ApplicationStage, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let fetchedApplications:Application[] = [];

  const docRef = db.collection("applications").where("stage", "==", stage);
  await docRef.get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          fetchedApplications.push(<Application>doc.data());
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });

  return fetchedApplications;
}

export const withdrawApplication = async (applicationId: string, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let application = await getApplicationById(applicationId, auth, db);
  let isWithdrawn = false;
  if(!isApplicationEmpty(application)) {
    application.stage = ApplicationStage.Draft;  // TODO: Check with Saood, it probably should be apart of the status
    
    await db.collection(DBCollections.Applications).doc(application.id).set(application)
    .then(() => {
        console.log("Application withdrawn successfully!");
        isWithdrawn = true;
    })
    .catch((error) => {
        console.error("Error writing withdrawing application: ", error);
        isWithdrawn = false;
    });
  }
  
  return isWithdrawn;
}

export const updateApplicationStatus = async (applicationId: string, status:ApplicationStatus, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let application = await getApplicationById(applicationId, auth, db);
  let isStatusChanged = false;
  if(!isApplicationEmpty(application)) {
    application.status = status;
    
    await db.collection(DBCollections.Applications).doc(application.id).set(application)
    .then(() => {
        console.log("Application withdrawn successfully!");
        isStatusChanged = true;
    })
    .catch((error) => {
        console.error("Error writing withdrawing application: ", error);
        isStatusChanged = false;
    });
  }
  
  return isStatusChanged;
}

export const updateApplication = async (application: Application, auth: firebase.auth.Auth, db: firebase.firestore.Firestore) => {
  let isStatusChanged = false;
  
  if(application && application.id) {
    let foundApplication = await getApplicationById(application.id, auth, db);
  
    if(!isApplicationEmpty(foundApplication)) {
      await db.collection(DBCollections.Applications).doc(application.id).set(application)
      .then(() => {
          console.log("Application updated successfully!");
          isStatusChanged = true;
      })
      .catch((error) => {
          console.error("Error updating applications: ", error);
          isStatusChanged = false;
      });
    }
  }
  
  return isStatusChanged;
}

const isApplicationEmpty = (application:Application) => {
  return Object.keys(application).length === 0;
}


  