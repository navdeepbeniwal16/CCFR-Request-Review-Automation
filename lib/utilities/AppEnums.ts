/*
Interface Enums
*/
export enum InstitutionAccessType {
    Data = 'Data',
    Biospecimens = 'Biospecimens',
    Both = 'Both',
}

export enum ApplicationStatus {
    Inactive = 'Inactive',
    Active = 'Active',
    Rejected = 'Rejected',
    Accepted = 'Accepted',
}

export enum ApplicationStage {
    Draft = 'Draft',
    Submitted = 'Submitted',
    PMReview = 'PMReview',
    BWGReview = 'BWGReview',
    SCReview = 'SCReview',
    Complete = 'Complete',
}

export enum ApplicationReviewStatus {
    Approved = 'Approved',
    Rejected = 'Rejected',
    In_Review = 'In Review',
}

/*
Firestore DB Enums
*/
export enum DBCollections {
    Applications = 'applications',
    Notification = 'notification',
    Notifications = 'notifications',
    ExistingCCFRSiteData = 'ExistingCCFRSiteData',
    ExistingCCFRBiospecimens = 'ExistingCCFRBiospecimens',
    ExistingCCFRData = 'ExistingCCFRData',
}

export enum UserRole {
    APPLICANT = 'Applicant',
    SC_MEMBER = 'Steering_Committee_Member',
    BGW_CHAIR = 'BWG_Chair',
    PROGRAM_MANAGER = 'Program_Manager',
    ADMIN = 'Portal_Administrator',
    INTERNAL_USER = 'Internal_User'
}
