import {
    Button,
    Group,
    Box,
    Stack,
} from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { Application, Collaborator } from '../../lib/interfaces';
import { Section0 } from './Section0';
import { Section1 } from './Section1';
import { Section2 } from './Section2';
import { Section3a } from './Section3a';
import { Section4 } from './Section4';
import { Section3b } from './Section3b';
// import { ApplicationsPage } from './applications';

type ApplicationsPageProps = {
    title: string | null;
    // applications: Application[]
};

export function Form() {
    const form = useForm<Application>({
        initialValues: {
            title: '',
            institutionPrimary: {
                investigator: '',
                jobTitle: '',
                institution: '',
                department: '',
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
            agreement: {
                a1: false,
                a2: false,
                a3: false,
                a4: false,
            },
            studyDescription: {
                abstract: '',
                aims: '',
                backgroundAndSignificance: '',
                preliminaryData: '',
                selectionCriteria: '',
            },
            status: 'Inactive',
            stage: 'Draft',
            ccfrCollaborators: undefined || [
                {
                    centerNumber: undefined,
                    ccfrSite: '',
                    sitePIName: '',
                    sitePIDegree: '',
                    isChecked: true,
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
        },
        validate: values => {
            if (values.stage === 'Submitted') {
                return {
                    email: /^\S+@\S+$/.test(values.email || '')
                        ? null
                        : 'Invalid email',
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
    return (
        <Box sx={{ maxWidth: 1100 }} mx="auto">
            <form onSubmit={form.onSubmit(values => console.log(values))}>
                <Stack spacing="xl">
                    <Section0 form={form} />

                    <Section1 form={form} />

                    <Section2 form={form} ccfrPeople={ccfrPeople as Collaborator[]} />

                    <Section3a form={form} />

                    <Section3b form={form} dataOption={dataOption} bioOption={bioOption}/>

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
                    form.setFieldValue('stage', 'Draft');
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
                    form.setFieldValue('stage', 'Submitted');

                    showNotification({
                        title: 'Form Submitted',
                        message: 'Great Job!',
                    })

                }}
            >
                Submit
            </Button>
        </Group>
    );
}

const ccfrPeople: Application['ccfrCollaborators'] = [
    {
        centerNumber: 13,
        ccfrSite: 'Melbourne University',
        sitePIName: 'John Louis',
        sitePIDegree: 'Phd',
        isChecked: true
    },
    {
        centerNumber: 15,
        ccfrSite: 'RMIT University',
        sitePIName: 'Kenneth Barrish',
        sitePIDegree: 'Phd',
        isChecked: false

    },
    {
        centerNumber: 21,
        ccfrSite: 'RMIT University',
        sitePIName: 'Jana Truman',
        sitePIDegree: 'Phd',
        isChecked: false

    },
    {
        centerNumber: 17,
        ccfrSite: 'Hustler University',
        sitePIName: 'Derrek Legstrong',
        sitePIDegree: 'Phd',
        isChecked: false

    },
];

const dataOption: string[] = [
    'DNA from blood',
    'DNA from lymphoblast cell-lines*1',
];

const bioOption: string[] = [
    'Family history of cancer data',
    'Baseline epi/risk factor questionnaire data',
];