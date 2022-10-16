import {
    Button,
    Group,
    Box,
    Stack,
} from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { app } from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
import { AuthAction, getFirebaseAdmin, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { ApplicationFormProps } from '../../components/Form';
import { getApplicationById } from '../../lib/application';
import { Application} from '../../lib/interfaces';
import { ApplicationStage} from '../../lib/utilities/AppEnums';
import { Section0 } from './Section0';
import { Section1 } from './Section1';
import { Section2 } from './Section2';
import { Section3 } from './Section3';
import { Section4 } from './Section4';


export type BWGApplicationFormProps = {
    title?: string;
    application?: Application;
    readOnly?: boolean;
    existingApplication?: Application;
};

export function BWGApplicationForm({ title, application, readOnly}: BWGApplicationFormProps) {
    const form = useForm<Application>({
        initialValues: {
            ...application as unknown as Application,
            biospecimenForm: {
                amountRequired: 0,
                proposedTestingMethodlogy: '',
                clarifications: {
                    additionalDispatchRequirement: undefined,
                    fluoroscentDyeQuantificationRequired: undefined,
                    LCLDerivedDNAAcceptable: undefined,
                    salivaAcceptable: undefined,
                    depletedDNASampleRequest: undefined,
                    depletedFFPE: undefined,
                    neoplasticCellularity: {
                        minNC: '',
                        minVolume: '',
                    },
                    normalVolume: '',
                    BWGGroupConclusions: '',
                    applicantCommentResponse: '',
                },
                BWGStatusReview: '',
            },
        },
       
    });

    const handleSubmit = (values: typeof form.values) => {
        if(values.stage === 'Submitted'){
            showNotification({
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
                    <Section0 form={form}/>

                    <Section1 form={form}/>

                    <Section2 form={form} readOnly={readOnly}/>

                    <Section3 form={form} readOnly={readOnly}/>

                    <Section4 form={form} readOnly={readOnly}/>

                    <Submit form={form} />
                </Stack>
            </form>
        </Box>
    );
}

function Submit({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <Group position="right" mt="md">
            <Button
                type="submit"
                onClick={() => {
                    form.setFieldValue('stage', ApplicationStage.Submitted);

                }}
            >
                Submit
            </Button>
        </Group>
    );
}
