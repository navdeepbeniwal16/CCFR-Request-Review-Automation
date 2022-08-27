import { Container, Grid, SimpleGrid, Skeleton } from '@mantine/core';
import {
    withAuthUser,
    withAuthUserSSR,
    AuthAction,
} from 'next-firebase-auth';


const Home = ({ userData }) => {
    return (
        <Container m="md" p="md" fluid style={{ height: "100%", margin: 0 }}>
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

export const getServerSideProps = withAuthUserSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})(async ({ AuthUser }) => {
    return {
        props: {
            userData: {
                email: AuthUser.email,
                id: AuthUser.id,
            }
        }
    }
});

export default withAuthUser()(Home)