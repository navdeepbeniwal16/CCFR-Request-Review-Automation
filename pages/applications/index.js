import { Container, Grid, TextInput } from '@mantine/core';
import {
    withAuthUser,
    AuthAction,
    withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import ApplicationTable from '../../components/ApplicationTable';
import { IconSearch } from '@tabler/icons';

const ApplicationsPage = ({ title }) => {
    const pageTitle = (title ? title.charAt(0).toUpperCase() + title.slice(1) : "All") + " Applications"

    return (
        <Container m="md" p="md" mt="0" fluid>
            <Head><title>{pageTitle}</title></Head>
            <Grid justify="space-between" align="center">
                <h1>{pageTitle}</h1>
                <TextInput
                    mt="1.25em"
                    placeholder="Search"
                    mb="md"
                    icon={<IconSearch size={14} stroke={1.5} />}
                />
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