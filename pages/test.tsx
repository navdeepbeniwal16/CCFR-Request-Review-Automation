import {
    Button,
    Group,
    Box,
    Stack,
    TextInput,
    Textarea,
    Table,
    Radio,
    Text,
} from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { app } from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
import { AuthAction, getFirebaseAdmin, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { ApplicationFormProps } from '../components/Form';
import { getExistingCCFRSiteData, getExistingCCFRData, getExistingCCFRBiospecimens, getApplicationById } from '../lib/application';
import { Application, Collaborator, BiospecimenForm} from '../lib/interfaces';
import { ApplicationStage, ApplicationStatus } from '../lib/utilities/AppEnums';


export type BWGApplicationFormProps = {
    title?: string;
    application?: Application;
    readOnly?: boolean;
    existingApplication?: Application;
};

export function BWGApplicationForm({ title, application, readOnly}: BWGApplicationFormProps) {
    const form = useForm<Application>({
        // initialValues: {
        //     id: '',
        //     title: '',
        //     institutionPrimary: {
        //         investigator: '',
        //     },

        //     email: '',
        //     phoneNumber: undefined,
        //     address: {
        //         streetName: '',
        //         city: '',
        //         state: '',
        //         zipcode: '',
        //         country: '',
        //     },
        //     institutionSecondary: {
        //         investigator: '',
        //         jobTitle: '',
        //         institution: '',
        //         department: '',
        //     },
        //     productCommercialization: false,
        //     dateReceiptDeadline: undefined,
        //     biospecimenReceiptDeadline: undefined,
        //     studyDescription: {
        //         abstract: '',
        //         aims: '',
        //         backgroundAndSignificance: '',
        //         preliminaryData: '',
        //         selectionCriteria: '',
        //     },
        //     status: ApplicationStatus.Inactive,
        //     stage: ApplicationStage.Draft,
        //     biospecimenForm: {
        //         amountRequired: 0,
        //         proposedTestingMethodlogy: '',
        //         clarifications: {
        //             additionalDispatchRequirement: undefined,
        //             fluoroscentDyeQuantificationRequired: undefined,
        //             LCLDerivedDNAAcceptable: undefined,
        //             salivaAcceptable: undefined,
        //             depletedDNASampleRequest: undefined,
        //             depletedFFPE: undefined,
        //             neoplasticCellularity: {
        //                 minNC: '',
        //                 minVolume: '',
        //             },
        //             normalVolume: '',
        //             BWGGroupConclusions: '',
        //             applicantCommentResponse: '',
        //         },
        //         BWGStatusReview: '',
        //     },
        //     ccfrCollaborators: undefined || [
        //         {
        //             centerNumber: undefined,
        //             ccfrSite: '',
        //             sitePIName: '',
        //             sitePIDegree: '',
        //         },
        //     ],
        //     dataRequired: undefined || [
        //         {
        //             name: '',
        //             type: '',
        //             quantity: 0,
        //             numSamples: 0,
        //         },
        //     ],
        //     createdAt: new Date(),
        //     history: []
        // },
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

                    <Section2 form={form} />

                    <Section3 form={form} />

                    <Section4 form={form} />

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

function Section0({ form }:{
    form: UseFormReturnType<Application>
    existingApplication?: Application
    readOnly?: boolean;
}){
    return (
        <Box>
            <Group grow>
                <TextInput
                    label="Principal Investigator"
                    readOnly= {true}
                    {...form.getInputProps('institutionPrimary.investigator')}
                />
                <TextInput
                    label="ApplicationID"
                    readOnly= {true}
                    {...form.getInputProps('id')}
                />
            </Group>
            <Textarea
                label="Title"
                readOnly= {true}
                {...form.getInputProps('title')}
            />
        </Box>
    )
}

function Section1({ form }:{
    form: UseFormReturnType<Application>
}){
    const existingBio = form.values?.biospecimenRequired?.filter(data => data.quantity)
    const rows = existingBio?.map((data, index) =>(
        <tr key={index}>
            <td>
                <Text>{data.type}</Text>
            </td>
            <td>
                <Text>{data.quantity}</Text>
            </td>
        </tr>
    ));
    return (
        <Box>
            <h2>{'Section 1: Amount of Biospecimen Requested'}</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Biospecimens</th>
                        <th>Amount Required</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </Box>
    )
}

function Section2({ form }:{
    form: UseFormReturnType<Application>
}){
    return (
        <Box>
            <h2>{'Section 2: Methodology & Testing'}</h2>

            <Textarea
                required
                label="Proposed Testing and Methodology"
                {...form.getInputProps('biospecimenForm.proposedTestingMethodlogy')}
            />
        </Box>
    )
}

function Section3({ form }:{
    form: UseFormReturnType<Application>
}){
    return (
        <Box>
            <Stack spacing="md">

            <h2>{'Section 3: Clarifications'}</h2>
            <Radio.Group 
                required
                spacing="xl" 
                label="Does applicant anticipate >1 dispatch, e.g., a 2nd dispatch to validate initial findings?"
                {...form.getInputProps('biospecimenForm.clarifications.additionalDispatchRequirement')}
                >
                <Radio value="Yes" label="Yes" />
                <Radio value="No" label="No" />
                <Radio value="TBD" label="TBD" />
            </Radio.Group>

            <Radio.Group 
                required
                spacing="xl"
                label="If requesting DNA, will fluorescent dye quantification be required?"
                {...form.getInputProps('biospecimenForm.clarifications.fluoroscentDyeQuantificationRequired')}
                >
                <Radio value="Yes" label="Yes" />
                <Radio value="No" label="No" />
                <Radio value="TBD" label="TBD" />
            </Radio.Group>

            <Radio.Group 
                required
                spacing="xl"
                label="If blood-derived DNA is not available, will LCL-derived DNA be acceptable?"
                {...form.getInputProps('biospecimenForm.clarifications.LCLDerivedDNAAcceptable')}
                >
                <Radio value="Yes" label="Yes" />
                <Radio value="No" label="No" />
                <Radio value="TBD" label="TBD" />
            </Radio.Group>

            <Radio.Group 
                required
                spacing="xl"
                label="If blood-derived DNA is not available, will saliva-derived DNA be acceptable?"
                {...form.getInputProps('biospecimenForm.clarifications.salivaAcceptable')}
                >
                <Radio value="Yes" label="Yes" />
                <Radio value="No" label="No" />
                <Radio value="TBD" label="TBD" />
            </Radio.Group>

            <Radio.Group 
                required
                spacing="xl"
                label="Will participants with depleted blood/saliva/LCL DNA samples requiring DNA extraction be excluded or will extractions be requested?"
                {...form.getInputProps('biospecimenForm.clarifications.depletedDNASampleRequest')}
                >
                <Radio value="Exclude Sample(s)" label="Exclude Sample(s)" />
                <Radio value="Extract at CCFR Site(s)" label="Extract at CCFR Site(s)" />
                <Radio value="TBD" label="TBD" />
            </Radio.Group>

            <Radio.Group 
                required
                spacing="xl"
                label="Will participants with depleted FFPE tissue DNA be excluded, or will extractions be requested, or will FFPE sections be requested? If FFPE sections will be requested, how many/case?"
                {...form.getInputProps('biospecimenForm.clarifications.depletedFFPE')}
                >
                <Radio value="Exclude Sample(s)" label="Exclude Sample(s)" />
                <Radio value="Extract at CCFR Site(s)" label="Extract at CCFR Site(s)" />
                <Radio value="Request FFPE" label="Request FFPE" />
            </Radio.Group>

            <Text>If requesting tumor FFPE (slides or DNA), what is the minimum neoplastic cellularity (NC (%)) required in the tumor bed (or in precursor material for DNAextraction) and what is the minimum tumor volume (mm3) needed?</Text>
            <Group grow>
                <TextInput
                    required
                    label="Minimum NC"
                    {...form.getInputProps('biospecimenForm.clarifications.neoplasticCellularity.minNC')}
                />
                <TextInput
                    required
                    label="Minimum Volume"
                    {...form.getInputProps('biospecimenForm.clarifications.neoplasticCellularity.minVolume')}

                />
            </Group>
            <Text>If requesting normal FFPE (slides or DNA), what is the minimum normal volume (mm3) needed?</Text>
            
            <TextInput
                required
                label="Minimum Volume"
                {...form.getInputProps('biospecimenForm.clarifications.normalVolume')}
            />

            </Stack>
        </Box>
    )
}


function Section4({ form }:{
    form: UseFormReturnType<Application>
}){
    return (
        <Box>
            <h2>{'Section 4: Biospecimen Working Group Review Conclusions'}</h2>
            <Textarea
                required
                label="Biospecimen Working Group Review Conclusions"
                {...form.getInputProps('biospecimenForm.clarifications.BWGGroupConclusions')}
            />
        </Box>
    )
}
export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
    const db = getFirebaseAdmin().firestore();
    const ppl = await getExistingCCFRSiteData(db);
    const dta = await getExistingCCFRData(db);
    const bio = await getExistingCCFRBiospecimens(db);

    const _props: ApplicationFormProps = {
        ccfrPeople: ppl.map(p => ({
            centerNumber: parseInt(p.centerNumber),
            ccfrSite: p.siteName,
            sitePIName: p.pIName,
            sitePIDegree: p.pIDegree,
        })),
        dataAvailable: dta.map(d => d.name),
        bioAvailable: bio.map(b => b.name),
        ...(query.id
            ? { application: await getApplicationById(db, query.id as string) }
            : {}),
    };

    return {
        props: _props,
    };
});

export default withAuthUser<BWGApplicationFormProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(BWGApplicationForm);
