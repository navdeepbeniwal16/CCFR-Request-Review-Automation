import { Badge, Table, Button, Loader, Center } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextTruncate from 'react-text-truncate';

const data = [
    {
        id: Math.random() * 10000,
        title: "Impact of Inflammatory Bowel Disease on CRC Mortality.",
        institution: "University of Melbourne",
        category: "Data Only",
        investigator: 'Scott Adams',
        status: 'active'
    },
    {
        id: Math.random() * 10000,
        title: "Family History Characteristics in the Colon CFRs.",
        institution: "Royal Melbourne Institute of Technology",
        category: "Data Only",
        investigator: 'Dennis Ahnen',
        status: 'approved'
    },
    {
        id: Math.random() * 10000,
        title: "Promoting Colon Cancer Screening Among Genetically Defined High-Risk Populations Within the Cooperative Family Registry for Colon Cancer Studies (CFRCCS).",
        institution: "Monash University",
        category: "Data Only",
        investigator: 'Dennis Ahnen',
        status: 'rejected'
    },
    {
        id: Math.random() * 10000,
        title: "Colorectal Screening Practices in Members of High Risk Families.",
        institution: "University of Melbourne",
        category: "Data Only",
        investigator: 'John Smith',
        status: 'active'
    },
    {
        id: Math.random() * 10000,
        title: "Molecular Identification of Lynch Syndrome.",
        institution: "Royal Melbourne Institute of Technology",
        category: "Data Only",
        investigator: 'Mary Jones',
        status: 'active'
    },
    {
        id: Math.random() * 10000,
        title: "Social determinants of colorectal cancer screening, treatment and outcomes in the Colon-CFR.",
        institution: "Monash University",
        category: "Biospec & Data",
        investigator: 'Irene Clarke',
        status: 'approved'
    },
    {
        id: Math.random() * 10000,
        title: "Collaboration with OFBCR on the BRIDGES Project.",
        institution: "University of Melbourne",
        category: "Data Only",
        investigator: 'Yoland Intil',
        status: 'approved'
    },
    {
        id: Math.random() * 10000,
        title: "Studies into Gynecological Cancers Associated with the Syndrome: Hereditary Nonpolyposis Colon Cancer.",
        institution: "Monash University",
        category: "Data Only",
        investigator: 'Sam Yard',
        status: 'active'
    },
    {
        id: Math.random() * 10000,
        title: "Validation of a novel MSI panel.",
        institution: "Royal Melbourne Institute of Technology",
        category: "Biospec & Data",
        investigator: 'Jeff Bacher',
        status: 'inactive'
    },
    {
        id: Math.random() * 10000,
        title: "Colorectal Cancer Screening in Australia.",
        institution: "University of Melbourne",
        category: "Data Only",
        investigator: 'Dris Oakrim',
        status: 'rejected'
    },
];

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

export default function ApplicationTable() {
    const [applications, setApplications] = useState(data)

    const fetchMoreData = () => {
        setTimeout(() => {
            setApplications(applications.concat(data))
        }, 1500);
    }

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