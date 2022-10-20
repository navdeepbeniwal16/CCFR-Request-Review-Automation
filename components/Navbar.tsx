import { createStyles, Navbar, Group, NavLink, Drawer } from '@mantine/core';
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
import { useEffect, useState } from 'react';
import { logoutUser } from '../lib/user';
import { UserRole } from '../lib/utilities/AppEnums';
import firebase from 'firebase/app';
import 'firebase/auth';
import Profile from './Profile';

const useStyles = createStyles(theme => {
    return {
        navbar: {
            backgroundColor: theme.fn.primaryColor(),
        },

        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${theme.fn.lighten(
                theme.fn.primaryColor(),
                0.1,
            )}`,
            'div > *': {
                color: theme.white,
                margin: 0,
                lineHeight: 1.3,
            },

            p: {
                fontSize: '0.8rem',
            },
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${theme.fn.lighten(
                theme.fn.primaryColor(),
                0.1,
            )}`,
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
                    theme.fn.variant({
                        variant: 'filled',
                        color: theme.primaryColor,
                    }).background,
                    0.15,
                ),

                '& svg': {
                    opacity: 0.9,
                },
            },

            '&:hover': {
                backgroundColor: theme.fn.lighten(
                    theme.fn.variant({
                        variant: 'filled',
                        color: theme.primaryColor,
                    }).background,
                    0.1,
                ),
            },
        },
    };
});

export default function CCFRNavbar() {
    const { classes, cx } = useStyles();
    const router = useRouter();
    const [expanded, setExpanded] = useState('');
    const [profileVisible, setProfileVisible] = useState(false);
    const [user, setUser] = useState<firebase.User>();
    const [role, setRole] = useState<UserRole>(UserRole.APPLICANT);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                setUser(user);
                user.getIdTokenResult().then(tokenId =>
                    setRole(tokenId.claims.role),
                );
            }
        });
    }, []);

    const data = [
        {
            link: '/',
            label: 'Home',
            icon: IconHome,
        },
        ...(role && role != UserRole.APPLICANT
            ? [
                  {
                      link: '/applications',
                      label: 'Applications',
                      icon: IconFiles,
                      children: [
                          { link: '', label: 'All Applications' },
                          { link: '?type=my', label: 'My Applications' },
                          {
                              link: '?type=active',
                              label: 'Active Applications',
                              notif: 3,
                          },
                          {
                              link: '?type=accepted',
                              label: 'Accepted Applications',
                          },
                          {
                              link: '?type=rejected',
                              label: 'Rejected Applications',
                          },
                      ],
                  },
              ]
            : []),
        ...(role == UserRole.ADMIN
            ? [
                  {
                      link: '/accounts',
                      label: 'Accounts',
                      icon: IconUsers,
                      children: [
                          { link: '', label: 'All Accounts' },
                          { link: '?type=external', label: 'External Users' },
                          { link: '?type=internal', label: 'Internal Users' },
                          {
                              link: '?type=committee',
                              label: 'Streeing Committee',
                          },
                          { link: '?type=pm', label: 'Program Manager' },
                          { link: '?type=bwg', label: 'BWG Chair' },
                      ],
                  },
              ]
            : []),
        /*{
            link: '/notifications',
            label: 'Notifications',
            icon: IconMessages,
            children: [
                { link: '?status=unread', label: 'Unread Notifications' },
                { link: '', label: 'All Notifications' },
            ],
        },*/
    ];

    const links = data.map(item => (
        <Link href={item.link} key={item.label} passHref>
            <NavLink
                classNames={{ root: classes.navLink }}
                icon={<item.icon stroke={1.5} />}
                component="a"
                label={item.label}
                active={item.link === router.asPath && !item.children}
                color="white"
                opened={expanded === item.label}
                onChange={opened =>
                    opened ? setExpanded(item.label) : setExpanded('')
                }
            >
                {item.children &&
                    item.children.map(child => (
                        <Link
                            href={item.link + child.link}
                            key={child.label}
                            passHref
                        >
                            <NavLink
                                classNames={{ root: classes.navLink }}
                                component="a"
                                label={child.label}
                                color="white"
                                active={
                                    item.link + child.link === router.asPath
                                }
                            />
                        </Link>
                    ))}
            </NavLink>
        </Link>
    ));

    return (
        <>
            <Drawer
                opened={profileVisible}
                onClose={() => setProfileVisible(false)}
                title="Edit Profile"
                padding="xl"
                size="md"
            >
                <Profile
                    displayName={user?.displayName || ''}
                    email={user?.email || ''}
                    role={role}
                />
            </Drawer>
            <Navbar
                height="100%"
                width={{ sm: 300 }}
                p="md"
                className={classes.navbar}
            >
                <Navbar.Section grow>
                    <Group className={classes.header}>
                        <Image
                            width={64}
                            height={64}
                            src="/ccfr_logo.png"
                            alt="CCFR Logo"
                        />
                        <div>
                            <h3>
                                Colon Cancer <br /> Family Registry
                            </h3>
                            <p>Application Portal</p>
                        </div>
                    </Group>
                    {links}
                </Navbar.Section>

                <Navbar.Section className={classes.footer}>
                    <NavLink
                        onClick={() => setProfileVisible(true)}
                        classNames={{ root: classes.navLink }}
                        icon={<IconUserCircle stroke={1.5} />}
                        component="a"
                        label="Edit Profile"
                        color="white"
                    />
                    <NavLink
                        onClick={() => logoutUser(() => router.push('/login'))}
                        classNames={{ root: classes.navLink }}
                        icon={<IconLogout stroke={1.5} />}
                        component="a"
                        label="Logout"
                        color="white"
                    />
                </Navbar.Section>
            </Navbar>
        </>
    );
}
