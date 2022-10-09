export interface Application {
    id?: string,
    title: string,
    institutionPrimary: Institution,
    email: string,
    phoneNumber: string,
    address: Address,
    institutionSecondary?: boolean,
    productCommercialization?: boolean,
    dateReceiptDeadline?: Date,
    biospecimenReceiptDeadline?: Date,
    ccfrCollaborators?: Collaborator[],
    studyDescription?: StudyDescription,
    dataRequired?: Request[],
    programManagerReview?: Review,
    biospecimenRequired?: Request[],
    createdAt?: Date,
    biospecimenForm?: BiospecimenForm,
    steeringCommitteeReview?: {
        reviewStartDate?: Date,
        reviewers?: Review[],
        firstAcceptance?: Date,
        numberOfReviewersAccepted?: number,
        totalReviewers?: number,
    },
    agreement: Agreement,
    status: "Active" | "Rejected" | "Accepted" | "Inactive" // changed to enum
    stage: "Draft" | "Submitted" | "PMReview" | "BWGReview" | "SCReview" | "Accepted" // added key to indicate current stage of application
}

interface Address {
    streetName: string,
    city: string,
    state: string,
    zipcode: string,
    country: string,
}

interface Institution {
    investigator: string,
    jobTitle: string,
    institution: string,
    department: string,
    accessType?: "Data" | "Biospecimens" | "Both", // changed to enum
}

interface Collaborator {
    centerNumber?: number,
    ccfrSite?: string,
    sitePIName?: string,
    sitePIDegree?: string,
}

interface StudyDescription {
    abstract?: string,
    aims?: string,
    backgroundAndSignificance?: string,
    preliminaryData?: string,
    selectionCriteria?: string,
}

interface Request {
    name: string,
    type: string,
    quantity: number,
    numSamples: number,
}

interface Review {
    name: string,
    status: "Approved" | "Rejected" | "In Review", // changed to enum
}

interface BiospecimenForm {
    amountRequired?: number,
    proposedTestingMethodlogy?: string,
    clarifications?: Clarification,
    BWGStatusReview?: string,
}

interface Clarification {
    additionalDispatchRequirement?: "Yes" | "No" | "TBD",
    fluoroscentDyeQuantificationRequired?: "Yes" | "No" | "TBD",
    LCLDerivedDNAAcceptable?: "Yes" | "No" | "TBD",
    depletedDNASampleRequest?: "Exclude Sample(s)" | "Extract at CCFR Site(s)" | "TBD",
    neoplasticCellularity?: {
        minNC?: string,
        minVolume?: string,
    },
    BWGGroupConclusions?: string,
    applicantCommentResponse?: string,
}

// Added supplementary databases as well
export interface ExistingCCFRSiteData {
    siteID: string;
    centerNumber: string;
    siteName: string;
    pIName: string;
    pIDegree: string;
}

export interface ExistingCCFRBiospecimens {
    biospecimenData: string,
    name: string,
    condition: string
}

export interface ExistingCCFRData {
    dataID: string,
    name: string,
    condition: string
}

export interface SteeringCommitteeUIDs {
    name: string,
    UID: string
}

interface Agreement {
    a1: boolean,
    a2: boolean,
    a3: boolean,
    a4: boolean,
}