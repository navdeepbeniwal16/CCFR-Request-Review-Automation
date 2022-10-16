import {
    Button,
    Group,
    Box,
    Stack,
} from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { Application, Collaborator } from '../../lib/interfaces';
// import { Section0 } from './Section0';
// import { Section1 } from './Section1';
// import { Section2 } from './Section2';
// import { Section3a } from './Section3a';
// import { Section4 } from './Section4';
// import { Section3b } from './Section3b';
import { ApplicationStage, ApplicationStatus } from '../../lib/utilities/AppEnums';

export type BWGApplicationFormProps = {
    title?: string;
    application?: Application;
    readOnly?: boolean;
    ccfrPeople?: Collaborator[];
    dataAvailable?: string[];
    bioAvailable?: string[];
};

export default function BWGApplicationForm({ title, application, readOnly, ccfrPeople, dataAvailable, bioAvailable}: BWGApplicationFormProps) {
    const form = useForm<Application>({
        initialValues: {
            id: '',
            title: '',
            institutionPrimary: {
                investigator: '',
            },

            email: '',
            phoneNumber: undefined,
            address: {
                streetName: '',
                city: '',
                state: '',
                zipcode: '',
                country: '',
            },
            institutionSecondary: {
                investigator: '',
                jobTitle: '',
                institution: '',
                department: '',
            },
            productCommercialization: false,
            dateReceiptDeadline: undefined,
            biospecimenReceiptDeadline: undefined,
            studyDescription: {
                abstract: '',
                aims: '',
                backgroundAndSignificance: '',
                preliminaryData: '',
                selectionCriteria: '',
            },
            status: ApplicationStatus.Inactive,
            stage: ApplicationStage.Draft,
            ccfrCollaborators: undefined || [
                {
                    centerNumber: undefined,
                    ccfrSite: '',
                    sitePIName: '',
                    sitePIDegree: '',
                },
            ],
            dataRequired: undefined || [
                {
                    name: '',
                    type: '',
                    quantity: 0,
                    numSamples: 0,
                },
            ],
            createdAt: new Date(),
            history: []
        },
        validate: values => {
            if (values.stage === 'Submitted') {
                return {
                    // email: /^\S+@\S+$/.test(values.email || '')
                    //     ? null
                    //     : 'Invalid email',
                };
            }
            return {};
        },
    });

    // draft -> stage
    /**
     * save button -> stage: draft
     * submit button -> stage: submitted
     *
     * isStageDraft ?
     */
    //console.log('form', form.values.stage);

    const handleSubmit = (values: typeof form.values) => {
        if(values.stage === 'Submitted'){
            showNotification({
                color:"green",
                title: 'Form Submitted',
                message: 'Great Job!',
            })
            
        }
        console.log('naruto', values)
    }

    const handleError = (errors: typeof form.errors) => {
        showNotification({
            color:"red",
            title: 'Form Error',
            message: 'Bad Job!',
        })
        console.log('naruto2', errors)
    }
    return (
        <Box sx={{ maxWidth: 1100 }} mx="auto">
            <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
                <Stack spacing="xl">
                    <Section0 form={form} />

                    <Section1 form={form} />

                    <Section2 form={form} ccfrPeople={ccfrPeople as Collaborator[]} />

                    <Section3a form={form} />

                    <Section3b form={form} dataOption={dataAvailable} bioOption={bioAvailable}/>

                    <Section4 form={form} />

                    <Save form={form} />
                    <Submit form={form} />
                </Stack>
            </form>
        </Box>
    );
}

function Save({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <Group position="right" mt="md">
            <Button
                type="submit"
                onClick={() => {
                    form.setFieldValue('stage', ApplicationStage.Draft);
                    showNotification({
                        title: 'Form Saved',
                        message: 'See you soon!',
                    })
                }}
            >
                Save
            </Button>
        </Group>
    );
}

function Submit({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <Group position="right" mt="md">
            <Button
                type="submit"
                onClick={() => {
                    form.setFieldValue('stage', ApplicationStage.Submitted);

                    // showNotification({
                    //     title: 'Form Submitted',
                    //     message: 'Great Job!',
                    // })

                }}
            >
                Submit
            </Button>
        </Group>
    );
}