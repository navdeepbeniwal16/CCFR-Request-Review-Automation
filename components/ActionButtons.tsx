import { Button, Group } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { AuthUserContext } from 'next-firebase-auth';
import { NextRouter } from 'next/router';
import { useState } from 'react';
import {
    programManagerReviewApplication,
    steeringCommitteeReviewApplication,
    updateApplication,
    withdrawApplication,
} from '../lib/application';
import { Application } from '../lib/interfaces';
import { createNotificationForUser } from '../lib/notification';
import {
    ApplicationReviewStatus,
    ApplicationStage,
    ApplicationStatus,
} from '../lib/utilities/AppEnums';
import { convertApplicationDates } from '../lib/utilities/applicationDateParsers';

type ActionButtonProps = {
    db: FirebaseFirestore.Firestore;
    application: Application;
    router: NextRouter;
    onClick: Function;
    user: AuthUserContext;
};

const actionCallback = (
    isSuccess: boolean,
    successTitle: string,
    successMessage: string,
    redirectUrl: string,
    router: NextRouter,
    errorTitle: string,
    errorMessage: string,
    setLoading: Function,
) => {
    if (isSuccess) {
        showNotification({
            title: successTitle,
            color: 'green',
            message: successMessage,
        });
        if (redirectUrl && router) {
            router.push(redirectUrl);
        }
    } else {
        showNotification({
            title: errorTitle,
            color: 'red',
            message: errorMessage,
        });
    }
    setLoading('');
};

export const PIActionButton = ({
    db,
    application,
    router,
}: ActionButtonProps) => {
    const [loading, setLoading] = useState('');
    return (
        <Button
            loading={loading == 'withdrawing'}
            onClick={() => {
                setLoading('withdrawing');
                if (db) {
                    withdrawApplication(db, application.id).then(isSuccess => {
                        actionCallback(
                            isSuccess,
                            'Withdraw Successful',
                            'Successfully withdrew your application',
                            '/applications/new?id=' + application.id,
                            router,
                            'Withdraw Failed',
                            'An error occured while trying to withdraw',
                            setLoading,
                        );
                    });
                }
            }}
            size="md"
        >
            Withdraw
        </Button>
    );
};

export const PMActionButton = ({
    db,
    application,
    router,
}: ActionButtonProps) => {
    const [loading, setLoading] = useState('');
    const review = async (status: ApplicationReviewStatus) => {
        let isSuccess = false;
        if (application.stage == ApplicationStage.PMReview) {
            isSuccess = await programManagerReviewApplication(
                db,
                application.id,
                status,
            );
        } else {
            const status = ApplicationReviewStatus.Approved
                ? ApplicationStatus.Accepted
                : ApplicationStatus.Rejected;
            application.status = status;
            application.stage = ApplicationStage.Complete;
            isSuccess = await updateApplication(
                db,
                convertApplicationDates(application),
            );
            if (isSuccess) {
                const appURL = URL + '/applications/' + application.id;
                await createNotificationForUser(
                    application.email,
                    'Your application for "' +
                        application.title +
                        '" has been ' +
                        status.toLocaleLowerCase() +
                        '. You can review the outcome of your application by copying the link <a href="' +
                        appURL +
                        '">here</a> and pasting it in a new tab/window. If you can\'t see the hyperlink, ' +
                        'copy the following link instead: ' +
                        appURL +
                        '.',
                    true,
                    'ApplicationVerdicts',
                );
            }
        }
        actionCallback(
            isSuccess,
            'Application ' + status.toLocaleLowerCase(),
            'Application has been successfully ' + status.toLocaleLowerCase(),
            '/applications/' + application.id,
            router,
            'Application reviewal failed',
            'An error occured while trying to process review',
            setLoading,
        );
    };
    return (
        <Group position="right">
            <Button
                loading={loading == 'rejected'}
                disabled={loading != '' && loading != 'rejected'}
                onClick={() => {
                    setLoading('rejected');
                    review(ApplicationReviewStatus.Rejected);
                }}
                size="md"
                color={'red'}
            >
                Reject
            </Button>
            <Button
                loading={loading == 'approved'}
                disabled={loading != '' && loading != 'approved'}
                onClick={() => {
                    setLoading('approved');
                    review(ApplicationReviewStatus.Approved);
                }}
                size="md"
                color={'green'}
            >
                Approve
            </Button>
        </Group>
    );
};

export const SCActionButton = ({
    db,
    application,
    router,
    user,
}: ActionButtonProps) => {
    const [loading, setLoading] = useState('');
    const handleVote = async (vote: ApplicationReviewStatus) => {
        const isSuccess = await steeringCommitteeReviewApplication(
            db,
            application.id,
            {
                name: user.displayName || '',
                email: user.email || '',
                status: vote,
            },
        );
        actionCallback(
            isSuccess,
            'Successfully voted!',
            'You have rejected this application',
            '/applications/' + application.id,
            router,
            'Voting failed',
            'An error occured while processing your vote',
            setLoading,
        );
    };
    return (
        <Group position="right">
            <Button
                size="md"
                color={'red'}
                loading={loading == 'reject'}
                disabled={loading != '' && loading != 'reject'}
                onClick={async () => {
                    setLoading('reject');
                    handleVote(ApplicationReviewStatus.Rejected);
                }}
            >
                Reject
            </Button>
            <Button
                size="md"
                color={'green'}
                loading={loading == 'approve'}
                disabled={loading != '' && loading != 'approve'}
                onClick={async () => {
                    setLoading('approve');
                    handleVote(ApplicationReviewStatus.Approved);
                }}
            >
                Approve
            </Button>
        </Group>
    );
};

export const BWGActionButton = ({
    db,
    application,
    router,
    onClick,
}: ActionButtonProps) => (
    <Group position="right">
        <Button
            component="a"
            size="md"
            color={'green'}
            onClick={() => onClick()}
        >
            Submit BWG Form
        </Button>
    </Group>
);

export const CompletedActionButton = ({
    db,
    application,
    router,
}: ActionButtonProps) => {
    if (
        application.status == ApplicationStatus.Accepted ||
        application.status == ('Approved' as ApplicationStatus)
    ) {
        return (
            <Button color={'green'} size="md" variant="outline">
                Accepted
            </Button>
        );
    } else {
        return (
            <Button color={'red'} size="md" variant="outline">
                Rejected
            </Button>
        );
    }
};
