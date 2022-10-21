import { Button, Group, Box, Stack } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { addBiospecimenFormInformation } from '../../lib/application';
import { Application, BiospecimenForm } from '../../lib/interfaces';
import { Section0 } from './Section0';
import { Section1 } from './Section1';
import { Section2 } from './Section2';
import { Section3 } from './Section3';
import { Section4 } from './Section4';
import firebase from 'firebase';
import 'firebase/firestore';
import { useRouter } from 'next/router';

export type BWGFormProps = {
    application: Application;
    readOnly?: boolean;
    setModal: Function;
};

export function BWGForm({ application, readOnly, setModal }: BWGFormProps) {
    const router = useRouter();
    const [db, setDB] = useState<FirebaseFirestore.Firestore>();
    const [loading, setLoading] = useState(false);

    useEffect(
        () =>
            setDB(
                firebase.firestore() as unknown as FirebaseFirestore.Firestore,
            ),
        [],
    );

    const form = useForm<Application>({
        initialValues: {
            ...application,
            biospecimenForm: application.biospecimenForm
                ? application.biospecimenForm
                : {
                      ...emptyBWG,
                      amountRequired: application.biospecimenRequired?.reduce(
                          (total, request) => {
                              if (!total.numSamples) total.numSamples = 0;
                              total.numSamples += request.numSamples || 0;
                              return total;
                          },
                      ).numSamples,
                  },
        },
    });

    function Submit({ form }: { form: UseFormReturnType<Application> }) {
        return (
            <Group position="right" mt="md">
                <Button loading={loading} type="submit">
                    Submit
                </Button>
            </Group>
        );
    }

    const handleSubmit = (values: typeof form.values) => {
        setLoading(true);
        if (db) {
            addBiospecimenFormInformation(
                db,
                application.id,
                form.values.biospecimenForm || {},
            ).then(isSuccess => {
                if (isSuccess) {
                    showNotification({
                        title: 'Biospecimen Form Submitted!',
                        color: 'green',
                        message: 'You have submitted the biospecimen form',
                    });
                    setModal(false);
                    router.push('/applications/' + application.id);
                } else {
                    showNotification({
                        title: 'Form Submission Failed',
                        color: 'red',
                        message:
                            'An error has occured while submitting the form',
                    });
                }
                setLoading(false);
            });
        }
    };

    const handleError = (errors: typeof form.errors) => {
        showNotification({
            title: 'Form Submission Failed',
            color: 'red',
            message: 'An error has occured while submitting the form',
        });
    };
    return (
        <Box sx={{ maxWidth: 1100 }} mx="auto">
            <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
                <Stack spacing="xl">
                    <Section0 form={form} />

                    <Section1 form={form} />

                    <Section2 form={form} readOnly={readOnly} />

                    <Section3 form={form} readOnly={readOnly} />

                    <Section4 form={form} readOnly={readOnly} />

                    {!readOnly && <Submit form={form} />}
                </Stack>
            </form>
        </Box>
    );
}

const emptyBWG: BiospecimenForm = {
    amountRequired: 0,
    proposedTestingMethodlogy: '',
    clarifications: {
        additionalDispatchRequirement: 'No',
        fluoroscentDyeQuantificationRequired: 'No',
        LCLDerivedDNAAcceptable: 'No',
        salivaAcceptable: 'No',
        depletedDNASampleRequest: 'Exclude Sample(s)',
        depletedFFPE: 'Exclude Sample(s)',
        neoplasticCellularity: {
            minNC: '',
            minVolume: '',
        },
        normalVolume: '',
        BWGGroupConclusions: '',
        applicantCommentResponse: '',
    },
    BWGStatusReview: '',
};
