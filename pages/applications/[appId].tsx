import {
    Group,
    Tabs,
    Text,
    Button,
    Badge,
    Stack,
    Divider,
    Box,
    LoadingOverlay,
} from '@mantine/core';
import { IconFile, IconHistory, IconMessageCircle } from '@tabler/icons';
import { NextPage } from 'next';
import {
    withAuthUser,
    AuthAction,
    withAuthUserTokenSSR,
    getFirebaseAdmin,
} from 'next-firebase-auth';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ApplicationStepper from '../../components/ApplicationStepper';
import ApplicationTimeLine from '../../components/ApplicationTimeline';
import ApplicationForm from '../../components/Form';
import VotingTable from '../../components/VotingTable';
import {
    getApplicationById,
    getExistingCCFRSiteData,
} from '../../lib/application';
import { Application, Collaborator } from '../../lib/interfaces';
import convertApplicationTimestamp from '../../lib/utilities/convertApplicationTimestamp';
const Countdown = dynamic(() => import('react-countdown'), { ssr: false });

type ApplicationPageProps = {
    application: Application;
    ccfrPeople: Collaborator[];
};

const badge = (
    <Badge
        sx={{ width: 16, height: 16, pointerEvents: 'none' }}
        variant="filled"
        size="xs"
        p={0}
    >
        6
    </Badge>
);

const tabGroups = (
    <Group style={{ maxWidth: 'unset' }} mt={20}>
        <Tabs.Tab value="application" icon={<IconFile size={24} />}>
            <Text size={'lg'}>Application</Text>
        </Tabs.Tab>
        <Tabs.Tab value="track" icon={<IconHistory size={24} />}>
            <Text size={'lg'}>Tracking</Text>
        </Tabs.Tab>
    </Group>
);

const getActionButtons = (role: string) => {
    if (role == 'pi') {
        return (
            <Link href="/applications/new" passHref>
                <Button component="a" size="md">
                    Withdraw
                </Button>
            </Link>
        );
    } else if (role == 'sc' || role == 'pm') {
        return (
            <Group position="right">
                <Button component="a" size="md" color={'red'}>
                    Reject
                </Button>
                <Button component="a" size="md" color={'green'}>
                    Approve
                </Button>
            </Group>
        );
    } else if (role == 'bwg') {
        return (
            <Group position="right">
                <Button component="a" size="md" color={'red'}>
                    Reject
                </Button>
                <Button component="a" size="md" color={'green'}>
                    Submit BWG Form
                </Button>
            </Group>
        );
    }
};

const votingTimeInfo = (scReview: Application['steeringCommitteeReview']) => {
    const voteStartDate = new Date(scReview?.reviewStartDate || '');
    const voteEndDate = new Date(scReview?.reviewStartDate || '');
    voteEndDate.setDate(voteEndDate.getDate() + 14);

    return (
        <Group grow>
            <Stack spacing={5}>
                <Text>
                    {'Voting Start Date: ' +
                        voteStartDate.toLocaleString('en-GB') || ''}
                </Text>
                <Text>
                    {'Voting End Date: ' +
                        voteEndDate.toLocaleString('en-GB') || ''}
                </Text>
            </Stack>
            <Stack
                align={'end'}
                spacing={0}
                style={{ fontWeight: 'bold', fontSize: '1.5rem' }}
            >
                <Text weight={'normal'} size="md">
                    Time Remaining
                </Text>
                <Countdown date={voteEndDate} />
            </Stack>
        </Group>
    );
};

const ApplicationPage: NextPage<ApplicationPageProps> = ({
    application,
    ccfrPeople,
}) => {
    return (
        <Tabs defaultValue="application" style={{ height: '100%' }} mt={-10}>
            <Tabs.List>
                <Group grow style={{ width: '100%' }}>
                    {tabGroups}
                    {getActionButtons('bwg')}
                </Group>
            </Tabs.List>

            <Tabs.Panel value="application" pt="xs">
                <ApplicationForm
                    application={application}
                    ccfrPeople={ccfrPeople}
                    readOnly={true}
                />
            </Tabs.Panel>

            <Tabs.Panel
                value="track"
                pt="xs"
                style={{ height: 'calc(100% - 50px)' }}
            >
                <Group style={{ height: 'calc(100% - 50px)' }}>
                    <Stack style={{ flexGrow: 1, height: '100%' }} mx={20}>
                        <ApplicationStepper application={application} />
                        <Divider />
                        <Text size={'xl'} mt={10}>
                            Voting Approval for: {application.title}
                        </Text>
                        <Box style={{ position: 'relative' }}>
                            <LoadingOverlay
                                visible={
                                    application.steeringCommitteeReview == null
                                }
                                overlayBlur={2}
                                loader={
                                    <Text weight={'bold'} size="lg">
                                        Voting period has not yet begun.
                                    </Text>
                                }
                            />
                            {votingTimeInfo(
                                application.steeringCommitteeReview,
                            )}
                            <VotingTable />
                        </Box>
                    </Stack>
                    <Divider orientation="vertical" />
                    <ApplicationTimeLine history={application.history} />
                </Group>
            </Tabs.Panel>
        </Tabs>
    );
};

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
    const appId: string = query.appId?.toString() || '';
    const db = getFirebaseAdmin().firestore();

    const application = await getApplicationById(db, appId);
    const ccfrPeople = await getExistingCCFRSiteData(db);

    const _props: ApplicationPageProps = {
        application: convertApplicationTimestamp(application),
        ccfrPeople: ccfrPeople.map(p => ({
            centerNumber: parseInt(p.centerNumber),
            ccfrSite: p.siteName,
            sitePIName: p.pIName,
            sitePIDegree: p.pIDegree,
        })),
    };

    return {
        props: _props,
    };
});

export default withAuthUser<ApplicationPageProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ApplicationPage);
