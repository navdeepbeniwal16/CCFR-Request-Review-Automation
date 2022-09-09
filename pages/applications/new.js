import { Container, Grid, TextInput, Group, Button } from '@mantine/core';
import {
    withAuthUser,
    AuthAction,
    withAuthUserTokenSSR,
} from 'next-firebase-auth';

const ApplicationPage = ({ appId }) => {
    return (
        <h1>New Application</h1>
    )
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
    return {
        props: {
        },
    }
})

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ApplicationPage)