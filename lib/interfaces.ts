export interface Application {
    id?: string,
    title?: string,
    institutionPrimary?: Institution,
    email?: string,
    phoneNumber?: number,
    address?: Address,
    institutionSecondary?: Institution,
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
    status: "Active" | "Rejected" | "Accepted",
    stage: "Draft" | "Submitted" | "PMReview" | "BWGReview" | "SCReview" | "Complete",
}

interface Address {
    streetNumber?: number,
    streetName?: string,
    state?: string,
    zipcode?: number,
    country?: string,
}

interface Institution {
    investigator?: string,
    jobTitle?: string,
    institution?: string,
    department?: string,
    accessType?: "Data" | "Biospecimens" | "Both",
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
    status: "Approved" | "Rejected" | "In Review",
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
    biospecimenData:string,
    name:string,
    condition:string
}

export interface ExistingCCFRData {
    dataID:string,
    name:string,
    condition:string
}

export interface SteeringCommitteeUIDs {
    name:string,
    UID:string
}