import { Container, Grid, TextInput, Group, Button } from '@mantine/core';
import {
    withAuthUser,
    AuthAction,
    withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import ApplicationTable from '../../components/ApplicationTable';
import { IconSearch } from '@tabler/icons';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

const ApplicationsPage = ({ title, applications }) => {
    const router = useRouter()
    const [apps, setApps] = useState(applications)
    const pageTitle = (title ? title.charAt(0).toUpperCase() + title.slice(1) : "All") + " Applications"

    return (
        <Container m="md" p="md" mt="0" fluid>
            <Head><title>{pageTitle}</title></Head>
            <Grid justify="space-between" align="center">
                <h1>{pageTitle}</h1>
                <Group>
                    <TextInput
                        icon={<IconSearch size={18} stroke={1.5} />}
                        size="md"
                        placeholder="Search for applications"
                        rightSectionWidth={42}
                        onKeyDown={(e) => (e.key === 'Enter' && e.target.value)
                            ? router.push('/applications?s=' + e.target.value)
                            : null
                        }
                    />
                    <Link href="/applications/new" passHref>
                        <Button component='a' size='md'>Create New</Button>
                    </Link>
                </Group>

            </Grid>
            <ApplicationTable
                applications={apps}
                fetchMoreData={() => {
                    setTimeout(() => {
                        setApps(apps.concat(data))
                    }, 1500);
                }}
            />
        </Container>
    )
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
    return {
        props: {
            title: query.type || null,
            applications: data,
        },
    }
})

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ApplicationsPage)

const data = [
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Impact of Inflammatory Bowel Disease on CRC Mortality.",
        institution: "University of Melbourne",
        category: "Data Only",
        investigator: 'Scott Adams',
        status: 'active'
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Family History Characteristics in the Colon CFRs.",
        institution: "Royal Melbourne Institute of Technology",
        category: "Data Only",
        investigator: 'Dennis Ahnen',
        status: 'approved'
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Promoting Colon Cancer Screening Among Genetically Defined High-Risk Populations Within the Cooperative Family Registry for Colon Cancer Studies (CFRCCS).",
        institution: "Monash University",
        category: "Data Only",
        investigator: 'Dennis Ahnen',
        status: 'rejected'
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Colorectal Screening Practices in Members of High Risk Families.",
        institution: "University of Melbourne",
        category: "Data Only",
        investigator: 'John Smith',
        status: 'active'
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Molecular Identification of Lynch Syndrome.",
        institution: "Royal Melbourne Institute of Technology",
        category: "Data Only",
        investigator: 'Mary Jones',
        status: 'active'
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Social determinants of colorectal cancer screening, treatment and outcomes in the Colon-CFR.",
        institution: "Monash University",
        category: "Biospec & Data",
        investigator: 'Irene Clarke',
        status: 'approved'
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Collaboration with OFBCR on the BRIDGES Project.",
        institution: "University of Melbourne",
        category: "Data Only",
        investigator: 'Yoland Intil',
        status: 'approved'
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Studies into Gynecological Cancers Associated with the Syndrome: Hereditary Nonpolyposis Colon Cancer.",
        institution: "Monash University",
        category: "Data Only",
        investigator: 'Sam Yard',
        status: 'active'
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Validation of a novel MSI panel.",
        institution: "Royal Melbourne Institute of Technology",
        category: "Biospec & Data",
        investigator: 'Jeff Bacher',
        status: 'inactive'
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Colorectal Cancer Screening in Australia.",
        institution: "University of Melbourne",
        category: "Data Only",
        investigator: 'Dris Oakrim',
        status: 'rejected'
    },
];