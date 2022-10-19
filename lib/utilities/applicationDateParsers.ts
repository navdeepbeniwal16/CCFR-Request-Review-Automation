import { Application } from "../interfaces";
import {set, get} from 'lodash';
import firebase from 'firebase'
import 'firebase/firestore'

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
        if (val) set(application, date, JSON.parse(JSON.stringify((val as firebase.firestore.Timestamp).toDate())))
    })

    return application;
}

export function convertApplicationDates(application: Application) {
    getDates(application).forEach(date => {
        let val = get(application, date)
        if (val) {
            if (typeof val == 'string') val = new Date(val);
            set(application, date, firebase.firestore.Timestamp.fromDate(val));
        }
    })

    return application;
}