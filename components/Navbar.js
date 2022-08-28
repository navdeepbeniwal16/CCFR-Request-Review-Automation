import { createStyles, Navbar, Group, Badge, NavLink } from '@mantine/core';
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
import { useState } from 'react';
import { logoutUser } from '../lib/user';

const useStyles = createStyles((theme) => {
    return {
        navbar: {
            backgroundColor: theme.fn.primaryColor(),
        },

        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${theme.fn.lighten(theme.fn.primaryColor(), 0.1)}`,
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
            borderTop: `1px solid ${theme.fn.lighten(theme.fn.primaryColor(), 0.1)}`,
        },

        navLinkBadge: {
            padding: 0,
            marginTop: 2,
            width: 20,
            height: 20,
            pointerEvents: 'none',
            backgroundColor: theme.colors['ccfr-green'][4]
        },

        navLink: {
            borderRadius: theme.radius.sm,
            color: theme.white,
            fontWeight: 500,
            textDecoration: 'none',
            fontSize: theme.fontSizes.sm,
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            '& svg': {
                opacity: 0.75,
            },

            '&[data-active=true], &[data-active=true]:hover': {
                color: theme.white,
                backgroundColor: theme.fn.lighten(
                    theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
                    0.15
                ),

                '& svg': {
                    opacity: 0.9,
                }
            },

            '&:hover': {
                backgroundColor: theme.fn.lighten(
                    theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
                    0.1
                ),
            },
        },
    };
});

const data = [
    {
        link: '/', label: 'Dashboard', icon: IconHome
    },
    {
        link: '/applications', label: 'Applications', icon: IconFiles, children: [
            { link: '', label: 'All Applications' },
            { link: '?type=personal', label: 'My Applications' },
            { link: '?type=active', label: 'Active Applications', notif: 3 },
            { link: '?type=approved', label: 'Approved Applications' },
            { link: '?type=rejected', label: 'Rejected Applications' },
            { link: '?type=inactve', label: 'Inactive Applications' },
        ]
    },
    {
        link: '/accounts', label: 'Accounts', icon: IconUsers, children: [
            { link: '', label: 'All Accounts' },
            { link: '?type=external', label: 'External Users' },
            { link: '?type=internal', label: 'Internal Users' },
            { link: '?type=committee', label: 'Streeing Committee' },
            { link: '?type=admin', label: 'Admins' },
            { link: '?type=bwg', label: 'BWG Chair' },
        ]
    },
    {
        link: '/messages', label: 'Messages', icon: IconMessages, children: [
            { link: '', label: 'All Messages' },
            { link: '?status=unread', label: 'Unread Messages', notif: 3 },
            { link: '?type=user', label: 'User Messages' },
            { link: '?type=system', label: 'Notifications' },
        ]
    },
];

export default function CCFRNavbar() {
    const { classes, cx } = useStyles();
    const router = useRouter();
    const [expanded, setExpanded] = useState(null)

    const links = data.map((item) => (
        <Link href={item.link} key={item.label} passHref>
            <NavLink
                classNames={{ root: classes.navLink }}
                icon={<item.icon stroke={1.5} />}
                component='a'
                label={item.label}
                active={item.link === router.asPath && !item.children}
                color="white"
                opened={expanded === item.label}
                onChange={(opened) => opened ? setExpanded(item.label) : setExpanded(null)}
            >
                {item.children && item.children.map((child) => (
                    <Link href={item.link + child.link} key={child.label} passHref>
                        <NavLink
                            classNames={{ root: classes.navLink }}
                            component='a'
                            label={child.label}
                            color="white"
                            active={item.link + child.link === router.asPath}
                            rightSection={child.notif && (
                                <Badge size="sm" variant="filled" className={classes.navLinkBadge}>
                                    {child.notif}
                                </Badge>
                            )}
                        />
                    </Link>
                ))}
            </NavLink>
        </Link>
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
                <Link href="/profile" passHref>
                    <NavLink
                        onClick={(event) => event.preventDefault()}
                        classNames={{ root: classes.navLink }}
                        icon={<IconUserCircle stroke={1.5} />}
                        component='a'
                        label="Edit Profile"
                        color="white"
                    />
                </Link>
                <NavLink
                    onClick={() => logoutUser(() => router.push('/login'))}
                    classNames={{ root: classes.navLink }}
                    icon={<IconLogout stroke={1.5} />}
                    component='a'
                    label="Logout"
                    color="white"
                />
            </Navbar.Section>
        </Navbar >
    );
}