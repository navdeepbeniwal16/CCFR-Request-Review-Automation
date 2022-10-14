import { Application } from "../interfaces";
import {set, get} from 'lodash';

export default function convertApplicationTimestamp(application: Application) {
    const dates = [
        "dateReceiptDeadline",
        "biospecimenReceiptDeadline",
        "createdAt",
        "history",
        ... application.steeringCommitteeReview ? [
            "steeringCommitteeReview.reviewStartDate",
            "steeringCommitteeReview.firstAcceptance",
        ] : [],
    ]

    dates.forEach(date => {
        const val = get(application, date)
        if (val) set(application, date, JSON.parse(JSON.stringify((val as FirebaseFirestore.Timestamp).toDate())))
    })

    return application;
}