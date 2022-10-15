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
import {
    ApplicationStage,
    ApplicationStatus,
} from '../../lib/utilities/AppEnums';

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
    const form = useForm<Application>({
        initialValues: application ? application : undefined,
        validate: validateApplication,
    });

    return (
        <Box sx={{ maxWidth: 1100 }} mx="auto">
            <form onSubmit={form.onSubmit(values => console.log(values))}>
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
                                <Save form={form} />
                                <Submit form={form} />
                            </Group>
                        </>
                    )}
                </Stack>
            </form>
        </Box>
    );
}

function Save({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <Group mt="md">
            <Button
                type="submit"
                onClick={() => {
                    form.setFieldValue('stage', ApplicationStage.Draft);
                    showNotification({
                        title: 'Form Saved',
                        message: 'See you soon!',
                    });
                }}
            >
                Save
            </Button>
        </Group>
    );
}

function Submit({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <Group mt="md">
            <Button
                type="submit"
                onClick={() => {
                    form.setFieldValue('stage', ApplicationStage.Submitted);

                    showNotification({
                        title: 'Form Submitted',
                        message: 'Great Job!',
                    });
                }}
            >
                Submit
            </Button>
        </Group>
    );
}

function validateApplication(values: Application) {
    if (values.stage === 'Submitted') {
        return {
            email: /^\S+@\S+$/.test(values.email || '')
                ? null
                : 'Invalid email',
        };
    }
    return {};
}
