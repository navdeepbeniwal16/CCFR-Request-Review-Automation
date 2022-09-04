import { Badge, Table, Button, Loader, Center } from '@mantine/core';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextTruncate from 'react-text-truncate';
import PropTypes from 'prop-types'

const statusColor = {
    "approved": "green",
    "rejected": "red",
    "active": "blue",
    "inactive": "gray"
}

const categoryColor = {
    "Data Only": "orange",
    "Biospec & Data": "violet"
}

export default function ApplicationTable({ applications, fetchMoreData }) {
    const rows = applications.map((application) => (
        <tr key={application.title + Math.random()}>
            <td><TextTruncate line={2} text={application.title} /></td>
            <td>
                <Badge color={categoryColor[application.category]} variant="outline">
                    {application.category}
                </Badge>
            </td>
            <td>{application.investigator}</td>
            <td><TextTruncate line={2} text={application.institution} /></td>
            <td>
                <Badge color={statusColor[application.status]}>
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

ApplicationTable.propTypes = {
    applications: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        institution: PropTypes.string,
        category: PropTypes.string,
        investigator: PropTypes.string,
        status: PropTypes.string,
    })).isRequired,
    fetchMoreData: PropTypes.func.isRequired
}