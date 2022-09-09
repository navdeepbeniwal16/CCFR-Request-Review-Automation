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
    status: string // change to enum?
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
    accessType?: string, // change to enum?
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
    type: string, // change to enum?
    quantity: number,
    numSamples: number,
}

interface Review {
    name: string,
    status: string, // change to enum?
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