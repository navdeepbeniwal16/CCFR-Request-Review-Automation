import { AppShell, Navbar, MantineProvider, Button } from '@mantine/core';
import { IconUserCircle, IconLogout } from '@tabler/icons'
import { useRouter } from 'next/router';
import initAuth from '../lib/initAuth';
import { logoutUser } from '../lib/user';


initAuth();

function MyApp({ Component, pageProps, ...appProps }) {
    const router = useRouter()

    const getContent = () => {
        if ([`/login`].includes(appProps.router.pathname))
            return <Component {...pageProps} />;

        return (
            <AppShell
                padding="md"
                navbar={
                    <Navbar width={{ base: 300 }} height="100%" p="xs">
                        <Navbar.Section>Title</Navbar.Section>
                        <Navbar.Section grow>Nav Links</Navbar.Section>
                        <Navbar.Section>
                            <Button
                                leftIcon={<IconUserCircle stroke={1.5} />}
                                variant="subtle"
                                fullWidth
                            >
                                Profile
                            </Button>
                            <Button
                                onClick={() => logoutUser(() => router.push('/login'))}
                                leftIcon={<IconLogout stroke={1.5} />}
                                variant="subtle"
                                fullWidth
                            >
                                Logout
                            </Button>
                        </Navbar.Section>
                    </Navbar>
                }
            >
                <Component {...pageProps} />
            </AppShell>
        );
    };

    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
        >
            {getContent()}
        </MantineProvider>
    );
}

export default MyApp
