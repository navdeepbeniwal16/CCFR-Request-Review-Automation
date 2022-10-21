import { Container, Grid, Group, Button } from '@mantine/core';
import {
    withAuthUser,
    AuthAction,
    withAuthUserTokenSSR,
    getFirebaseAdmin,
} from 'next-firebase-auth';
import Head from 'next/head';
import ApplicationTable from '../../components/ApplicationTable';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Application } from '../../lib/interfaces';
import {
    getAllSubmittedApplications,
    getApplicationsByApplicant,
    getApplicationsByStatus,
} from '../../lib/application';
import { convertApplicationTimestamp } from '../../lib/utilities/applicationDateParsers';
import firebase from 'firebase';
import 'firebase/firestore';
import { ApplicationStatus, UserRole } from '../../lib/utilities/AppEnums';

type ApplicationsPageProps = {
    title: string | null;
    applications: Application[];
    userRole: UserRole;
    userEmail: string;
};

const PAGE_SIZE = 10;

const ApplicationsPage: NextPage<ApplicationsPageProps> = ({
    title,
    applications,
    userRole,
    userEmail,
}) => {
    const [apps, setApps] = useState(applications);
    const [last, setLast] = useState<FirebaseFirestore.QueryDocumentSnapshot>();
    const [db, setDB] = useState<FirebaseFirestore.Firestore>();
    const pageTitle = (title ? title : 'All') + ' Applications';

    useEffect(() => {
        const tempDB =
            firebase.firestore() as unknown as FirebaseFirestore.Firestore;
        setDB(tempDB);
    }, []);

    useEffect(() => {
        if (db) {
            getApplications(title || '', userEmail || '', db, undefined).then(
                data => setLast(data.lastApplication),
            );
            setApps(applications);
        }
    }, [applications, title, userEmail, db]);

    return (
        <Container m="md" p="md" mt="0" fluid>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <Grid justify="space-between" align="center">
                <h1>{pageTitle}</h1>
                <Group>
                    {/*
                    Uncomment to add search in the future
                    <TextInput
                        icon={<IconSearch size={18} stroke={1.5} />}
                        size="md"
                        placeholder="Search for applications"
                        rightSectionWidth={42}
                        onKeyDown={e =>
                            e.key === 'Enter' &&
                            (e.target as HTMLInputElement).value
                                ? router.push(
                                      '/applications?s=' +
                                          (e.target as HTMLInputElement).value,
                                  )
                                : null
                        }
                    />
                    */}
                    <Link href="/applications/new" passHref>
                        <Button component="a" size="md">
                            Create New
                        </Button>
                    </Link>
                </Group>
            </Grid>
            <ApplicationTable
                applications={apps}
                fetchMoreData={async () => {
                    if (db) {
                        const newApps = await getApplications(
                            userRole,
                            userEmail,
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
    type: string,
    email: string,
    db: FirebaseFirestore.Firestore,
    last?: FirebaseFirestore.QueryDocumentSnapshot,
) => {
    let f = () => getAllSubmittedApplications(db, PAGE_SIZE, last);
    if (Object.keys(ApplicationStatus).includes(type)) {
        f = () =>
            getApplicationsByStatus(
                db,
                type as ApplicationStatus,
                PAGE_SIZE,
                last,
            );
    } else if (type == 'My') {
        f = () => getApplicationsByApplicant(db, email, PAGE_SIZE, last);
    }
    return f();
};

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
    const appType: ApplicationsPageProps['title'] = query.type
        ? query.type?.toString().charAt(0).toUpperCase() + query.type?.slice(1)
        : '';
    const db = getFirebaseAdmin().firestore();
    const data = await getApplications(
        appType,
        AuthUser.email || '',
        db,
        undefined,
    );

    const _props: ApplicationsPageProps = {
        title: appType,
        applications: data.applications.map(a =>
            convertApplicationTimestamp(a),
        ),
        userRole: AuthUser.claims.role as UserRole,
        userEmail: AuthUser.email || '',
    };

    return {
        props: _props,
    };
});

export default withAuthUser<ApplicationsPageProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ApplicationsPage);
