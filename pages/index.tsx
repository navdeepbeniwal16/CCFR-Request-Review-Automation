import { Container, Grid, SimpleGrid, Skeleton } from '@mantine/core';
import { NextPage } from 'next';
import {
    withAuthUser,
    AuthAction,
    withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';

type HomePageProps = {
    email: string
}

const HomePage: NextPage<HomePageProps> = ({ email }) => {
    return (
        <Container m="md" p="md" fluid style={{ height: "100%", margin: 0 }}>
            <Head><title>Dashboard | CCFR Portal</title></Head>
            <SimpleGrid cols={2} spacing="xl" style={{ height: "100%" }}>
                <Skeleton height="100%" radius="md" animate={false} />
                <Grid gutter="xl">
                    <Grid.Col>
                        <Skeleton height="100%" radius="md" animate={false} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Skeleton height="100%" radius="md" animate={false} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Skeleton height="100%" radius="md" animate={false} />
                    </Grid.Col>
                </Grid>
            </SimpleGrid>
        </Container>
    );
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
    const _props: HomePageProps = {
        email: AuthUser.email || ""
    }

    return {
        props: _props,
    }
})

export default withAuthUser<HomePageProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(HomePage)