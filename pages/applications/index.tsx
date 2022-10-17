import { Container, Grid, TextInput, Group, Button } from '@mantine/core';
import {
    withAuthUser,
    AuthAction,
    withAuthUserTokenSSR,
    getFirebaseAdmin,
} from 'next-firebase-auth';
import Head from 'next/head';
import ApplicationTable from '../../components/ApplicationTable';
import { IconSearch } from '@tabler/icons';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Application } from '../../lib/interfaces';
import {
    getAllSteeringCommitteeMembers,
    getAllSubmittedApplications,
} from '../../lib/application';
import { convertApplicationTimestamp } from '../../lib/utilities/applicationDateParsers';

type ApplicationsPageProps = {
    title: string | null;
    applications: Application[];
    numSteeringCommittee: number;
};

const ApplicationsPage: NextPage<ApplicationsPageProps> = ({
    title,
    applications,
    numSteeringCommittee,
}) => {
    const router = useRouter();
    const [apps, setApps] = useState(applications);
    const pageTitle =
        (title ? title.charAt(0).toUpperCase() + title.slice(1) : 'All') +
        ' Applications';

    return (
        <Container m="md" p="md" mt="0" fluid>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <Grid justify="space-between" align="center">
                <h1>{pageTitle}</h1>
                <Group>
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
                    <Link href="/applications/new" passHref>
                        <Button component="a" size="md">
                            Create New
                        </Button>
                    </Link>
                </Group>
            </Grid>
            <ApplicationTable
                applications={apps}
                numSteeringCommittee={numSteeringCommittee}
                fetchMoreData={() => {
                    setTimeout(() => {
                        // TODO: add pagination here
                    }, 1500);
                }}
            />
        </Container>
    );
};

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
    const appType: ApplicationsPageProps['title'] =
        query.type?.toString() || null;
    const db = getFirebaseAdmin().firestore();
    const data = await getAllSubmittedApplications(db);
    const steeringCommittee = await getAllSteeringCommitteeMembers(db);

    const _props: ApplicationsPageProps = {
        title: appType,
        applications: data.map(a => convertApplicationTimestamp(a)),
        numSteeringCommittee: steeringCommittee.length,
    };

    return {
        props: _props,
    };
});

export default withAuthUser<ApplicationsPageProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ApplicationsPage);
