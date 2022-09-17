
/*
Interface Enums
*/
export enum InstitutionAccessType {
    Data = "Data",
    Biospecimens = "Biospecimens",
    Both = "Both"
}

export enum ApplicationStatus {
    Active = "Active",
    Rejected = "Rejected",
    Accepted = "Accepted"
}

export enum ApplicationStage {
    Draft = "Draft", 
    Submitted = "Submitted", 
    PMReview = "PMReview",
    BWGReview = "BWGReview", 
    SCReview = "SCReview", 
    Complete = "Complete"
}

export enum ApplicationReviewStatus {
    Approved = "Approved", 
    Rejected = "Rejected", 
    In_Review = "In Review"
}





/*
Firestore DB Enums
*/
export enum DBCollections {
    Applications = "applications"
}