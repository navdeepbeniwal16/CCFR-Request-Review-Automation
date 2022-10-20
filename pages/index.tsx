import { Container, Grid, Button } from '@mantine/core';
import { NextPage } from 'next';
import {
    withAuthUser,
    AuthAction,
    withAuthUserTokenSSR,
    getFirebaseAdmin,
    useAuthUser,
} from 'next-firebase-auth';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ApplicationTable from '../components/ApplicationTable';
import {
    getAllSteeringCommitteeMembers,
    getAllSubmittedApplications,
    getApplicationsByApplicant,
    getApplicationsByStages,
} from '../lib/application';
import { Application } from '../lib/interfaces';
import { ApplicationStage, UserRole } from '../lib/utilities/AppEnums';
import { convertApplicationTimestamp } from '../lib/utilities/applicationDateParsers';
import firebase from 'firebase';
import 'firebase/firestore';

type HomePageProps = {
    applications: Application[];
    userRole: UserRole;
};

const PAGE_SIZE = 10;

const HomePage: NextPage<HomePageProps> = ({ applications, userRole }) => {
    const user = useAuthUser();
    const [apps, setApps] = useState(applications);
    const [last, setLast] = useState<FirebaseFirestore.QueryDocumentSnapshot>();
    const [db, setDB] = useState<FirebaseFirestore.Firestore>();

    useEffect(() => {
        const tempDB =
            firebase.firestore() as unknown as FirebaseFirestore.Firestore;
        setDB(tempDB);
        getApplications(userRole, user.email || '', tempDB, undefined).then(
            data => setLast(data.lastApplication),
        );
    }, []);

    return (
        <Container m="md" p="md" mt="0" fluid style={{ height: '100%' }}>
            <Head>
                <title>For You | CCFR Portal</title>
            </Head>
            <Grid justify="space-between" align="center">
                <h1>Relevant Applications For You </h1>
                <Link href="/applications/new" passHref>
                    <Button component="a" size="md">
                        Create New
                    </Button>
                </Link>
            </Grid>
            <ApplicationTable
                applications={apps}
                fetchMoreData={async () => {
                    if (db) {
                        const newApps = await getApplications(
                            userRole,
                            user.email || '',
                            db,
                            last,
                        );
                        setApps([
                            ...apps,
                            ...newApps.applications.map(a =>
                                convertApplicationTimestamp(a),
                            ),
                        ]);
                        setLast(newApps.lastApplication);
                    }
                }}
            />
        </Container>
    );
};

const getApplications = (
    role: string,
    email: string,
    db: FirebaseFirestore.Firestore,
    last?: FirebaseFirestore.QueryDocumentSnapshot,
) => {
    let f = () => getApplicationsByApplicant(db, email, PAGE_SIZE, last);
    if (role == UserRole.ADMIN) {
        f = () => getAllSubmittedApplications(db, PAGE_SIZE, last);
    } else if (role == UserRole.PROGRAM_MANAGER) {
        f = () =>
            getApplicationsByStages(
                db,
                [ApplicationStage.PMReview, ApplicationStage.SCReview],
                PAGE_SIZE,
                last,
            );
    } else if (role == UserRole.BGW_CHAIR) {
        f = () =>
            getApplicationsByStages(
                db,
                [ApplicationStage.BWGReview],
                PAGE_SIZE,
                last,
            );
    } else if (role == UserRole.SC_MEMBER) {
        f = () =>
            getApplicationsByStages(
                db,
                [ApplicationStage.SCReview],
                PAGE_SIZE,
                last,
            );
    }
    return f();
};

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
    if (!AuthUser.email) {
        return {
            notFound: true,
        };
    }

    const db = getFirebaseAdmin().firestore();
    const steeringCommittee = await getAllSteeringCommitteeMembers(db);

    const data = await getApplications(
        AuthUser.claims.role.toString(),
        AuthUser.email,
        db,
        undefined,
    );

    const _props: HomePageProps = {
        applications: data.applications.map(a =>
            convertApplicationTimestamp(a),
        ),
        userRole: AuthUser.claims.role as UserRole,
    };

    return {
        props: _props,
    };
});

export default withAuthUser<HomePageProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(HomePage);
