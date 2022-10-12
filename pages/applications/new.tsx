import { Container, Grid, TextInput, Group, Button } from '@mantine/core';
import {
    withAuthUser,
    AuthAction,
    withAuthUserTokenSSR,
} from 'next-firebase-auth';
import { Form } from '../../components/Form';


const NewApplicationPage = () => {
    return (
        <>
            <h1>New Application</h1>
            <Form></Form>
        </>
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
})(NewApplicationPage)