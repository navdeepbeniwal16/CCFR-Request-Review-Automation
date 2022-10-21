import { Avatar, Badge, Button, Stack, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { sendPasswordResetLink, updateUserProfile } from '../lib/user';
import { UserRole } from '../lib/utilities/AppEnums';

type ProfileProps = {
    displayName: string;
    email: string;
    role: UserRole;
    readOnly?: boolean;
};

export const rolesData = [
    { value: UserRole.PROGRAM_MANAGER, label: 'Program Manager' },
    { value: UserRole.SC_MEMBER, label: 'Steering Committee' },
    { value: UserRole.BGW_CHAIR, label: 'BWG Chair' },
    { value: UserRole.ADMIN, label: 'Admin' },
    { value: UserRole.INTERNAL_USER, label: 'Internal User' },
    { value: UserRole.APPLICANT, label: 'External User' },
];

export const getRoleName = (role: UserRole) => {
    return rolesData.filter(x => x.value == role).length > 0
        ? rolesData.filter(x => x.value == role)[0].label
        : 'No role';
};

export const roleColor: Map<UserRole, string> = new Map([
    [UserRole.PROGRAM_MANAGER, 'red'],
    [UserRole.SC_MEMBER, 'yellow'],
    [UserRole.BGW_CHAIR, 'green'],
    [UserRole.ADMIN, 'gray'],
    [UserRole.INTERNAL_USER, 'purple'],
    [UserRole.APPLICANT, 'blue'],
]);

export const getInitials = (name: string) => {
    return name
        ?.split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('');
};

export const randomColor = (seed: string) => {
    const colors = [
        ...['red', 'pink', 'grape', 'violet', 'indigo', 'blue'],
        ...['cyan', 'teal', 'green', 'lime', 'yellow', 'orange'],
    ];

    return (
        colors[
            Math.floor(
                seed
                    ?.split('')
                    .map(i => i.charCodeAt(0))
                    .reduce((a, b) => a + b, 0) || 0,
            ) % colors.length
        ] +
        '.' +
        ((Math.floor(
            seed
                ?.split('')
                .map(i => i.charCodeAt(0))
                .reduce((a, b) => a + b, 0) || 0,
        ) %
            7) +
            3)
    );
};

export default function Profile({
    displayName,
    email,
    role,
    readOnly,
}: ProfileProps) {
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState(
        displayName.substring(0, displayName.lastIndexOf(' ')),
    );
    const [lastName, setLastName] = useState(
        displayName.substring(displayName.lastIndexOf(' ') + 1),
    );

    const [updatePassword, setUpdatePassword] = useState(false);

    return (
        <Stack>
            <Stack align={'center'}>
                <Avatar radius={'xl'} size="xl" color={randomColor(email)}>
                    {getInitials(displayName)}
                </Avatar>
                <Badge color={roleColor.get(role)}>{getRoleName(role)}</Badge>
            </Stack>
            <TextInput
                onChange={e => setFirstName(e.target.value)}
                label="First Name"
                value={firstName}
                readOnly={readOnly}
            />
            <TextInput
                onChange={e => setLastName(e.target.value)}
                label="Last Name"
                value={lastName}
                readOnly={readOnly}
            />
            <TextInput label="Email" value={email} readOnly={true} />
            {!readOnly && (
                <>
                    <Button
                        loading={loading}
                        onClick={async () => {
                            setLoading(true);
                            const isSuccess = await updateUserProfile({
                                displayName: firstName + ' ' + lastName,
                            });
                            if (isSuccess) {
                                showNotification({
                                    title: 'Updated profile!',
                                    color: 'green',
                                    message:
                                        'Successfully updated your profile',
                                });
                            } else {
                                showNotification({
                                    title: 'Update profile failed',
                                    color: 'red',
                                    message:
                                        'An error occured while updating your profile',
                                });
                            }
                            setLoading(false);
                        }}
                    >
                        Update Profile
                    </Button>
                    <Button
                        onClick={() => {
                            setUpdatePassword(true);
                            sendPasswordResetLink(email).then(() => {
                                showNotification({
                                    title: 'Password Reset Link Sent',
                                    color: 'green',
                                    message:
                                        'A link to reset your password has been sent to your email.',
                                });
                            });
                        }}
                        disabled={updatePassword}
                        variant="subtle"
                    >
                        Send Update Password Link
                    </Button>
                </>
            )}
        </Stack>
    );
}
