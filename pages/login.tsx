import { withAuthUser, AuthAction, withAuthUserSSR } from 'next-firebase-auth';
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
    Center,
    Box,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { loginUser, registerUser, sendPasswordResetLink } from '../lib/user';
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons';
import Head from 'next/head';
import Image from 'next/image';
import { showNotification } from '@mantine/notifications';

type AuthContainerProps = {
    toggleRegister?: (x: boolean) => void;
    toggleForgotPassword?: (x: boolean) => void;
};

const RegisterContainer = ({ toggleRegister }: AuthContainerProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setError(null);
    }, [email, password]);

    return (
        <Container size={460} py="15%">
            <Title align="center">Create New Account</Title>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                {error && (
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Login Failed!"
                        color="red"
                    >
                        {error}
                    </Alert>
                )}
                <TextInput
                    label="Email"
                    placeholder="Your email"
                    required
                    onChange={e => setEmail(e.target.value)}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    required
                    mt="md"
                    onChange={e => setPassword(e.target.value)}
                />
                <Group position="apart" mt="lg">
                    <Anchor color="dimmed" size="sm">
                        <Center
                            inline
                            onClick={() =>
                                toggleRegister && toggleRegister(false)
                            }
                        >
                            <IconArrowLeft size={12} stroke={1.5} />
                            <Box ml={5}>Back to login page</Box>
                        </Center>
                    </Anchor>
                    <Button
                        loading={loading}
                        onClick={() => {
                            setLoading(true);
                            registerUser(email, password).then(error => {
                                console.log(error);
                                if (error) {
                                    setError(error);
                                }
                                setLoading(false);
                            });
                        }}
                    >
                        Register
                    </Button>
                </Group>
            </Paper>
        </Container>
    );
};

const LoginContainer = ({
    toggleRegister,
    toggleForgotPassword,
}: AuthContainerProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setError(null);
    }, [email, password]);

    return (
        <Container size={420} py="5%">
            <Center mb={10}>
                <Image
                    src="/ccfr_logo.png"
                    width={128}
                    height={128}
                    alt="CCFR Logo"
                />
            </Center>
            <Title align="center">CCFR Portal</Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                {"Don't have an account yet? "}
                <Anchor
                    onClick={() => toggleRegister && toggleRegister(true)}
                    href="#"
                    size="sm"
                >
                    Create account
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {error && (
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Login Failed!"
                        color="red"
                    >
                        {error}
                    </Alert>
                )}
                <TextInput
                    label="Email"
                    placeholder="Your email"
                    required
                    onChange={e => setEmail(e.target.value)}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    required
                    mt="md"
                    onChange={e => setPassword(e.target.value)}
                />
                <Group position="apart" mt="md" align="right">
                    <Anchor
                        align="right"
                        onClick={() =>
                            toggleForgotPassword && toggleForgotPassword(true)
                        }
                        size="sm"
                    >
                        Forgot password?
                    </Anchor>
                </Group>
                <Button
                    fullWidth
                    mt="xl"
                    loading={loading}
                    onClick={() => {
                        setLoading(true);
                        loginUser(email, password).then(error => {
                            console.log(error);
                            if (error) {
                                setError(error);
                            }
                            setLoading(false);
                        });
                    }}
                >
                    Sign in
                </Button>
            </Paper>
        </Container>
    );
};

const ForgotPasswordContainer = ({
    toggleForgotPassword,
}: AuthContainerProps) => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    return (
        <Container size={460} py="15%">
            <Title align="center">Forgot your password?</Title>
            <Text color="dimmed" size="sm" align="center">
                Enter your email to get a reset link
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                <TextInput
                    onChange={e => setEmail(e.target.value)}
                    label="Your email"
                    placeholder="Your email"
                    required
                />
                <Group position="apart" mt="lg">
                    <Anchor color="dimmed" size="sm">
                        <Center
                            inline
                            onClick={() =>
                                toggleForgotPassword &&
                                toggleForgotPassword(false)
                            }
                        >
                            <IconArrowLeft size={12} stroke={1.5} />
                            <Box ml={5}>Back to login page</Box>
                        </Center>
                    </Anchor>
                    <Button
                        disabled={sent}
                        onClick={() => {
                            sendPasswordResetLink(email).then(() => {
                                setSent(true);
                            });
                        }}
                    >
                        {sent ? 'Email sent' : 'Reset password'}
                    </Button>
                </Group>
            </Paper>
        </Container>
    );
};

const LoginPage = () => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const title = showForgotPassword
        ? 'Password Reset'
        : 'Login' + ' | CCFR Portal';

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            {showForgotPassword && (
                <ForgotPasswordContainer
                    toggleForgotPassword={setShowForgotPassword}
                />
            )}
            {showRegister && (
                <RegisterContainer toggleRegister={setShowRegister} />
            )}
            {!(showRegister || showForgotPassword) && (
                <LoginContainer
                    toggleRegister={setShowRegister}
                    toggleForgotPassword={setShowForgotPassword}
                />
            )}
        </>
    );
};
export const getServerSideProps = withAuthUserSSR({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
})();

export default withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
})(LoginPage);
