import { createStyles, Navbar, Group, Badge } from '@mantine/core';
import {
    IconHome,
    IconUserCircle,
    IconLogout,
    IconUsers,
    IconFiles,
    IconMessages,
} from '@tabler/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logoutUser } from '../lib/user';

const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef('icon');
    return {
        navbar: {
            backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
                .background,
        },

        version: {
            backgroundColor: theme.fn.lighten(
                theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
                0.1
            ),
            color: theme.white,
            fontWeight: 700,
        },

        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${theme.fn.lighten(
                theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
                0.1
            )}`,
            'div > *': {
                color: theme.white,
                margin: 0,
                lineHeight: 1.3,
            },

            'p': {
                fontSize: '0.8rem',
            }
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${theme.fn.lighten(
                theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
                0.1
            )}`,
        },

        link: {
            ...theme.fn.focusStyles(),
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            fontSize: theme.fontSizes.sm,
            color: theme.white,
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            borderRadius: theme.radius.sm,
            fontWeight: 500,
            cursor: 'pointer',

            '&:hover': {
                backgroundColor: theme.fn.lighten(
                    theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
                    0.1
                ),
            },
        },

        linkInner: {
            display: 'flex',
            alignItems: 'center',
            flex: 1,
        },

        linkIcon: {
            ref: icon,
            color: theme.white,
            opacity: 0.75,
            marginRight: theme.spacing.sm,
        },

        linkActive: {
            '&, &:hover': {
                backgroundColor: theme.fn.lighten(
                    theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
                    0.15
                ),
                [`& .${icon}`]: {
                    opacity: 0.9,
                },
            },
        },

        mainLinkBadge: {
            padding: 0,
            marginTop: 2,
            width: 20,
            height: 20,
            pointerEvents: 'none',
            backgroundColor: theme.colors['ccfr-green'][4]
        },
    };
});

const data = [
    { link: '/', label: 'Dashboard', icon: IconHome, notif: 0 },
    { link: '/applications', label: 'Applications', icon: IconFiles, notif: 3 },
    { link: '/accounts', label: 'Accounts', icon: IconUsers, notif: 0 },
    { link: '/messages', label: 'Messages', icon: IconMessages, notif: 2 },
];

export default function CCFRNavbar() {
    const { classes, cx } = useStyles();
    const router = useRouter();

    const links = data.map((item) => (
        <Link href={item.link} key={item.label}>
            <a className={cx(classes.link, { [classes.linkActive]: item.link === router.asPath })}>
                <div className={classes.linkInner}>
                    <item.icon className={classes.linkIcon} stroke={1.5} />
                    <span>{item.label}</span>
                </div>
                {item.notif != 0 && (
                    <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
                        {item.notif}
                    </Badge>
                )}
            </a>
        </Link >
    ));

    return (
        <Navbar height="100%" width={{ sm: 300 }} p="md" className={classes.navbar}>
            <Navbar.Section grow>
                <Group className={classes.header}>
                    <Image width={64} height={64} src="/ccfr_logo.png" />
                    <div>
                        <h3>Colon Cancer <br /> Family Registry</h3>
                        <p>Application Portal</p>
                    </div>
                </Group>
                {links}
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <Link href="/profile">
                    <a className={cx(classes.link, classes.button)} onClick={(event) => event.preventDefault()}>
                        <IconUserCircle className={classes.linkIcon} stroke={1.5} />
                        <span>Edit Profile</span>
                    </a>
                </Link>

                <a
                    className={cx(classes.link, classes.button)}
                    onClick={() => logoutUser(() => router.push('/login'))}
                >
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                </a>
            </Navbar.Section>
        </Navbar >
    );
}