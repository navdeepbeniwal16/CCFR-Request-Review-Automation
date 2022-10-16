import {
    ApplicationReviewStatus,
    ApplicationStage,
    ApplicationStatus,
    InstitutionAccessType,
} from './utilities/AppEnums';

export interface Application {
    id: string;
    title: string;
    institutionPrimary: Institution;
    email: string;
    phoneNumber?: number;
    address?: Address;
    institutionSecondary?: Institution;
    productCommercialization?: boolean;
    dataReceiptDeadline?: Date;
    biospecimenReceiptDeadline?: Date;
    ccfrCollaborators?: Collaborator[];
    studyDescription?: StudyDescription;
    dataRequired?: ResourceRequest[];
    programManagerReview?: Review;
    biospecimenRequired?: ResourceRequest[];
    BWGChairReview?: Review;
    createdAt: Date;
    biospecimenForm?: BiospecimenForm;
    steeringCommitteeReview?: {
        reviewStartDate?: Date;
        reviewers?: Review[];
        firstAcceptance?: Date;
        numberOfReviewersAccepted?: number;
        totalReviewers?: number;
    };
    status: ApplicationStatus;
    stage: ApplicationStage;
    history: HistoryNode[];
}

export interface Address {
    streetName?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
}

export interface Institution {
    investigator?: string;
    jobTitle?: string;
    institution?: string;
    department?: string;
    accessType?: InstitutionAccessType;
}

export interface Collaborator {
    centerNumber?: number;
    ccfrSite?: string;
    sitePIName?: string;
    sitePIDegree?: string;
}

export interface StudyDescription {
    abstract?: string;
    aims?: string;
    backgroundAndSignificance?: string;
    preliminaryData?: string;
    selectionCriteria?: string;
}

export interface ResourceRequest {
    name: string,
    type: string,
    quantity?: number,
    numSamples?: number,
}

export interface Review {
    name: string;
    status: ApplicationReviewStatus;
}

export interface BiospecimenForm {
    amountRequired?: number;
    proposedTestingMethodlogy?: string;
    clarifications?: Clarification;
    BWGStatusReview?: string;
}

export interface Clarification {
    additionalDispatchRequirement?: 'Yes' | 'No' | 'TBD';
    fluoroscentDyeQuantificationRequired?: 'Yes' | 'No' | 'TBD';
    LCLDerivedDNAAcceptable?: 'Yes' | 'No' | 'TBD';
    depletedDNASampleRequest?:
        | 'Exclude Sample(s)'
        | 'Extract at CCFR Site(s)'
        | 'TBD';
    neoplasticCellularity?: {
        minNC?: string;
        minVolume?: string;
    };
    BWGGroupConclusions?: string;
    applicantCommentResponse?: string;
}

export interface HistoryNode {
    title: string;
    description: string;
    timestamp: Date;
    userID?: string;
    stage: Application['stage'];
}

export interface ExistingCCFRSiteData {
    siteID: string;
    centerNumber: string;
    siteName: string;
    pIName: string;
    pIDegree: string;
}

export interface ExistingCCFRBiospecimens {
    biospecimenData: string;
    name: string;
    condition: string;
}

export interface ExistingCCFRData {
    dataID: string;
    name: string;
    condition: string;
}

export interface SteeringCommitteeUIDs {
    name: string;
    UID: string;
}

export interface UserProfile {
    displayName?: string;
    email?: string;
    emailVerified?: boolean;
    phoneNumber?: string;
    photoURL?: string;
}

export interface Notification {
    receiverEmail: string;
    createdDate: Date;
    text: string;
    isRead: Boolean;
    id?: string;
}
