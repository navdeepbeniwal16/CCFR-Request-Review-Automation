import { Button, Group, Box, Stack } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { Application, Collaborator } from '../../lib/interfaces';
import { Section0 } from './Section0';
import { Section1 } from './Section1';
import { Section2 } from './Section2';
import { Section3a } from './Section3a';
import { Section4 } from './Section4';
import { Section3b } from './Section3b';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {
    ApplicationStage,
    ApplicationStatus,
} from '../../lib/utilities/AppEnums';
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import {
    saveAndSubmitApplication,
    saveApplicationAsDraft,
} from '../../lib/application';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { convertApplicationDates } from '../../lib/utilities/applicationDateParsers';
import { updateUserProfile } from '../../lib/user';

export type ApplicationFormProps = {
    title?: string;
    application?: Application;
    readOnly?: boolean;
    ccfrPeople?: Collaborator[];
    dataAvailable?: string[];
    bioAvailable?: string[];
};

export default function ApplicationForm({
    title,
    application,
    readOnly,
    ccfrPeople,
    dataAvailable,
    bioAvailable,
}: ApplicationFormProps) {
    const auth = useAuthUser();
    const router = useRouter();
    const [db, setDB] = useState<FirebaseFirestore.Firestore>();
    const [loading, setLoading] = useState('');

    const emptyApplication: Application = {
        id: uuidv4(),
        title: '',
        institutionPrimary: {
            investigator: auth.displayName || '',
            jobTitle: '',
            institution: '',
            department: '',
        },
        email: auth.email || '',
        address: {
            streetName: '',
            city: '',
            state: '',
            zipcode: '',
            country: '',
        },
        productCommercialization: false,
        studyDescription: {
            abstract: '',
            aims: '',
            backgroundAndSignificance: '',
            preliminaryData: '',
            selectionCriteria: '',
        },
        status: ApplicationStatus.Inactive,
        stage: ApplicationStage.Draft,
        createdAt: new Date(),
    };

    const form = useForm<Application>({
        initialValues: application ? application : emptyApplication,
    });

    useEffect(
        () =>
            setDB(
                firebase.firestore() as unknown as FirebaseFirestore.Firestore,
            ),
        [],
    );

    const onSubmitApplication = async (app: Application) => {
        if (!db) return false;
        if (app.stage == ApplicationStage.Draft) {
            setLoading('save');
            const isSaved = await saveApplicationAsDraft(
                db,
                convertApplicationDates(app),
            );
            if (isSaved) {
                showNotification({
                    title: 'Draft Saved!',
                    color: 'green',
                    message:
                        'You can continue editting this application till submission',
                });
            }
        } else {
            setLoading('submit');
            app.createdAt = new Date();
            await updateUserProfile({
                displayName: app.institutionPrimary.investigator,
            });
            const isSubmitted = await saveAndSubmitApplication(
                db,
                convertApplicationDates(app),
            );
            if (isSubmitted) {
                showNotification({
                    title: 'Application Submitted!',
                    color: 'green',
                    message:
                        "We'll get back to you on the status of your application soon!",
                });
                router.push('/applications/' + app.id);
            }
        }
        setLoading('');
    };

    return (
        <Box sx={{ maxWidth: 1100 }} mx="auto">
            <form onSubmit={form.onSubmit(onSubmitApplication)}>
                <Stack spacing="xl">
                    <Section0 form={form} title={title} readOnly={readOnly} />

                    <Section1 form={form} readOnly={readOnly} />

                    <Section2
                        form={form}
                        ccfrPeople={ccfrPeople ? ccfrPeople : []}
                        readOnly={readOnly}
                    />

                    <Section3a form={form} readOnly={readOnly} />

                    <Section3b
                        form={form}
                        readOnly={readOnly}
                        dataOption={dataAvailable}
                        bioOption={bioAvailable}
                    />

                    {!readOnly && (
                        <>
                            <Section4 form={form} />
                            <Group position="right">
                                <Save form={form} loading={loading} />
                                <Submit form={form} loading={loading} />
                            </Group>
                        </>
                    )}
                </Stack>
            </form>
        </Box>
    );
}

function Save({
    form,
    loading,
}: {
    form: UseFormReturnType<Application>;
    loading: string;
}) {
    return (
        <Group mt="md">
            <Button
                loading={loading == 'save'}
                disabled={loading != '' && loading != 'save'}
                formNoValidate
                type="submit"
                onClick={() =>
                    form.setFieldValue('stage', ApplicationStage.Draft)
                }
            >
                Save
            </Button>
        </Group>
    );
}

function Submit({
    form,
    loading,
}: {
    form: UseFormReturnType<Application>;
    loading: string;
}) {
    return (
        <Group mt="md">
            <Button
                loading={loading == 'submit'}
                disabled={loading != '' && loading != 'submit'}
                type="submit"
                onClick={() =>
                    form.setFieldValue('stage', ApplicationStage.Submitted)
                }
            >
                Submit
            </Button>
        </Group>
    );
}
