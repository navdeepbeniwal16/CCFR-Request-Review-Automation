import { Container, Grid, TextInput, Group, Button } from '@mantine/core';
import { NextPage } from 'next';
import {
    withAuthUser,
    AuthAction,
    withAuthUserTokenSSR,
} from 'next-firebase-auth';

type ApplicationPageProps = {
    appId: string
}

const ApplicationPage: NextPage<ApplicationPageProps> = ({ appId }) => {
    return (
        <h1>{appId}</h1>
    )
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
    const appId: ApplicationPageProps['appId'] = query.appId?.toString() || ""

    const _props: ApplicationPageProps = {
        appId: appId
    }

    return {
        props: _props,
    }
})

export default withAuthUser<ApplicationPageProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ApplicationPage)