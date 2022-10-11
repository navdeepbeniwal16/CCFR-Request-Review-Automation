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
import { NextPage } from 'next';
import { Application } from '../../lib/interfaces';

type ApplicationsPageProps = {
    title: string | null
    applications: Application[]
}

const ApplicationsPage: NextPage<ApplicationsPageProps> = ({ title, applications }) => {
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
                        onKeyDown={(e) => (e.key === 'Enter' && (e.target as HTMLInputElement).value)
                            ? router.push('/applications?s=' + (e.target as HTMLInputElement).value)
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
    const appType: ApplicationsPageProps['title'] = query.type?.toString() || null

    const _props: ApplicationsPageProps = {
        title: appType,
        applications: data,
    }

    return {
        props: _props,
    }
})

export default withAuthUser<ApplicationsPageProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ApplicationsPage)

const data: Application[] = [
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Impact of Inflammatory Bowel Disease on CRC Mortality.",
        institutionPrimary: {
            investigator: 'Scott Adams',
            institution: "University of Melbourne",
        },
        dataRequired: [{
            name: "test",
            type: "test",
            quantity: 10,
            numSamples: 1,
        }],
        status: 'active',
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Family History Characteristics in the Colon CFRs.",
        institutionPrimary: {
            investigator: 'Dennis Ahnen',
            institution: "Royal Melbourne Institute of Technology",
        },
        dataRequired: [{
            name: "test",
            type: "test",
            quantity: 10,
            numSamples: 1,
        }],
        status: 'approved',
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Promoting Colon Cancer Screening Among Genetically Defined High-Risk Populations Within the Cooperative Family Registry for Colon Cancer Studies (CFRCCS).",
        institutionPrimary: {
            investigator: 'Dennis Ahnen',
            institution: "Monash University",
        },
        dataRequired: [{
            name: "test",
            type: "test",
            quantity: 10,
            numSamples: 1,
        }],
        status: 'rejected',
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Colorectal Screening Practices in Members of High Risk Families.",
        institutionPrimary: {
            investigator: 'John Smith',
            institution: "University of Melbourne",
        },
        dataRequired: [{
            name: "test",
            type: "test",
            quantity: 10,
            numSamples: 1,
        }],
        status: 'active',
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Molecular Identification of Lynch Syndrome.",
        institutionPrimary: {
            investigator: 'Mary Jones',
            institution: "Royal Melbourne Institute of Technology",
        },
        dataRequired: [{
            name: "test",
            type: "test",
            quantity: 10,
            numSamples: 1,
        }],
        status: 'active',
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Social determinants of colorectal cancer screening, treatment and outcomes in the Colon-CFR.",
        institutionPrimary: {
            investigator: 'Irene Clarke',
            institution: "Monash University",
        },
        dataRequired: [{
            name: "test",
            type: "test",
            quantity: 10,
            numSamples: 1,
        }],
        biospecimenRequired: [{
            name: "test",
            type: "test",
            quantity: 10,
            numSamples: 1,
        }],
        status: 'approved',
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Collaboration with OFBCR on the BRIDGES Project.",
        institutionPrimary: {
            investigator: 'Yoland Intil',
            institution: "University of Melbourne",
        },
        dataRequired: [{
            name: "test",
            type: "test",
            quantity: 10,
            numSamples: 1,
        }],
        status: 'approved',
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Studies into Gynecological Cancers Associated with the Syndrome: Hereditary Nonpolyposis Colon Cancer.",
        institutionPrimary: {
            investigator: 'Sam Yard',
            institution: "Monash University",
        },
        dataRequired: [{
            name: "test",
            type: "test",
            quantity: 10,
            numSamples: 1,
        }],
        status: 'active',
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Validation of a novel MSI panel.",
        institutionPrimary: {
            investigator: 'Jeff Bacher',
            institution: "Royal Melbourne Institute of Technology",
        },
        dataRequired: [{
            name: "test",
            type: "test",
            quantity: 10,
            numSamples: 1,
        }],
        biospecimenRequired: [{
            name: "test",
            type: "test",
            quantity: 10,
            numSamples: 1,
        }],
        status: 'inactive',
    },
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Colorectal Cancer Screening in Australia.",
        institutionPrimary: {
            investigator: 'Dris Oakrim',
            institution: "University of Melbourne",
        },
        dataRequired: [{
            name: "test",
            type: "test",
            quantity: 10,
            numSamples: 1,
        }],
        status: 'rejected',
    },
];