import {
    Group,
    Tabs,
    Text,
    Stack,
    Box,
    LoadingOverlay,
    Modal,
} from '@mantine/core';
import { IconFile, IconHistory } from '@tabler/icons';
import { NextPage } from 'next';
import {
    withAuthUser,
    AuthAction,
    withAuthUserTokenSSR,
    getFirebaseAdmin,
    useAuthUser,
} from 'next-firebase-auth';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import ApplicationStepper from '../../components/ApplicationStepper';
import ApplicationForm from '../../components/Form';
import VotingTable from '../../components/VotingTable';
import {
    getApplicationById,
    getExistingCCFRSiteData,
    isApplicationEmpty,
} from '../../lib/application';
import { Application, Collaborator } from '../../lib/interfaces';
import { BWGForm } from '../../components/BwgForm';
import { ApplicationStage, UserRole } from '../../lib/utilities/AppEnums';
import { convertApplicationTimestamp } from '../../lib/utilities/applicationDateParsers';
const Countdown = dynamic(() => import('react-countdown'), { ssr: false });
import firebase from 'firebase';
import 'firebase/firestore';
import { useRouter } from 'next/router';
import {
    PIActionButton,
    CompletedActionButton,
    PMActionButton,
    SCActionButton,
    BWGActionButton,
} from '../../components/ActionButtons';
import { getUsersByRoleAsAdmin } from '../../lib/user';
import { UserRecord } from 'firebase-admin/auth';

type ApplicationPageProps = {
    userRole: UserRole;
    application: Application;
    ccfrPeople: Collaborator[];
    steeringCommittee: UserRecord[];
};

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
    userRole,
    application,
    ccfrPeople,
}) => {
    const [isModalOpen, setIsModalOpened] = useState(false);
    const handleSetModalOpen = () => {
        setIsModalOpened(true);
    };
    const user = useAuthUser();
    const router = useRouter();
    const [db, setDB] = useState<FirebaseFirestore.Firestore>();

    useEffect(
        () =>
            setDB(
                firebase.firestore() as unknown as FirebaseFirestore.Firestore,
            ),
        [],
    );

    const getActionButtons = (role: UserRole, handleSetModalOpen: Function) => {
        if (!db) return;
        let ActionButton = null;
        if (application.stage == ApplicationStage.Complete) {
            ActionButton = CompletedActionButton;
        } else if (user.email == application.email) {
            ActionButton = PIActionButton;
        } else if (
            role == UserRole.PROGRAM_MANAGER &&
            application.stage == ApplicationStage.PMReview
        ) {
            ActionButton = PMActionButton;
        } else if (
            role == UserRole.SC_MEMBER &&
            application.stage == ApplicationStage.SCReview
        ) {
            ActionButton = SCActionButton;
        } else if (
            role == UserRole.BGW_CHAIR &&
            application.stage == ApplicationStage.BWGReview
        ) {
            ActionButton = BWGActionButton;
        }
        if (ActionButton) {
            return (
                <ActionButton
                    db={db}
                    application={application}
                    router={router}
                    onClick={() => handleSetModalOpen(true)}
                    user={user}
                />
            );
        }
    };

    return (
        <Tabs defaultValue="application" style={{ height: '100%' }} mt={-10}>
            <Tabs.List>
                <Group grow style={{ width: '100%' }}>
                    {tabGroups}
                    {getActionButtons(userRole, handleSetModalOpen)}
                </Group>
            </Tabs.List>

            <Tabs.Panel value="application" pt="xs">
                <Modal
                    title={<h1>BWG Form</h1>}
                    size="75%"
                    opened={isModalOpen}
                    onClose={() => setIsModalOpened(false)}
                >
                    <BWGForm
                        application={application}
                        readOnly={false}
                        setModal={handleSetModalOpen}
                    />
                </Modal>
                <ApplicationForm
                    application={application}
                    ccfrPeople={ccfrPeople}
                    readOnly={true}
                />

                {application.biospecimenForm && (
                    <Box sx={{ maxWidth: 1100 }} mx="auto">
                        <h1>BWG Form</h1>
                        <BWGForm
                            application={application}
                            readOnly={true}
                            setModal={handleSetModalOpen}
                        />
                    </Box>
                )}
            </Tabs.Panel>

            <Tabs.Panel
                value="track"
                pt="xs"
                style={{ height: 'calc(100% - 50px)' }}
            >
                <Group style={{ height: 'calc(100% - 50px)' }}>
                    <Stack
                        style={{ flexGrow: 1, height: '100%' }}
                        mx={20}
                        py={20}
                    >
                        <ApplicationStepper application={application} />
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
                            <VotingTable
                                voteData={
                                    application.steeringCommitteeReview
                                        ?.reviewers || []
                                }
                            />
                        </Box>
                    </Stack>
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
    const steeringCommittee = await getUsersByRoleAsAdmin(UserRole.SC_MEMBER);

    if (isApplicationEmpty(application)) {
        return {
            notFound: true,
        };
    }

    const _props: ApplicationPageProps = {
        userRole: (AuthUser.claims.role as UserRole) || null,
        application: convertApplicationTimestamp(application),
        ccfrPeople: ccfrPeople.map(p => ({
            centerNumber: parseInt(p.centerNumber),
            ccfrSite: p.siteName,
            sitePIName: p.pIName,
            sitePIDegree: p.pIDegree,
        })),
        steeringCommittee: steeringCommittee,
    };

    return {
        props: _props,
    };
});

export default withAuthUser<ApplicationPageProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ApplicationPage);
