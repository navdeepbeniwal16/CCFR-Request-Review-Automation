import { TextInput, Checkbox, Button, Group, Box, Switch, Text, Space, Grid, Stack, Textarea, Autocomplete, Table } from '@mantine/core';
import { useState } from 'react';
import { useForm, UseFormReturnType } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { Application, Collaborator } from '../lib/interfaces';
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
            ccfrCollaborators: undefined || [
                {
                    centerNumber: undefined,
                    ccfrSite: '',
                    sitePIName: '',
                    sitePIDegree: '',
                    isChecked: false,
                }
            ]
        },
        validate: (values) => {
            if (values.stage === 'Submitted' ) {
                return {
                    email: (/^\S+@\S+$/.test(values.email || '') ? null : 'Invalid email'),
                }
            }
            return {}
        }

    });

    // draft -> stage
    /**
     * save button -> stage: draft
     * submit button -> stage: submitted
     * 
     * isStageDraft ? 
     */
    console.log('form', form.values.stage)
    return (
        <Box sx={{ maxWidth: 1100 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => console.log(values))}>

                <h1>Application Details</h1>
                <Section0 form={form} />

                <h2>Section 1: Investigator and General Information</h2>
                <Section1 form={form} />

                <h2>Section 2: CCFR Collaborators</h2>
                <Section2 form={form}/>

                <h2>Section 3: Description of Proposed Collaborative Study</h2>
                <Section3a form={form} />

                <h2>Section 4: Agreement</h2>
                <Section4 form={form} />

                <Save form={form} />
                <Submit form={form} />
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
                    form.setFieldValue('stage',  "Draft")
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
                    form.setFieldValue('stage',  "Submitted")
                }}
            >
                Submit
            </Button>
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
    const [checked, setChecked]= useState(false);
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
                        checked={checked}
                        onChange={(event) => setChecked(event.currentTarget.checked)}
                        onLabel="Yes"
                        offLabel="No"
                        size="xl"
                       
                    />
                </Grid.Col>
            </Grid>
            
            <Space h="lg" />
            
            {checked
            // (scndIns.naem || scndInst.biospec)
             && (
                <>
                <Autocomplete
                    label="If yes, access to what?"
                    placeholder="Pick one"
                    data={['Data', 'BioSpecimens', 'Both']}
                    {...form.getInputProps('institutionSecondary.accessType')}
                />
                <Group position="center" grow>
                    <TextInput
                        withAsterisk
                        label="Principal Investigator"
                        {...form.getInputProps('institutionSecondary.investigator')}
                    />
                    <TextInput
                        withAsterisk
                        label="Job Title"
                        {...form.getInputProps('institutionSecondary.jobTitle')}
                    />
                </Group>

                <Group position="center" grow>
                    <TextInput
                        withAsterisk
                        label="Institution"
                        {...form.getInputProps('institutionSecondary.institution')}
                    />
                    <TextInput
                        withAsterisk
                        label="Department"
                        {...form.getInputProps('institutionSecondary.department')}
                    />
                </Group>
                </>
            )}

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
    const rows = ccfrPeople?.map((_ccfrPeople, i) => (
        <tr key={i}>
            <td>{_ccfrPeople.centerNumber}</td>
            <td>
                <Group spacing="xs">
                    <Text italic>
                        {_ccfrPeople.ccfrSite},
                    </Text> 
                    <Text>
                        Site PI:
                    </Text>
                    <Text weight="700">
                        {_ccfrPeople.sitePIName}, {_ccfrPeople.sitePIDegree}
                    </Text>
                </Group>
                
            </td>
            <td><Checkbox /></td>
            
        </tr>
      ));
    
    return (
        <>
        <Table>
            <thead>
                <tr>
                <th>Center Number</th>
                <th>CCFR Site and Site Principal Investigator</th>
                <th>Check which apply (if known)</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </Table>

        <Text>Add new Collaborators</Text>
        <Group grow>
            <TextInput
                label="Other Collaborating Investigators"
            />
            <TextInput
                label="Affiliation"
            />
        </Group>
        

        </>
    )
}

function Section3a({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <Stack spacing="md">
            <Textarea
                withAsterisk
                label="Project Title"
                autosize
                {...form.getInputProps('title')}
            />
            <Textarea
                label="Abstract"
                autosize
                minRows={2}
                {...form.getInputProps('studyDescription.abstract')}
            />
            <Textarea
                label="Specific Aims"
                autosize
                minRows={2}
                {...form.getInputProps('studyDescription.aims')}
            />
            <Textarea
                label="Background and Significance of the Proposed Collaborative Study"
                autosize
                minRows={2}
                {...form.getInputProps('studyDescription.backgroundAndSignificance')}
            />
            <Textarea
                label="Preliminary Data"
                autosize
                minRows={2}
                {...form.getInputProps('studyDescription.preliminaryData')}
            />
            <Textarea
                label="Selection Criteria"
                autosize
                minRows={2}
                {...form.getInputProps('studyDescription.selectionCriteria')}
            />
        </Stack>
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

const ccfrPeople: Application['ccfrCollaborators'] = [
    {
        centerNumber: 13,
        ccfrSite: 'Melbourne University',
        sitePIName: 'John',
        sitePIDegree: 'Phd'
    },
    {
        centerNumber: 15,
        ccfrSite: 'RMIT University',
        sitePIName: 'Kenneth',
        sitePIDegree: 'Phd'
    }
];