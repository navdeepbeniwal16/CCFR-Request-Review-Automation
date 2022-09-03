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

const ApplicationsPage = ({ title }) => {
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
                    />
                    <Link href="/applications/new" passHref>
                        <Button component='a' size='md'>Create New</Button>
                    </Link>
                </Group>

            </Grid>
            <ApplicationTable />
        </Container>
    )
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
    return {
        props: {
            title: query.type || null,
            email: AuthUser.email,
        },
    }
})

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ApplicationsPage)