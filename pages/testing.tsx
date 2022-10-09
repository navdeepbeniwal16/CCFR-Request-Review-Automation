import { TextInput, Checkbox, Button, Group, Box, Switch, Text, Space, Grid, Stack, Textarea } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { Application } from '../lib/interfaces';
// import { ApplicationsPage } from './applications';


type ApplicationsPageProps = {
    title: string | null
    // applications: Application[]
}

// type FormDetailsProps = {
//     termsOfService: boolean

//     titleProject: string

//     principalInvestigator: string
//     jobTitle: string
//     institution: string
//     department: string
//     email: string
//     phone: string
//     addressForm: string
//     city: string
//     stateForm: string
//     zip: string
//     country: string


// }

function Demo() {
    const form = useForm<Application>({
        initialValues: {
            //termsOfService: false,

            title: '',
            institutionPrimary: {
                investigator: '',
                jobTitle: '',
                institution: '',
                department: '',
            },

            email: '',
            phoneNumber: '',
            address: {
                streetName: '',
                city: '',
                state: '',
                zipcode: '',
                country: '',
            },
            institutionSecondary: false,
            productCommercialization: false,
            dateReceiptDeadline: undefined,
            biospecimenReceiptDeadline: undefined,
            agreement:{
                a1: false,
                a2: false,
                a3: false,
                a4: false,
            },
            studyDescription:{
                abstract: '',
                aims: '',
                backgroundAndSignificance: '',
                preliminaryData: '',
                selectionCriteria: '',
            },
            status: 'Inactive',
            stage: 'Draft',
        },

        validate: {
            email: (value: Application["email"]) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    return (
        <Box sx={{ maxWidth: 1100 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => console.log(values))}>

                <h1>Application Details</h1>
                <Section0 form={form} />

                <h2>Section 1: Investigator and General Information</h2>
                <Section1 form={form} />

                <h2>Section 2: CCFR Collaborators</h2>


                <h2>Section 3: Description of Proposed Collaborative Study</h2>
                <Section3 form={form} />

                <h2>Section 4: Agreement</h2>
                <Section4 form={form} />

                <Submit form={form} />
            </form>
        </Box>
    );
}

function Submit({ form }: { form: UseFormReturnType<Application> }) {

    return (

        <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
        </Group>

    );
}

function Section0({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <TextInput
            withAsterisk
            label="Title of Project"
            {...form.getInputProps('title')}
        />
    )

}

function Section1({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <>
            <Group position="center" grow>
                <TextInput
                    withAsterisk
                    label="Principal Investigator"
                    {...form.getInputProps('institutionPrimary.investigator')}
                />
                <TextInput
                    withAsterisk
                    label="Job Title"
                    {...form.getInputProps('institutionPrimary.jobTitle')}
                />
            </Group>

            <Group position="center" grow>
                <TextInput
                    withAsterisk
                    label="Institution"
                    {...form.getInputProps('institutionPrimary.institution')}
                />
                <TextInput
                    withAsterisk
                    label="Department"
                    {...form.getInputProps('institutionPrimary.department')}
                />
            </Group>

            <Group position="center" grow>
                <TextInput
                    withAsterisk
                    label="Email Address"
                    placeholder='your@email.com'
                    {...form.getInputProps('email')}
                />
                <TextInput
                    label="Phone Number"
                    {...form.getInputProps('phoneNumber')}
                />
            </Group>

            <TextInput
                withAsterisk
                label="Address"
                {...form.getInputProps('address.streetName')}
            />

            <Group position="center" grow>
                <TextInput
                    withAsterisk
                    label="City/Suburb"
                    {...form.getInputProps('address.city')}
                />
                <TextInput
                    withAsterisk
                    label="State"
                    {...form.getInputProps('address.state')}
                />
            </Group>

            <Group position="center" grow>
                <TextInput
                    withAsterisk
                    label="Zip/Post Code"
                    {...form.getInputProps('address.zipcode')}
                />
                <TextInput
                    withAsterisk
                    label="Country"
                    {...form.getInputProps('address.country')}
                />
            </Group>
            <Space h="lg" />

            <Grid>
                <Grid.Col span={8}>Will a 2nd institution require access to CCFR data/biospecimens be involved in your study?</Grid.Col>
                <Grid.Col span={2}>
                    <Switch
                        onLabel="Yes"
                        offLabel="No"
                        size="xl"
                        {...form.getInputProps('institutionSecondary')}
                    />
                </Grid.Col>
            </Grid>
            <Space h="lg" />

            <Grid>
                <Grid.Col span={8}>If requesting CCFR biospecimens, will they be used for product commercialization?</Grid.Col>
                <Grid.Col span={2}>
                    <Switch
                        onLabel="Yes"
                        offLabel="No"
                        size="xl"
                        {...form.getInputProps('productCommercialization')}
                    />
                </Grid.Col>
            </Grid>

            <Space h="lg" />

            <Group grow>

                <DatePicker
                    placeholder="Pick date"
                    label="Deadline for receipt of data"
                    {...form.getInputProps('dateReceiptDeadline')}
                />

                <DatePicker
                    placeholder="Pick date"
                    label="Deadline for receipt of biospecimens"
                    {...form.getInputProps('biospecimenReceiptDeadline')}
                />

            </Group>


        </>

    )

}

function Section2({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <>
        </>
    )
}

function Section3({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <>
            <Text>Please upload a brief description of the proposed research to use data/biospecimens from the CCFR.</Text>
            <Textarea
                label="Project Title"
                autosize
                minRows={2}
                {...form.getInputProps('title')}
            />
            <Textarea
                label="Abstract"
                autosize
                minRows={2}
                {...form.getInputProps('title')}
            />
        </>
    )
}

function Section4({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <>
            <Stack align="flex-start">
                <Checkbox
                    label="I agree to form a collaboration with the Colon CFR (CCFR). I agree to assume all risks and responsibilities in connection with the receipt, handling, storage and
                    use of data/biomaterials. I agree that the data/biomaterials to be provided by the NCI CCFR will be used only for the purposes specified in the approved proposal.
                    I will provide documentation of IRB/ethics committee review that will include my IRB file number and IRB review date. I agree not to distribute data or biomaterials
                    to third parties without the approval of the CCFR Principal Investigators and then only with fully executed data-use agreement and/or material transfer agreement."
                    {...form.getInputProps('agreement.a1', { type: 'checkbox' })}
                />
                <Checkbox
                    label="I agree to make study-generated results available to the scientific community by transferring them to the central CCFR Informatics Center within 6 months of their
                    publication and to submit progress reports upon request (at most annually) until the project is completed."
                    {...form.getInputProps('agreement.a2', { type: 'checkbox' })}

                />
                <Checkbox
                    label=" agree to adhere to the CCFR Policy on Publications and notify the CCFR of planned publications that make use of CCFR data and/or biospecimens and to:
                    1) Register publications with the CCFR early in the planning process;
                    2) Submit publications to the CFR for administrative review prior to submission to a journal; and,
                    3) Acknowledge the contributions (financial and otherwise) of the NCI and CCFR. The CCFR Policy on Publications, Manuscript Registration Form and Review
                    Checklist can be downloaded at www.coloncfr.org/publications."
                    {...form.getInputProps('agreement.a3', { type: 'checkbox' })}

                />
                <Checkbox
                    label="I understand that the Colon CFR has been funded entirely by the NCI of the U.S. NIH, and that all applicable publications arising from the use of Colon CFR resources
                    must comply with the NIH Public Access Policy by ensuring they are submitted to the PubMed Central (PMC) upon acceptance for publication
                    (see: https://www.nlm.nih.gov/bsd/public_access/resources.html)."
                    {...form.getInputProps('agreement.a4', { type: 'checkbox' })}
                />
                <Space h="xl" />
                <Text size="sm">
                    <Text weight={700}>[Recommended funding acknowledgement]</Text> "Research reported in this publication was supported in part by the National Cancer Institute (NCI) of the National Institutes
                    of Health (NIH) under award number U01 CA167551. The content of this manuscript does not necessarily reflect the views or policies of the NIH or any of the collaborating
                    centers in the Colon Cancer Family Registry (CCFR), nor does mention of trade names, commercial products, or organizations imply endorsement by the US Government
                    or the CCFR.” [Additional funding acknowledgement for the manuscripts utilizing CCFR GWAS data can be found in our Policy for Publications www.coloncfr.org/publications.]
                </Text>
                <Text size="sm">
                    This document formalizes the agreement between the applicant and site(s) to collaborate.
                </Text>
            </Stack>
            <Space h="xl" />

        </>
    )
}



// below is the code required to ensure user is authenticated 

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
    const appType: ApplicationsPageProps['title'] = query.type?.toString() || null

    const _props: ApplicationsPageProps = {
        title: appType,
        // applications: data,
    }

    return {
        props: _props,
    }
})

export default withAuthUser<ApplicationsPageProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Demo)

// const data: Application[] = [
//     {
//         id: String(Math.floor(Math.random() * 10000)),
//         title: "Impact of Inflammatory Bowel Disease on CRC Mortality.",
//         institutionPrimary: {
//             investigator: 'Scott Adams',
//             institution: "University of Melbourne",
//         },
//         dataRequired: [{
//             name: "test",
//             type: "test",
//             quantity: 10,
//             numSamples: 1,
//         }],
//         status: 'Active',
//     }
// ];