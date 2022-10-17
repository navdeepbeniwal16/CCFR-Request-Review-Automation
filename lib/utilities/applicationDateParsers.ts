import { Application } from "../interfaces";
import {set, get} from 'lodash';

const getDates = (application: Application) => [
    "dataReceiptDeadline",
    "biospecimenReceiptDeadline",
    "createdAt",
    ... application.steeringCommitteeReview ? [
        "steeringCommitteeReview.reviewStartDate",
        "steeringCommitteeReview.firstAcceptance",
    ] : [],
]

export function convertApplicationTimestamp(application: Application) {
    getDates(application).forEach(date => {
        const val = get(application, date)
        if (val) set(application, date, JSON.parse(JSON.stringify((val as FirebaseFirestore.Timestamp).toDate())))
    })

    return application;
}

export function convertApplicationDates(application: Application) {
    getDates(application).forEach(date => {
        const val = get(application, date)
        if (val) set(application, date, FirebaseFirestore.Timestamp.fromDate(val));
    })

    return application;
}