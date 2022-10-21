import {
    Badge,
    Table,
    Button,
    Loader,
    Center,
    Text,
    Title,
    Stack,
} from '@mantine/core';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextTruncate from 'react-text-truncate';
import { Application } from '../lib/interfaces';
import {
    ApplicationReviewStatus,
    ApplicationStage,
    ApplicationStatus,
} from '../lib/utilities/AppEnums';
const Countdown = dynamic(() => import('react-countdown'), { ssr: false });

type ApplicationTableProps = {
    applications: Application[];
    fetchMoreData: () => void;
};

type ApplicationRowProps = {
    application: Application;
};

export default function ApplicationTable({
    applications,
    fetchMoreData,
}: ApplicationTableProps) {
    if (applications.length < 1) {
        return (
            <Center style={{ height: '90%' }}>
                <Stack align={'center'}>
                    <Image
                        width={256}
                        height={256}
                        src="/no_applications_found.jpg"
                        alt="No Applications Found"
                    />
                    <Title color={'dimmed'}>No Applications Found</Title>
                </Stack>
            </Center>
        );
    }
    return (
        <InfiniteScroll
            dataLength={applications.length}
            next={fetchMoreData}
            hasMore={applications.length > 9}
            loader={
                <Center>
                    <Loader variant="dots" size="lg" />
                </Center>
            }
        >
            <Table verticalSpacing="lg">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Title</th>
                        <th style={{ textAlign: 'center' }}>Category</th>
                        <th>Investigator</th>
                        <th>Institution</th>
                        <th style={{ textAlign: 'center' }}>Date Added</th>
                        <th style={{ textAlign: 'center' }}>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map(application => (
                        <ApplicationRow
                            key={application.id + Math.random().toString()}
                            application={application}
                        />
                    ))}
                </tbody>
            </Table>
        </InfiniteScroll>
    );
}

const getStatusCol = ({
    status,
    stage,
    steeringCommitteeReview,
}: Application) => {
    const statusColor: Map<Application['status'], string> = new Map([
        [ApplicationStatus.Accepted, 'green'],
        ['Approved' as ApplicationStatus, 'green'],
        [ApplicationStatus.Rejected, 'red'],
        [ApplicationStatus.Active, 'blue'],
    ]);

    let statusVO = status.toString();
    let stageVO = <>{stage ? stage.toString() : ''}</>;
    let statusColorVO = statusColor.get(status);

    if (stage == 'Draft') {
        statusVO = stage;
        statusColorVO = 'gray';
    } else if (stage == 'PMReview' || stage == 'BWGReview') {
        stageVO = <>In Review</>;
    } else if (
        stage == 'SCReview' &&
        steeringCommitteeReview?.reviewStartDate
    ) {
        const voteEndDate = new Date(steeringCommitteeReview.reviewStartDate);
        voteEndDate.setDate(voteEndDate.getDate() + 14);
        stageVO = <Countdown date={voteEndDate} />;
        statusColorVO = 'yellow';
        statusVO =
            'Voting • ' +
            (steeringCommitteeReview.reviewers?.filter(
                review => review.status != ApplicationReviewStatus.In_Review,
            ).length || 0) +
            '/' +
            (steeringCommitteeReview.reviewers?.length || 0);
    }

    return (
        <>
            <Badge color={statusColorVO}>{statusVO}</Badge>
            {status == 'Active' && stage != 'Draft' && (
                <Text size={'xs'} color={'gray.6'}>
                    {stageVO}
                </Text>
            )}
        </>
    );
};

function getCategory(
    application: Application,
): [category: string, categoryColor: string] {
    if (application.biospecimenRequired && application.dataRequired) {
        return ['Biospec & Data', 'violet'];
    } else if (application.biospecimenRequired && !application.dataRequired) {
        return ['Biospec Only', 'pink'];
    } else {
        return ['Data Only', 'orange'];
    }
}

function ApplicationRow({ application }: ApplicationRowProps) {
    return (
        <tr>
            <td>
                <TextTruncate line={2} text={application.title} />
            </td>
            <td style={{ textAlign: 'center' }}>
                <Badge color={getCategory(application)[1]} variant="outline">
                    {getCategory(application)[0]}
                </Badge>
            </td>
            <td>{application.institutionPrimary?.investigator}</td>
            <td>
                <TextTruncate
                    line={2}
                    text={application.institutionPrimary?.institution}
                />
            </td>
            <td style={{ textAlign: 'center' }}>
                {new Date(application.createdAt)
                    .toLocaleString('en-GB')
                    .slice(0, 10)}
            </td>
            <td style={{ textAlign: 'center' }}>{getStatusCol(application)}</td>
            <td>
                <Link
                    href={
                        application.stage == ApplicationStage.Draft
                            ? {
                                  pathname: '/applications/new',
                                  query: { id: application.id },
                              }
                            : '/applications/' + application.id
                    }
                    passHref
                >
                    <Button component="a" variant="subtle">
                        {application.stage == ApplicationStage.Draft
                            ? 'Continue'
                            : 'Details'}
                    </Button>
                </Link>
            </td>
        </tr>
    );
}
