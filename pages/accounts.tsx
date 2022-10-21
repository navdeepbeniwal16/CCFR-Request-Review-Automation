import {
    Avatar,
    Table,
    Group,
    Text,
    Select,
    Button,
    Container,
    Drawer,
    TextInput,
    Grid,
} from '@mantine/core';
import { UserRecord } from 'firebase-admin/auth';
import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR,
} from 'next-firebase-auth';
import {
    getAllUsersAsAdmin,
    getUsersByRoleAsAdmin,
    setUserRoleAsAdmin,
} from '../lib/user';
import { UserRole } from '../lib/utilities/AppEnums';
import Profile, {
    rolesData,
    randomColor,
    getInitials,
    getRoleName,
} from '../components/Profile';
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { IconSearch } from '@tabler/icons';

interface UsersTableProps {
    data: UserRecord[];
}

export function UsersRolesTable({ data }: UsersTableProps) {
    const [visibleUser, setVisibleUser] = useState<UserRecord>();
    const [search, setSearch] = useState('');

    const rows = data
        .filter(
            x =>
                !search ||
                x.displayName
                    ?.toLocaleLowerCase()
                    .includes(search.toLowerCase()) ||
                x.email?.toLocaleLowerCase().includes(search.toLowerCase()),
        )
        .map(item => (
            <tr key={item.displayName || item.email}>
                <td>
                    <Group spacing="sm">
                        <Avatar
                            color={randomColor(item.email || '')}
                            radius="xl"
                        >
                            {getInitials(item.displayName || '')}
                        </Avatar>
                        <Text size="sm" weight={500}>
                            {item.displayName || item.email}
                        </Text>
                    </Group>
                </td>
                <td>{item.email}</td>
                <td>
                    <Select
                        data={rolesData}
                        defaultValue={
                            item.customClaims?.role || UserRole.APPLICANT
                        }
                        variant="unstyled"
                        onChange={newRole => {
                            if (item.email && newRole) {
                                setUserRoleAsAdmin(
                                    item.email,
                                    newRole as UserRole,
                                ).then(isSuccess => {
                                    if (isSuccess) {
                                        showNotification({
                                            title:
                                                'Updated role to ' +
                                                getRoleName(
                                                    newRole as UserRole,
                                                ),
                                            color: 'green',
                                            message:
                                                'Successfully updated role of ' +
                                                item.email +
                                                ' to ' +
                                                getRoleName(
                                                    newRole as UserRole,
                                                ),
                                        });
                                    } else {
                                        showNotification({
                                            title: 'Update profile failed',
                                            color: 'red',
                                            message:
                                                'An error occured while updating your profile',
                                        });
                                    }
                                });
                            }
                        }}
                    />
                </td>
                <td>
                    <Button
                        onClick={() => setVisibleUser(item)}
                        variant="subtle"
                    >
                        View Profile
                    </Button>
                </td>
            </tr>
        ));

    return (
        <>
            <Drawer
                position="right"
                opened={visibleUser != undefined}
                onClose={() => setVisibleUser(undefined)}
                title="Edit Profile"
                padding="xl"
                size="md"
            >
                <Profile
                    displayName={visibleUser?.displayName || ''}
                    email={visibleUser?.email || ''}
                    role={visibleUser?.customClaims?.role}
                    readOnly={true}
                />
            </Drawer>
            <Container m="md" p="md" mt="0" fluid>
                <Grid justify="space-between" align="center">
                    <h1>All Accounts</h1>
                    <TextInput
                        onChange={e => setSearch(e.target.value)}
                        icon={<IconSearch size={18} stroke={1.5} />}
                        size="md"
                        placeholder="Search for users"
                        rightSectionWidth={42}
                    />
                </Grid>
                <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </Container>
        </>
    );
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
    if (AuthUser.claims.role != UserRole.ADMIN) {
        return {
            notFound: true,
        };
    }

    const userRoleMap: Map<string, UserRole> = new Map([
        ['external', UserRole.APPLICANT],
        ['internal', UserRole.INTERNAL_USER],
        ['committee', UserRole.SC_MEMBER],
        ['pm', UserRole.PROGRAM_MANAGER],
        ['bwg', UserRole.BGW_CHAIR],
    ]);

    const users = query.type
        ? await getUsersByRoleAsAdmin(
              userRoleMap.get(query.type as string) || UserRole.APPLICANT,
          )
        : await getAllUsersAsAdmin();

    const _props: UsersTableProps = {
        data: users.filter(x => x.email != AuthUser.email),
    };

    return {
        props: _props,
    };
});

export default withAuthUser<UsersTableProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(UsersRolesTable);
