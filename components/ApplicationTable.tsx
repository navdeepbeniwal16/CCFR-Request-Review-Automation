import { Badge, Table, Button, Loader, Center } from '@mantine/core';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextTruncate from 'react-text-truncate';
import { Application } from '../lib/interfaces';

const statusColor: Map<string, string> = new Map([
    ["approved", "green"],
    ["rejected", "red"],
    ["active", "blue"],
    ["inactive", "gray"]
])

type ApplicationTableProps = {
    applications: Application[],
    fetchMoreData: () => void
}

function getCategory(application: Application): [category: string, categoryColor: string] {
    if (application.biospecimenRequired && application.dataRequired) {
        return ["Biospec & Data", "violet"]
    } else {
        return ["Data Only", "orange"]
    }
}

export default function ApplicationTable({ applications, fetchMoreData }: ApplicationTableProps) {
    const rows = applications.map((application) => (
        <tr key={application.title || "" + Math.random()}>
            <td><TextTruncate line={2} text={application.title} /></td>
            <td>
                <Badge color={getCategory(application)[1]} variant="outline">
                    {getCategory(application)[0]}
                </Badge>
            </td>
            <td>{application.institutionPrimary?.investigator}</td>
            <td><TextTruncate line={2} text={application.institutionPrimary?.institution} /></td>
            <td>
                <Badge color={statusColor.get(application.status || "")}>
                    {application.status}
                </Badge>
            </td>
            <td>
                <Link href={"/applications/" + application.id} passHref>
                    <Button component='a' variant='subtle'>Details</Button>
                </Link>
            </td>
        </tr>
    ));

    return (
        <InfiniteScroll
            dataLength={rows.length}
            next={fetchMoreData}
            hasMore={true}
            loader={<Center><Loader variant='dots' size='lg' /></Center>}
            endMessage={<p>End of list</p>}
        >
            <Table verticalSpacing="lg">
                <thead>
                    <tr>
                        <th style={{ width: "40%" }}>Title</th>
                        <th>Category</th>
                        <th>Investigator</th>
                        <th>Institution</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        </InfiniteScroll >
    )
}