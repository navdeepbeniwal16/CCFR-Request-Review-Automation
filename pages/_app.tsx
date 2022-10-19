import { AppShell, MantineProvider } from '@mantine/core';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import RouterTransition from '../components/RouterTransition';
import initAuth from '../lib/initAuth';
import { styleCache } from '../lib/styleCache';
import favicon from '../public/favicon.ico';
import { NotificationsProvider } from '@mantine/notifications';

initAuth();

function MyApp({ Component, pageProps, ...appProps }: AppProps) {

    const getContent = () => {
        if (['/login', '/_error'].includes(appProps.router.pathname))
            return <Component {...pageProps} />;
        return (
            <AppShell
                padding="md"
                navbar={<Navbar />}
            >
                <Component {...pageProps} />
            </AppShell>
        );
    };

    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            emotionCache={styleCache}
            theme={{
                colors: {
                    "ccfr-dark-blue": ['#e9f2ff', '#c9d6e9', '#a9bad5', '#889fc3', '#6784b1', '#4e6a98', '#3c5277', '#2a3b56', '#172336', '#040c18'], // use 6
                    "ccfr-light-blue": ['#e3f4ff', '#c0dbf1', '#9bc2e3', '#75aad7', '#5092ca', '#3778b2', '#2a5e8b', '#1c4364', '#0d283e', '#000e1a'], // use 2
                    "ccfr-green": ['#e6f8f1', '#cee1da', '#b3cbc4', '#96b6ac', '#79a194', '#60887a', '#49695f', '#334b44', '#1b2e29', '#00120e'] // use 3
                },
                primaryColor: "ccfr-dark-blue"
            }}
        >
             <NotificationsProvider>
                <RouterTransition />
                <Head>
                    <title>CCFR Portal</title>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                    <link rel="shortcut icon" href={favicon.src} type="image/x-icon" />
                </Head>
                {getContent()}
             </NotificationsProvider>
        </MantineProvider>
    );
}

export default MyApp
