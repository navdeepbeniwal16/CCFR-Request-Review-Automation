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
            ...appdata as unknown as Application,
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

function Section0({ form }:{
    form: UseFormReturnType<Application>
    existingApplication?: Application
    readOnly?: boolean;

}){
    return (
        <Box>
            <h1>{'BWG Form'}</h1>
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
    const existingBio = appdata.biospecimenRequired.filter(data => data.quantity)
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
            <h1>{'Section 1: Amount of Biospecimen Requested'}</h1>
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
            <h1>{'Section 2: Methodology & Testing'}</h1>

            <Textarea
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

            <h1>{'Section 3: Clarifications'}</h1>
            <Radio.Group 
                spacing="xl" 
                label="Does applicant anticipate >1 dispatch, e.g., a 2nd dispatch to validate initial findings?"
                {...form.getInputProps('biospecimenForm.clarifications.additionalDispatchRequirement')}
                >
                <Radio value="Yes" label="Yes" />
                <Radio value="No" label="No" />
                <Radio value="TBD" label="TBD" />
            </Radio.Group>

            <Radio.Group 
                spacing="xl"
                label="If requesting DNA, will fluorescent dye quantification be required?"
                {...form.getInputProps('biospecimenForm.clarifications.fluoroscentDyeQuantificationRequired')}
                >
                <Radio value="Yes" label="Yes" />
                <Radio value="No" label="No" />
                <Radio value="TBD" label="TBD" />
            </Radio.Group>

            <Radio.Group 
                spacing="xl"
                label="If blood-derived DNA is not available, will LCL-derived DNA be acceptable?"
                {...form.getInputProps('biospecimenForm.clarifications.LCLDerivedDNAAcceptable')}
                >
                <Radio value="Yes" label="Yes" />
                <Radio value="No" label="No" />
                <Radio value="TBD" label="TBD" />
            </Radio.Group>

            <Radio.Group 
                spacing="xl"
                label="If blood-derived DNA is not available, will saliva-derived DNA be acceptable?"
                {...form.getInputProps('biospecimenForm.clarifications.salivaAcceptable')}
                >
                <Radio value="Yes" label="Yes" />
                <Radio value="No" label="No" />
                <Radio value="TBD" label="TBD" />
            </Radio.Group>

            <Radio.Group 
                spacing="xl"
                label="Will participants with depleted blood/saliva/LCL DNA samples requiring DNA extraction be excluded or will extractions be requested?"
                {...form.getInputProps('biospecimenForm.clarifications.depletedDNASampleRequest')}
                >
                <Radio value="Exclude Sample(s)" label="Exclude Sample(s)" />
                <Radio value="Extract at CCFR Site(s)" label="Extract at CCFR Site(s)" />
                <Radio value="TBD" label="TBD" />
            </Radio.Group>

            <Radio.Group 
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
                    label="Minimum NC"
                    {...form.getInputProps('biospecimenForm.clarifications.neoplasticCellularity.minNC')}
                />
                <TextInput
                    label="Minimum Volume"
                    {...form.getInputProps('biospecimenForm.clarifications.neoplasticCellularity.minVolume')}

                />
            </Group>
            <Text>If requesting normal FFPE (slides or DNA), what is the minimum normal volume (mm3) needed?</Text>
            
            <TextInput
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
            <h1>{'Section 4: Biospecimen Working Group Review Conclusions'}</h1>
            <Textarea
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

const appdata = {
    "id": "16",
    "address": {
        "city": "Rochester",
        "streetName": "200 1st St SW",
        "country": "United States",
        "state": "Minnesota",
        "zipcode": "55902"
    },
    "productCommercialization": false,
    "studyDescription": {
        "abstract": "We have recently studied 64 individuals in whom CRC showed loss of MSH2 expression (as part of our molecular characterization core projects)but no germline mutations were evident. Based on a single case of familial MSH2 methyltion (with variable degrees of methylation within that family) DNA was extracted from tumors and forwarded to Dr. Laird for methylation of MMR genes.  Unfortunately, only a minority of cases had useable tumor DNA. However, three tumors showed some MSH2 methylation.  We then requested genomic DNA on these 3 cases, however, there was no germline methylation detected.  As these tests were being finalized, a new mechanism for MSH2 silencing/methylation was discovered as shown in this publication:\"Heritable somatic methylation and inactivation of MSH2 in families with Lynch syndrome due to deletion of the 3' exons of TACSTD1\"  Ligtenberg et al.,  in Nature Genet vol 41(1)Jan 2009.  The Colon CFR has access to more of these MSH2 cases than many other investigators, and the study we began clearly needs to address this new discovery to be complete or useful.  We propose to request genomic DNA on the original 64 cases and conduct deletion testing for TACSTD1, a gene adjacent to MSH2, to determine how frequently this is present in our cases with loss of MSH2 expression and no germline MSH2 mutation. Two ug of DNA will be requested to assess methylation and deletion in the lab of Dr. Thibodeau, to correlate with the finding in Dr Laird's lab.  This is presented as a modification to the ongoing previously approved study that needed to be updated to be of any relevance.  ",
        "preliminaryData": "A  two-stage  case–control  study.  The  phase  I  contained  1,524  patients  with colorectal cancer and 1,522 cancerfree controls recruited from the cancer hospital of Chinese  Academy  of  Medical  Sciences  in  Beijing,  China.  The  phase  II  consisting  of 4,500  cases  and  8,500  cancer-free  controls  were  recruited  from  Tongji  Hospital  of Huazhong University of Science and Technology (HUST, Wuhan, China).",
        "backgroundAndSignificance": "Colorectal  cancer  (CRC)  is  a  cancer  that  is  preventable  by  modifying  environmental and    lifestyle    interventions    for    human    ecological    development.    Well-defined environmental  interventions  may  improve  cancer  treatment  effects,  prevent  cancer progression   and   increase   survival   through   epigenetic   mechanisms   with   gene environment interactions. Approximately 70% of CRC is related to environmental and lifestyle  factors,  while  about  30%  of  CRC  risk  is  inheritable  with  5%  being  highly aggressive in cancer progression for metastatic penetrance. Hence, the most common risks for CRC are preventable by cultivating healthy lifestyles and environments to help keep the human epigenetic environment free from cancers.",
        "aims": "To determine whether and to what degree the risk of colorectal cancer, and other cancers, in carriers of germline mutations in mismatch genes is dependent on (modified by) environmental and other genetic factors and whether and to what degree these effects can be detected using modified segregation analysis of family data.",
        "selectionCriteria": "We will use our novel statistical methods to discover GxE interaction for CRC with rare  and  common  single  nucleotide  variants  (down  to  MAF  0.1%)  in  in  cohort  of 19,546 Participants aged at 50-74 and participants up to 53,600 cases and 52,400 controls  of  European  descent.  And  extract  the  environmental  data  from  42000 participants from more than 15,000 families to make the model more comprehensive."
    },
    "BWGChairReview": {
        "name": "Becky Wagger",
        "status": "Approved"
    },
    "ccfrCollaborators": [
        {
            "sitePIDegree": "MD",
            "sitePIName": "Steve Gallinger",
            "centerNumber": "11",
            "ccfrSite": "Ontario Familial Colorectal Cancer Registry"
        },
        {
            "ccfrSite": "University of Melbourne",
            "sitePIName": "Bob Smith"
        }
    ],
    "email": "nlindor@mayo.edu",
    "steeringCommitteeReview": {
        "reviewers": [
            {
                "status": "Approved",
                "name": "Robert Drey"
            },
            {
                "name": "Cher Lee",
                "status": "Approved"
            },
            {
                "status": "Approved",
                "name": "Albert Joshua"
            }
        ],
        "firstAcceptance": "2022-09-19T14:00:00.817Z",
        "reviewStartDate": "2022-09-18T14:00:00.678Z",
        "numberOfReviewersAccepted": "3",
        "totalReviewers": "3"
    },
    "institutionSecondary": {
        "jobTitle": "PhD",
        "department": "INT",
        "investigator": "Mark Jenkins",
        "institution": "University of Melbourne",
        "accessType": "Data"
    },
    "dataReceiptDeadline": "2022-10-07T13:00:00.247Z",
    "biospecimenRequired": [
        {
            "numSamples": "50",
            "type": "lymphocyte DNA",
            "name": "Colorectal cancer cases diagnosed under the age of 35 yrs from population-based ascertainment",
            "quantity": 200
        },
        {
            "numSamples": "200",
            "type": "DNA from fresh frozen tumor tissue",
            "quantity": 3,
            "name": "MYH mutation carriers with a diagnosis of colorectal cancer at any age"
        }
    ],
    "phoneNumber": "0475826483",
    "stage": "Complete",
    "biospecimenForm": {
        "clarifications": {
            "BWGGroupConclusions": "All good",
            "applicantCommentResponse": "N/A",
            "depletedDNASampleRequest": "Extract at CCFR Site(s)",
            "fluoroscentDyeQuantificationRequired": "No",
            "LCLDerivedDNAAcceptable": "Yes",
            "additionalDispatchRequirement": "No"
        },
        "BWGStatusReview": "Approved",
        "amountRequired": "50",
        "proposedTestingMethodlogy": "A testing methodology"
    },
    "programManagerReview": {
        "name": "Samantha Fox",
        "status": "Approved"
    },
    "history": [],
    "title": "Methylation of the MMR Genes in Individuals with Loss of Expression of MSH2 in CRC but No Mutation Detected. ",
    "biospecimenReceiptDeadline": "2022-10-07T13:00:00.947Z",
    "institutionPrimary": {
        "department": "CORE",
        "accessType": "Both",
        "jobTitle": "MD",
        "investigator": "Noralane Lindor ",
        "institution": "Mayo Clinic"
    },
    "status": "Accepted",
    "dataRequired": [
        {
            "numSamples": 50,
            "type": "Family history of cancer data",
            "name": "Colorectal cancer cases diagnosed under the age of 35 yrs from population-based ascertainment"
        },
        {
            "name": "Female MMR mutation carriers with no previous diagnosis of any cancer",
            "type": "Baseline epi/risk factor questionnaire data",
            "numSamples": 100
        },
        {
            "numSamples": 200,
            "type": "Molecular data",
            "name": "MYH mutation carriers with a diagnosis of colorectal cancer at any age"
        }
    ],
    "createdAt": "2022-09-21T14:00:00.170Z"
}