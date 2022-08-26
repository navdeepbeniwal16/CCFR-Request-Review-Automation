import { Grid } from '@mantine/core';
import {
    withAuthUser,
    withAuthUserSSR,
    AuthAction,
} from 'next-firebase-auth';


const Home = ({ userData }) => {
    return (
        <Grid grow gutter="sm">
            <Grid.Col span={4}>Hello</Grid.Col>
            <Grid.Col span={4}>Your email is {userData.email}.</Grid.Col>
            <Grid.Col span={4}>Your id is {userData.id}.</Grid.Col>
            <Grid.Col span={4}>4</Grid.Col>
            <Grid.Col span={4}>5</Grid.Col>
        </Grid>
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