import {
    Avatar,
    Badge,
    Table,
    Group,
    Text,
    Select,
    ScrollArea,
    Button,
    Container,
} from '@mantine/core';
import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR,
} from 'next-firebase-auth';

interface UsersTableProps {
    data: {
        avatar?: string;
        name: string;
        email: string;
        role: string;
    }[];
}

const rolesData = [
    'Program Manager',
    'Steering Committee',
    'BWG Chair',
    'Admin',
    'Internal User',
    'External User',
];

export function UsersRolesTable({ data }: UsersTableProps) {
    const rows = data.map(item => (
        <tr key={item.name}>
            <td>
                <Group spacing="sm">
                    <Avatar size={40} src={item.avatar} radius={40} />
                    <Text size="sm" weight={500}>
                        {item.name}
                    </Text>
                </Group>
            </td>
            <td>{item.email}</td>
            <td>
                <Select
                    data={rolesData}
                    defaultValue={item.role}
                    variant="unstyled"
                />
            </td>
            <td>
                <Button variant="subtle">View Profile</Button>
            </td>
        </tr>
    ));

    return (
        <Container m="md" p="md" mt="0" fluid>
            <h1>All Accounts</h1>
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
    );
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
    const _props: UsersTableProps = {
        data: [
            {
                name: 'James Smith',
                email: 'james.smith@unimelb.edu.au',
                role: 'External User',
            },
            {
                name: 'Karen Corden',
                email: 'k.corden@rmit.edu.au',
                role: 'Internal User',
            },
            {
                name: 'Kim Min Seo',
                email: 'kms@unimelb.edu.au',
                role: 'External User',
            },
            {
                name: 'Rafi Usman',
                email: 'rafiu@monash.edu.au',
                role: 'External User',
            },
            {
                name: 'Harold Saxon',
                email: 'harold.saxon@unimelb.edu.au',
                role: 'Steering Committee',
            },
            {
                name: 'Coraline Abby',
                email: 'c.abby@monash.edu.au',
                role: 'External User',
            },
            {
                name: 'Darrel Day Smith',
                email: 'dday@rmit.edu.au',
                role: 'Internal User',
            },
            {
                name: 'Sheila Soora',
                email: 's.soora@monash.edu.au',
                role: 'Steering Committee',
            },
            {
                name: 'Max Argus',
                email: 'max.argus@unimelb.edu.au',
                role: 'External User',
            },
        ],
    };

    return {
        props: _props,
    };
});

export default withAuthUser<UsersTableProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(UsersRolesTable);
