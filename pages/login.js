import {
    withAuthUser,
    AuthAction,
} from 'next-firebase-auth';
import Loader from '../components/Loader';
import {
    Container,
    Title,
    Paper,
    Text,
    Group,
    Anchor,
    TextInput,
    PasswordInput,
    Button,
    Alert,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { loginUser } from '../lib/user';
import { IconAlertCircle } from '@tabler/icons';

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setError(null)
    }, [email, password])

    return (
        <Container size={420} py="10%">
            <Title align="center">
                CCFR Portal
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                Do not have an account yet?{' '}
                <Anchor href="#" size="sm" onClick={(event) => event.preventDefault()}>
                    Create account
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {error && <Alert icon={<IconAlertCircle size={16} />} title="Login Failed!" color="red">
                    {error}
                </Alert>}
                <TextInput
                    label="Email"
                    placeholder="Your email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    required mt="md"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Group position="apart" mt="md" align="right">
                    <Anchor align='right' onClick={(event) => event.preventDefault()} href="#" size="sm">
                        Forgot password?
                    </Anchor>
                </Group>
                <Button fullWidth mt="xl" loading={loading} onClick={() => {
                    setLoading(true)
                    loginUser(email, password).then((error) => {
                        if (error) {
                            setError(error.message)
                        }
                        setLoading(false)
                    })
                }}>
                    Sign in
                </Button>
            </Paper>
        </Container>
    )
}

export default withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenAuthedBeforeRedirect: AuthAction.SHOW_LOADER,
    LoaderComponent: Loader,
})(LoginPage)
